from fastapi import APIRouter, Depends, UploadFile, File
from app.modules.auth.models import Player
from .dependencies import (
    get_bracket_service,
    get_tournament_form,
    get_tournament_service,
)
from .service import TournamentService
from .bracket_service import BracketService
from app.dependencies.roles import get_current_admin
from app.dependencies.auth import get_current_user
from .schemas import TournamentForm, RoundCreateRequest

router = APIRouter(prefix="/tournament", tags=["Tournaments"])


# admin
@router.post("/create")
async def create_tournament(
    data: TournamentForm = Depends(get_tournament_form),
    background_image: UploadFile | None = File(None),
    banner_image: UploadFile | None = File(None),
    current_user: Player = Depends(get_current_admin),
    tournament_service: TournamentService = Depends(get_tournament_service),
):

    return await tournament_service.create_tournament(
        admin=current_user,
        validated_data=data,
        background_image=background_image,
        banner_image=banner_image,
    )


# admin/users
@router.get("/tournaments")
def tournaments(
    current_user: Player = Depends(get_current_user),
    tournament_service: TournamentService = Depends(get_tournament_service),
):

    return tournament_service.get_tournaments(current_user=current_user)


# admin
@router.post("/{tournament_id}/publish")
def publish_tournaments(
    tournament_id: int,
    current_user: Player = Depends(get_current_admin),
    tournament_service: TournamentService = Depends(get_tournament_service),
):

    return tournament_service.publish_tournament(
        tournament_id=tournament_id, current_user=current_user
    )


# admin
@router.get("/ongoing-registrations")
def ongoing_tournament_registration(
    admin: Player = Depends(get_current_admin),
    tournament_service: TournamentService = Depends(get_tournament_service),
):
    return tournament_service.get_ongoing_tournament_registration(admin=admin)


# "GET /api/%27/tournament/ongoing-registration/1/details HTTP/1.1" 40
# admin tournament registration details
@router.get("/ongoing-registration/{ongoing_tournament_id}/details")
def ongoing_tournament_registration_detail(
    ongoing_tournament_id: int,
    admin: Player = Depends(get_current_admin),
    tournament_service: TournamentService = Depends(get_tournament_service),
):
    return tournament_service.get_ongoing_tournament_registration_detail(
        admin=admin, ongoing_tournament_id=ongoing_tournament_id
    )


# bracket
@router.get("/bracket/{tournament_id}/initialize-bracket")
def tournament_round_detail(
    tournament_id: int,
    admin: Player = Depends(get_current_admin),
    bracket_service: BracketService = Depends(get_bracket_service),
):
    return bracket_service.get_initial_bracket_data(tournament_id=tournament_id)


@router.post("/bracket/{tournament_id}/round")
def create_round(
    tournament_id: int,
    payload: RoundCreateRequest,
    admin: Player = Depends(get_current_admin),
    bracket_service: BracketService = Depends(get_bracket_service),
):
    return bracket_service.create_initial_round(
        tournament_id=tournament_id, payload=payload
    )


@router.get("/{tournament_id}/bracket")
def get_tournament_bracket(
    tournament_id: int,
    user: Player = Depends(get_current_user),
    bracket_service: BracketService = Depends(get_bracket_service),
):

    return bracket_service.get_tournament_bracket(
        tournament_id=tournament_id, user=user
    )
