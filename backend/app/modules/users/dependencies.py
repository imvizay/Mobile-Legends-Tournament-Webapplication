from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.db.session import get_db

from .dashboard_repository import PlayerDashboardRepository
from .dashboard_service import PlayerDashboardService
from .repository import UserRepository
from .service import UserService


def get_player_dashboard_repository(
    db: Session = Depends(get_db),
) -> PlayerDashboardRepository:
    return PlayerDashboardRepository(db)


def get_user_repository(
    db: Session = Depends(get_db),
) -> UserRepository:
    return UserRepository(db)


def get_user_service(
    repository: UserRepository = Depends(get_user_repository),
) -> UserService:
    return UserService(repository)


def get_player_dashboard_service(
    repository: PlayerDashboardRepository = Depends(
        get_player_dashboard_repository
    ),
) -> PlayerDashboardService:
    return PlayerDashboardService(repository)
