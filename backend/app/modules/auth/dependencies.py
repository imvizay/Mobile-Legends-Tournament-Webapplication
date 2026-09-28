from app.core.db.session import get_db
from .service import AuthService
from .token_service import TokenService
from .session_service import SessionService
from app.integrations.email.service import AuthEmailService
from .repository import AuthRepository
from .session_repository import SessionRepository
from sqlalchemy.orm import Session
from fastapi import Depends


def get_session_repository(db: Session = Depends(get_db)):
    return SessionRepository(db)


def get_auth_repository(db: Session = Depends(get_db)):
    return AuthRepository(db)


def get_auth_email_service():
    return AuthEmailService()


def get_token_service():
    return TokenService()


def get_session_service(
    token_service: TokenService = Depends(get_token_service),
    repository: SessionRepository = Depends(get_session_repository),
):
    return SessionService(token_service, repository)


def get_auth_service(
    session_service: SessionService = Depends(get_session_service),
    repository: AuthRepository = Depends(get_auth_repository),
    email_service: AuthEmailService = Depends(get_auth_email_service),
):

    return AuthService(
        session_service,
        repository,
        email_service,
    )
