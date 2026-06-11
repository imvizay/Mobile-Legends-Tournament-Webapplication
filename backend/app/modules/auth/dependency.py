

from app.core.db.session import get_db
from .service import AuthService,TokenService
from app.common.services.email_service import AuthEmailService
from .repository import AuthRepository
from sqlalchemy.orm import Session
from fastapi import Depends

def get_auth_repository(db:Session=Depends(get_db)):
    return AuthRepository(db)

def get_auth_email_service():
    return AuthEmailService()

def get_token_service():
    return TokenService()

def get_auth_service(
        repository:Session=Depends(get_auth_repository),
        email_service:  AuthEmailService = Depends(get_auth_email_service),
        token_service:TokenService = Depends(get_token_service)
    ):
    return AuthService(repository,email_service,token_service)


