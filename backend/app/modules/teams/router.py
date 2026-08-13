from fastapi import APIRouter, Request, Response, Depends, UploadFile, File
from app.modules.auth.models import Player
from .schemas import TeamCreateSchema
from app.dependencies.auth import get_current_user
from .services import TeamService, TeamTournamentService
from .dependency import get_team_service, get_teamtournament_service

# captain
from app.dependencies.roles import get_team_captain

router = APIRouter(prefix="/player/team", tags=["Team"])


@router.get("/dashboard")
def team_dashboard(
    current_user: Player = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service),
):
    return team_service.get_teamdashboard(current_user=current_user)


@router.get("/summary")
def my_team_summary(
    current_user: Player = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service),
):

    return team_service.get_my_team_summary(current_user=current_user)


# GET MY TEAM
@router.get("/my-team")
async def get_my_team(
    current_user: Player = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service),
):

    return team_service.get_my_team(current_user)


# CREATE TEAM
@router.post("/create")
async def create_team(
    payload: TeamCreateSchema = Depends(TeamCreateSchema.as_form),
    team_service: TeamService = Depends(get_team_service),
    logo: UploadFile | None = File(None),
    banner: UploadFile | None = File(None),
    current_user: Player = Depends(get_current_user),
):

    print("Create Team Endpoint Reached.")
    return team_service.create_team(payload, logo, banner, current_user)


# Search teams
@router.get("/discover")
async def discover_team(
    cursor: int | None = None,
    limit: int = 12,
    current_user: Player = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service),
):

    return team_service.discover_team(
        cursor=cursor, limit=limit, current_user=current_user
    )


# Join team
@router.post("/{team_id}/join")
async def join_team(
    team_id: int,
    current_user: Player = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service),
):

    return team_service.join_team(team_id, current_user)


# ======================================
# TEAM TOURNAMENTS ENDPOINTS
# ======================================


# Register the team for a tournament
@router.post("/tournament/{tournament_id}/register")
def register_team(
    tournament_id: int,
    current_user: Player = Depends(get_current_user),
    tournament_service: TeamTournamentService = Depends(get_teamtournament_service),
):

    return tournament_service.register_team_tournament(
        tournament_id=tournament_id, current_user=current_user
    )


# add Roster
@router.post("/tournament/{tournament_id}/roster/{player_id}")
def add_roster(
    tournament_id: int,
    player_id: int,
    captain: Player = Depends(get_team_captain),
    tournament_service: TeamTournamentService = Depends(get_teamtournament_service),
):
    return tournament_service.add_roster_player(
        tournament_id=tournament_id, player_id=player_id, captain=captain
    )


# CONFIRM ROSTER


@router.patch("/tournament/{registration_id}/roster/lock")
def confirm_roster(
    registration_id: int,
    captain: Player = Depends(get_team_captain),
    tournament_service: TeamTournamentService = Depends(get_teamtournament_service),
):
    return tournament_service.confirm_roster(
        registration_id=registration_id, captain=captain
    )


"GET /api/player/team/tournament/1/contribution HTTP/1.1"


@router.get("/tournament/{registration_id}/team/{team_id}/contribution")
def team_contribution(
    registration_id: int,
    team_id: int,
    current_user: Player = Depends(get_current_user),
    tournament_service: TeamTournamentService = Depends(get_teamtournament_service),
):

    return tournament_service.contribution_stats(
        registration_id=registration_id, team_id=team_id, current_user=current_user
    )
