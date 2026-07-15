from fastapi import Depends
from sqlalchemy.orm import Session
from .service import UserService,PlayerDashboardService
from .repository import UserRepository,PlayerDashboardRepository
from app.core.db.session import get_db


def dashboard_repository(db: Session=Depends(get_db)):
    return PlayerDashboardRepository(db)

def get_user_repository(db:Session=Depends(get_db)):
    return UserRepository(db)

def get_user_service(repository:UserRepository=Depends(get_user_repository)):
    return UserService(repository)


def get_dashboard_service(repository:PlayerDashboardRepository = Depends(dashboard_repository)):
    return PlayerDashboardService(repository)