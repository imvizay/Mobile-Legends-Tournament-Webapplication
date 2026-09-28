from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user
from app.dependencies.roles import get_current_admin
from app.modules.auth.models import Player
from app.modules.tournaments.dependencies import get_tournament_service
from app.modules.tournaments.service import TournamentService

from .dependencies import get_player_dashboard_service, get_user_service
from .dashboard_service import PlayerDashboardService
from .service import UserService


router = APIRouter(prefix="/admin/users", tags=["Users"])

player_router = APIRouter(prefix="/player", tags=["Player"])


@router.get("/list")
def users(
    current_user: Player = Depends(get_current_admin),
    user_service: UserService = Depends(get_user_service),
):
    return user_service.get_users(current_user=current_user)


@player_router.get("/dashboard")
def get_dashboard(
    current_user: Player = Depends(get_current_user),
    dashboard_service: PlayerDashboardService = Depends(
        get_player_dashboard_service
    ),
):
    return dashboard_service.get_dashboard(current_user=current_user)


@player_router.get("/tournament/{tournament_id}/detail")
def tournament_detail(
    tournament_id: int,
    current_user: Player = Depends(get_current_user),
    tournament_service: TournamentService = Depends(get_tournament_service),
):
    return tournament_service.get_tournament_detail(tournament_id=tournament_id)
