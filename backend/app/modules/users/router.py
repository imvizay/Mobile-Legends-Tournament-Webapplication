from fastapi import APIRouter, Depends
from app.modules.auth.models import Player
from app.dependencies.roles import get_current_admin
from .service import UserService
from .dependency import get_user_service

router = APIRouter(prefix="/admin/users", tags=["Users"])


player_router = APIRouter(
    prefix="/player",
    tags=["Player"],
)


# Admin
@router.get("/list")
def users(
    current_user: Player = Depends(get_current_admin),
    user_service: UserService = Depends(get_user_service),
):

    return user_service.get_users(current_user=current_user)


# ─────────────────────────────
# Player
# ─────────────────────────────

from .service import PlayerDashboardService
from .dependency import get_dashboard_service
from app.dependencies.auth import get_current_user
from app.modules.tournaments.service import TournamentService
from app.modules.tournaments.dependency import get_tournament_service


@player_router.get("/dashboard")
def get_dashboard(
    current_user: Player = Depends(get_current_user),
    dashboard_service: PlayerDashboardService = Depends(
        get_dashboard_service
    ),
):
    return dashboard_service.get_dashboard(
        current_user=current_user
    )


@player_router.get("/featured")
def featured_tournament():
    pass

@player_router.get('/tournament/{tournament_id}/detail/')
def tournament_detail(
    tournament_id:int,
    tournament_service:TournamentService=Depends(get_tournament_service)
):
    
   return tournament_service.get_tournament_detail(tournament_id=tournament_id)


@player_router.get("/upcoming")
def upcoming_tournament():
    pass

@player_router.get("/recent_winner")
def recent_winner_history():
    pass


@player_router.get("/leaderboard")
def leaderboard():
    pass