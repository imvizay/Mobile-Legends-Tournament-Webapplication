

from app.core.db.session import get_db
from .service import AuthService
from .repository import AuthRepository
from sqlalchemy.orm import Session
from fastapi import Depends

def get_auth_repository(db:Session=Depends(get_db)):
    return AuthRepository(db)

def get_auth_service(repository:Session=Depends(get_auth_repository)):
    return AuthService(repository)
