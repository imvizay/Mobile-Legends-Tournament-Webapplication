import os
from passlib.context import CryptContext
from .repository import AuthRepository

from jose import jwt,JWTError
from app.core.config.settings import settings
from uuid import uuid4


from .models import Player,PendingRegistration
from .schema import AuthCreateRequest,RegistrationResponse,LoginRequest

from app.core.exceptions import exceptions
from fastapi.background import BackgroundTasks

# secrets
import secrets
from datetime import datetime,UTC,timedelta

from app.core.security.security import hash_password,verify_password

# background tasks
from app.common.services.email_service import AuthEmailService 
service = AuthEmailService()


password_context = CryptContext(
    schemes=['bcrypt'],
    deprecated="auto"
)

frontend_url = os.getenv("FRONTEND_URL")


class TokenService:

    ACCESS_TOKEN_EXPIRE_MINUTES = 6*60  # valid for 6 hours
    REFRESH_TOKEN_EXPIRE_DAYS = 1    # for 7 days

    SECRET_KEY = settings.SECRET_KEY
    ALGORITHM = "HS256"

    def create_access_token(self,user_id:int):
        payload = {
            "sub":str(user_id),
            "type":"access",
            "jti":str(uuid4()),
            "exp":datetime.now(UTC) + timedelta(minutes=self.ACCESS_TOKEN_EXPIRE_MINUTES)
        }
        access_token = jwt.encode(
            payload,
            self.SECRET_KEY,
            algorithm=self.ALGORITHM
        )

        return access_token

    def create_refresh_token(self,user_id:int):

        payload = {
            "sub":str(user_id),
            "type":"refresh",
            "jti":str(uuid4()),
            "exp":datetime.now(UTC) + timedelta(days=self.REFRESH_TOKEN_EXPIRE_DAYS)
        }

        refresh_token = jwt.encode(
            payload,
            self.SECRET_KEY,
            algorithm=self.ALGORITHM
        )

        return refresh_token

    def decode_token(self,token:str):

        try :
            payload = jwt.decode(
                token,
                self.SECRET_KEY,
                algorithms=[self.ALGORITHM]
            )

            return payload 
        
        except JWTError as error:
            print("JWT ERROR:",error)
            raise exceptions.InvalidTokenException()
            


    def verify_token_type(self,payload:dict,token_type:str):
        
        if payload.get('type') != token_type:
            raise exceptions.InvalidTokenException()
        
        return payload






class AuthService:

    def __init__(self,repository:AuthRepository,email_service:AuthEmailService , token_service:TokenService):
        self.repository = repository
        self.email_service = email_service
        self.token_service = token_service

    
    def login(self, payload: LoginRequest):

        current_user = self.repository.get_current_user(
            payload.email
        )

        if not current_user:
            raise exceptions.UserNotFoundException()

        if current_user.is_banned:
            raise exceptions.UserBannedException()

        if not verify_password( payload.password, current_user.password ):
            raise exceptions.InvalidCredentialsException()
        
        # generate access and refresh token
        access_token  = self.token_service.create_access_token(current_user.id)
        refresh_token = self.token_service.create_refresh_token(current_user.id)

        return {
            'access':access_token,
            'refresh':refresh_token,
            'user':{
                'id':current_user.id,
                'email':current_user.email
            }
        }


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
        
    
