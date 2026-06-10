import os
from passlib.context import CryptContext
from .repository import AuthRepository


from .models import Player,PendingRegistration
from .schema import AuthCreateRequest,RegistrationResponse

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

frontend_url = os.getenv("FRONTEND_URL")

class AuthService:

    def __init__(self,repository:AuthRepository,email_service:AuthEmailService):
        self.repository = repository
        self.email_service = email_service


    def resend_verification_token(self,email:str,bg_task: BackgroundTasks):

        # update old token data and send new token
        pending_user = self.repository.get_pending_user(email)

        if not pending_user:
            return RegistrationResponse(
                status="failed",
                message=f"No pending user found with this email : {email}"
            )
        
        # generate new token and new expiry
        secret_token = secrets.token_urlsafe(32)
        token_expiry = datetime.now(UTC) + timedelta(hours=24)

        # update token
        result = self.repository.resend_verification_token(
            pending_user,
            secret_token,
            token_expiry
        )
        
        verify_url = (
                    f"{frontend_url}/activate-account?token={secret_token}"
        )

        # resend email
        bg_task.add_task(
                    service.send_verification_email,
                    pending_user.email,
                    verify_url
        )
        
        return RegistrationResponse(
            status="pending",
            message="RESENT_LINK_DONE",
            expires_at=result.token_expire_at
        )

    def verify_registration_token(self, token:str):

        # check token expired or not
        pending_user = (
            self.repository.db.query(PendingRegistration)
            .filter(PendingRegistration.verification_token == token)
            .first()
        )

        if not pending_user:
            return RegistrationResponse(
                status="failed",
                message='no user found in the db associated with this token'
            )
        
        if pending_user.token_expire_at < datetime.now(UTC):
            return RegistrationResponse(
                status="failed",
                message="Verification token expired"
            )
    
        verified_user = self.repository.activate_pending_user(
            pending_user
        )

        return RegistrationResponse(
            status="success",
            message="account verified successfully."
        )
        

    def pending_registration(
            self,
            payload:AuthCreateRequest,
            bg_task:BackgroundTasks
        ):

       
        
        existing_user = self.repository.check_user_exists(payload.email)

        if(existing_user):
            raise exceptions.UserAlreadyExistsError("User Exists.")

        pending_user = self.repository.get_pending_user(payload.email)

        if(pending_user):

            # checks if token expire and resends it.
            if(pending_user.token_expire_at < datetime.now(UTC)):
                # generate new token
                secret_token = secrets.token_urlsafe(32) 
                
                # new expiry 
                token_expiry = datetime.now(UTC) + timedelta(hours=24)
                
                # update token status
                pending_user = self.repository.update_verification_token(
                    pending_user,
                    secret_token,
                    token_expiry
                )   

                verify_url = (
                    f"{frontend_url}/activate-account?token={secret_token}"
                )

                # send mail
                bg_task.add_task(
                    service.send_verification_email,
                    pending_user.email,
                    verify_url
                )

                return RegistrationResponse(
                    status="pending",
                    message="resent verification link",
                )
            
            else:
               return RegistrationResponse(
                    status="pending",
                    message="VERIFICATION_TOKEN_ALREADY_SENT",
                    expires_at=pending_user.token_expire_at,
                    email_sent_at=pending_user.email_sent_at
                )
        

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
        verify_url = (
            f"{frontend_url}/activate-account?token={secret_token}"
        )
        
        # verification email as background task.
        bg_task.add_task(
            self.email_service.send_verification_email,
            payload.email,
            verify_url
        )
        

        return pending_player
        
    