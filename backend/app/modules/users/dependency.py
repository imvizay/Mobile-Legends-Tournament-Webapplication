from fastapi import Depends
from sqlalchemy.orm import Session
from .service import UserService
from .repository import UserRepository
from app.core.db.session import get_db


def get_user_repository(db:Session=Depends(get_db)):
    return UserRepository(db)

def get_user_service(repository:UserRepository=Depends(get_user_repository)):
    return UserService(repository)