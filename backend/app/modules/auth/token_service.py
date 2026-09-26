from datetime import UTC, datetime, timedelta
from uuid import uuid4

from jose import JWTError, jwt

from app.core.config.settings import settings
from app.core.exceptions import exceptions


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
