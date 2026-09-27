from fastapi import APIRouter, Depends
from app.dependencies.roles import get_current_admin
from ..auth.models import Player
from .dependecies import get_tournament_registration_service
from .services import TournamentRegistrationService
from .schemas import TeamRegistrationFailedRequestSchema

# router
router = APIRouter(prefix="/team", tags=["Team Registration"])


@router.post("/{team_id}/registration/{registration_id}/approve")
def approve_team_registration(
    team_id: int,
    registration_id: int,
    admin: Player = Depends(get_current_admin),
    registration_service: TournamentRegistrationService = Depends(
        get_tournament_registration_service
    ),
):
    return registration_service.approve_registration(
        team_id=team_id, registration_id=registration_id, admin=admin
    )


@router.post("/{team_id}/registration/{registration_id}/roster/lock")
def lock_team_roster(
    team_id: int,
    registration_id: int,
    admin: Player = Depends(get_current_admin),
    registration_service: TournamentRegistrationService = Depends(
        get_tournament_registration_service
    ),
):
    return registration_service.lock_roster(
        team_id=team_id, registration_id=registration_id, admin=admin
    )


@router.post("/{team_id}/registration/{registration_id}/failed")
def team_registration_failed(
    team_id: int,
    registration_id: int,
    payload: TeamRegistrationFailedRequestSchema,
    admin: Player = Depends(get_current_admin),
    registration_service: TournamentRegistrationService = Depends(
        get_tournament_registration_service
    ),
):
    return registration_service.team_registration_failed(
        team_id=team_id, registration_id=registration_id, payload=payload
    )
