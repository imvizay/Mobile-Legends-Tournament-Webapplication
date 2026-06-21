import os
from fastapi import HTTPException
from passlib.context import CryptContext
from .repository import AuthRepository,SessionRepository

from jose import jwt,JWTError
from app.core.config.settings import settings
from uuid import uuid4


from .models import Player,PendingRegistration,PlayerSession
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

    ACCESS_TOKEN_EXPIRE_MINUTES = 12*60  # valid for 12 hours
    REFRESH_TOKEN_EXPIRE_DAYS = 7    # for 7 days

    SECRET_KEY = settings.SECRET_KEY
    ALGORITHM = "HS256"

    def create_access_token(self,user_id:int):

        payload = {
            "sub": str(user_id),
            "type": "access",
            "jti": str(uuid4()),
            "exp": datetime.now(UTC) + timedelta(minutes=self.ACCESS_TOKEN_EXPIRE_MINUTES)
        }
        access_token = jwt.encode(
            payload,
            self.SECRET_KEY,
            algorithm=self.ALGORITHM
        )

        return access_token

    def create_refresh_token(  
            self,
            user_id: int,
            session_id: int,
            refresh_jti: str,
        ):

        payload = {
            "sub":str(user_id),
            "type":"refresh",
            "session_id":session_id,
            "jti":refresh_jti,
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




   

class SessionService:

    def __init__(self,token_service: TokenService,repository:SessionRepository):
        self.token_service = token_service
        self.repository = repository

    # pvt helper function

    def _validate_refresh_session(
        self,
        refresh_token: str
    ) -> tuple[PlayerSession, dict]:

        if not refresh_token:
            raise exceptions.InvalidTokenException()

        payload = self.token_service.decode_token(refresh_token)

        self.token_service.verify_token_type(payload,"refresh")

        session = self.repository.get_session_by_id(payload["session_id"])

        if session is None:
            raise exceptions.InvalidSessionException()

        if session.is_revoked:
            raise exceptions.RevokedTokenException()

        if session.refresh_jti != payload["jti"]:
            raise exceptions.InvalidTokenException()

        return session, payload


    def create_login_session(
            self,
            player:Player
        ):

        refresh_jti = str(uuid4())
        expires_at = (
            datetime.now(UTC) + timedelta(days=self.token_service.REFRESH_TOKEN_EXPIRE_DAYS)
        )

        session = self.repository.create_session(
            player_id=player.id,
            refresh_jti=refresh_jti,
            expires_at=expires_at
        )

        access_token = self.token_service.create_access_token(
            player.id
        )

        refresh_token = self.token_service.create_refresh_token(
            player.id,
            session.id,
            refresh_jti
        )

        return {
            "access": access_token,
            "refresh": refresh_token,
        }

    def refresh_session(
            self,
            refresh_token:str
        ):

        _,payload = self._validate_refresh_session(refresh_token)
        
        # new access token
        new_access = self.token_service.create_access_token(int(payload["sub"]))

        return{
            "access":new_access
        }
        

    def rotate_refresh_token():
        ...

    def revoke_session(self,refresh_token:str):

        session,_ = self._validate_refresh_session(refresh_token)

        self.repository.revoke_session(
            session,
            reason="logout"
        )
        
        # logget out successfully via router response

    def revoke_all_sessions():
        ...

    def cleanup_expired_sessions():
        ...



class AuthService:

    def __init__(
            self,
            session_service:SessionService,
            repository:AuthRepository,
            email_service:AuthEmailService, 
        ):
        
        self.session_service = session_service
        self.repository = repository
        self.email_service = email_service

    async def social_login(
        self,
        email: str,
        provider: str,
        provider_id: str
    ):

        user, created = self.repository.get_or_create_user(
            email=email,
            provider=provider,
            provider_id=provider_id
        )

        if user.is_banned:
            raise exceptions.UserBannedException()

        session = self.session_service.create_login_session(user)

        return {
            "access": session.access,
            "refresh": session.refresh,
            "message": (
                "Account Created Successfully."
                if created
                else "Login Successful."
            ),
            "user": {
                "id": user.id,
                "email": user.email,
                "role":user.role,
                "membership":user.is_membership_active
            }
        }


    
    def login(self, payload: LoginRequest):

        current_user = self.repository.get_current_user(
            payload.email
        )

        if not current_user:
            raise exceptions.UserNotFoundException()

        if current_user.is_banned:
            raise exceptions.UserBannedException()
        
        if current_user.provider != "email":
            raise HTTPException(
                status_code=400,
                detail=f"This account was created using {current_user.provider}. Please sign in with that provider."
            )

        if not verify_password( payload.password, current_user.password ):
            raise exceptions.InvalidCredentialsException()
        
        session =  self.session_service.create_login_session(current_user)

        return {
            "access":session['access'],
            "refresh":session['refresh'],
            "user":{
                "id":current_user.id,
                "email":current_user.email,
                "role":current_user.role,
                "membership":current_user.is_membership_active
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
        
 