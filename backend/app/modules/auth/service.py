import os
from passlib.context import CryptContext
from .repository import AuthRepository
from .models import Player,PendingRegistration
from .schema import AuthCreateRequest
from app.core.exceptions import exceptions
from fastapi.background import BackgroundTasks

# secrets
import secrets
from datetime import datetime,UTC,timedelta

# background tasks
from app.common.services.email_service import AuthEmailService 
service = AuthEmailService()


password_context = CryptContext(
    schemes=['bcrypt'],
    deprecated="auto"
)

class AuthService:

    def __init__(self,repository:AuthRepository,email_service:AuthEmailService):
        self.repository = repository
        self.email_service = email_service

    def pending_registration(
            self,
            payload:AuthCreateRequest,
            bg_task:BackgroundTasks
        ):

        existing_user = self.repository.check_user_exists(payload.email)

        if(existing_user):
            raise exceptions.UserAlreadyExistsError("User Exists.")

        pending_user = self.repository.get_pending_email(payload.email)

        if(pending_user):
            if(pending_user.token_expire_at < datetime.now(UTC)):
                # generate new token
                secret_token = secrets.token_urlsafe(32) 
                
                # new expiry 
                token_expiry = datetime.now(UTC) + timedelta(hours=24)
                
                # update token status
                self.repository.update_verification_token(
                    pending_user,
                    secret_token,
                    token_expiry
                )   

                verify_url = (
                    f"{backend}/api/auth/verify-email?token={secret_token}"
                )

                # send mail
                bg_task.add_task(
                    service.send_verification_email,
                    pending_user.email,
                    verify_url
                )

                return {
                    "message":f"resent verification link at email address {pending_user.email}."
                }
                

            else:
                 raise exceptions.PendingRegistrationExistsError({
                    "status": "pending",
                    "message": "Verification email already sent",
                    "email_sent_at": pending_user.email_sent_at
                 })
        

        # hashpassword
        hashed_password = password_context.hash(payload.password)
        
        # generate token length 32
        secret_token = secrets.token_urlsafe(32) 
        token_expiry = datetime.now(UTC) + timedelta(hours=24) # invalidate token after 24 hrs

        # create pending record with expiry
        pending_registratiion = PendingRegistration(
            email=payload.email,
            password=hashed_password,
            provider=payload.provider,
            verification_token=secret_token,
            token_expire_at=token_expiry
        )

        pending_player = (
            self.repository.create_pending_user(pending_registratiion)
        )

        # verification url 
        backend = os.getenv("BACKEND_URL")
        verify_url = (
            f"{backend}/api/auth/verify-email?token={secret_token}"
        )
        
        # verification email as background task.
        bg_task.add_task(
            self.email_service.send_verification_email,
            payload.email,
            verify_url
        )
        

        return pending_player
        
    