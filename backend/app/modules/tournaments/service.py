from fastapi import UploadFile

from app.integrations.cloudinary.service import cloudinary_service
from app.modules.auth.models import Player
from app.common.validators.image import validate_image

from .models import Tournament, TournamentStatus
from .repository import TournamentRepository
from .schemas import (
    AdminTournamentRes,
    OngoingRegistrationTeamContributionResponse,
    OngoingRegistrationTeamResponse,
    OngoingTournamentHeaderResponse,
    OngoingTournamentRegistrationListResponse,
    OngoingTournamentResponse,
    TournamentDetailResponse,
    TournamentForm,
    TournamentListResponse,
)


class TournamentService:

    def __init__(self, repository: TournamentRepository):
        self.repository = repository

    def get_tournament_detail(self, tournament_id):
        detail = self.repository.get_tournament_by_id(tournament_id=tournament_id)
        return TournamentDetailResponse(
            success="DONE.", data=TournamentListResponse.model_validate(detail)
        )

    def get_tournaments(self, current_user: Player):
        results = self.repository.load_tournaments()
        return AdminTournamentRes(tournament=results)

    async def create_tournament(
        self,
        admin: Player,
        validated_data: TournamentForm,
        background_image: UploadFile | None,
        banner_image: UploadFile | None,
    ):

        # return early if tournament_name is already in db
        tournament_name = validated_data.tournament_name or None

        if tournament_name:
            exists = self.repository.check_tournament_name(tournament_name)
            if exists:
                return {
                    "success": False,
                    "status": 400,
                    "message": "Tournament name already exists.",
                }

        images = {"background_image": background_image, "banner_image": banner_image}

        image_data = {}

        for key, value in images.items():

            if not value:
                continue

            validate_image(value)

            # upload cloudinary
            result = cloudinary_service.upload_image(value, folder=f"tournament/{key}")

            image_data[key] = {
                "public_id": result["public_id"],
                "url": result["secure_url"],
            }

        tournament_data = validated_data.model_dump()

        tournament_data.update(image_data)

        tournament_data["created_by"] = admin.id

        created_tournament = self.repository.create_tournament(tournament_data)

        return {
            "success": True,
            "status": 201,
            "message": f"Tournament: {created_tournament.tournament_name} created successfully.",
        }


    def publish_tournament(self, tournament_id: int, current_user: Player):

        tournament = self.repository.publish_tournament(tournament_id)

        return {
            "success": True,
            "status": 200,
            "message": f"Tournament published {tournament.tournament_name}",
        }


    def get_ongoing_tournament_registration(self, admin: Player):
        ongoing_tournaments = (
            self.repository.check_and_get_ongoing_tournament_registration()
        )

        data = []

        for tournament, registration_count in ongoing_tournaments:
            tournament_data = {
                column.name: getattr(tournament, column.name)
                for column in Tournament.__table__.columns
            }

            tournament_data["registration_count"] = registration_count

            data.append(TournamentListResponse.model_validate(tournament_data))

        return OngoingTournamentResponse(
            code=200,
            message="success",
            data=data,
        )

    def get_ongoing_tournament_registration_detail(
        self,
        admin: Player,
        ongoing_tournament_id: int,
    ):
        # check tournament
        tournament = self.repository.get_tournament_by_id(
            tournament_id=ongoing_tournament_id
        )

        # if not found return
        if not tournament:
            return {
                "code": 404,
                "status": "TOURNAMENT_NOT_FOUND",
                "message": f"Tournament with id {ongoing_tournament_id} was not found.",
            }

        if tournament.status in (
            TournamentStatus.COMPLETED,
            TournamentStatus.CANCELLED,
        ):
            return {
                "code": 400,
                "status": "TOURNAMENT_NOT_ONGOING",
                "message": f"Tournament is {tournament.status.value}.",
            }

        registrations = (
            self.repository.check_and_get_ongoing_tournament_registration_detail(
                ongoing_tournament_id=ongoing_tournament_id
            )
        )

        # Tournament schema
        tournament_response = OngoingTournamentHeaderResponse(
            id=tournament.id,
            background_image_url=tournament.background_image_url,
            tournament_name=tournament.tournament_name,
            game_name=tournament.game_name,
            min_teams=tournament.min_teams,
            max_teams=tournament.max_teams,
            prize_pool=tournament.prize_pool,
            entry_fee=tournament.entry_fee,
            registration_opens_at=tournament.registration_opens_at,
            registration_closes_at=tournament.registration_closes_at,
            starts_at=tournament.starts_at,
            ends_at=tournament.ends_at,
            bracket_format=tournament.bracket_format,
            tournament_type=tournament.tournament_type,
            server=tournament.server,
            status=tournament.status,
        )

        # Registration schemas
        registration_response = []

        for registration in registrations:

            contribution_response = []

            if registration.roster:
                for roster_player in registration.roster.players:

                    if roster_player.contribution:
                        contribution_response.append(
                            OngoingRegistrationTeamContributionResponse(
                                id=roster_player.contribution.id,
                                roster_player_id=roster_player.id,
                                player_id=roster_player.player_id,
                                status=roster_player.contribution.status.value,
                                paid_at=roster_player.contribution.paid_at,
                            )
                        )

            registration_response.append(
                OngoingRegistrationTeamResponse(
                    registration_id=registration.id,
                    team_id=registration.team_id,
                    team_logo_url=registration.team.logo_url,
                    team_name=registration.team.name,
                    team_tag=registration.team.tag,
                    captain_id=registration.captain.id,
                    captain_username=registration.captain.username,
                    captain_email=registration.captain.email,
                    captain_mlbb_id=registration.captain.mlbb_id,
                    contribution=contribution_response,
                    # team's registration and roster status
                    team_registration_id=registration.id,
                    roster_status=roster_player.roster.status,
                    registration_status=registration.status,
                )
            )

        # Final response schema
        return OngoingTournamentRegistrationListResponse(
            tournament=tournament_response,
            registrations=registration_response,
        )

