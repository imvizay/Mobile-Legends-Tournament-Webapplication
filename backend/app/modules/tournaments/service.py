from fastapi import UploadFile
from app.modules.auth.models import Player
from .repository import TournamentRepository
from .schema import *
from .models import Tournament, TournamentStatus
from ...core.cloudinary.cloudinary_services import cloud_service
from .validators import validate_image
from datetime import timezone


class TournamentService:

    def __init__(self, repository: TournamentRepository):
        self.repository = repository

    def get_tournament_detail(self, tournament_id):
        detail = self.repository.get_tournament_detail(tournament_id=tournament_id)
        return TournamentDetailResponse(
            success="DONE.", data=TournamentListResponse.model_validate(detail)
        )

    def get_tournaments(self, current_user: Player):

        if current_user.role == "admin":
            results = self.repository.load_tournaments()

            return AdminTournamentRes(tournament=results)

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
            result = cloud_service.upload_image(value, folder=f"tournament/{key}")

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

    def update_tournament(self, tournament_id, validated_data):
        pass

    def publish_tournament(self, tournament_id: int, current_user: Player):

        tournament = self.repository.publish_tournament(tournament_id)

        return {
            "success": True,
            "status": 200,
            "message": "Tournament published {tournament.tournament_name}",
        }

    def cancel_tournament(self, tournament_id):
        pass

    # admin operational route service
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
        tournament = self.repository.get_tournament(
            ongoing_tournament_id=ongoing_tournament_id
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


class BracketService:
    def __init__(self, repository: TournamentRepository):
        self.repository = repository

    def get_initial_bracket_data(self, tournament_id: int):

        if not tournament_id:
            return {
                "code": 400,
                "status": "BAD_REQUEST",
                "message": "required credentials not provided",
            }

        try:
            # get tournament
            tournament = self.repository.get_tournament(tournament_id)
            if not tournament:
                raise {
                    "status": 400,
                    "code": "NOT_FOUND",
                    "message": "tournament with this tournament id:{tournament_id} not found.",
                }

            teams = self.repository.get_initial_bracket_team_data(
                tournament_id=tournament_id
            )

            # get all approved team for this tournament
            return {
                "status": 200,
                "code": "OK",
                "data": {"tournament": tournament, "teams": teams or []},
            }

        except Exception as e:
            raise

    def create_initial_round(self, tournament_id: int, payload: RoundCreateRequest):

        if not tournament_id:
            return {
                "success": False,
                "message": "Missing tournament ID.",
            }

        tournament = self.repository.tournament_registration_by_id(
            tournament_id=tournament_id
        )

        if not tournament:
            return {
                "success": False,
                "message": "Tournament not found.",
            }

        round_type = payload.round_type or "round_1"

        allowed_round_types = {
            "round_1",
            "round_2",
            "quarter_final",
            "semi_final",
            "final",
        }

        if round_type not in allowed_round_types:
            return {
                "success": False,
                "message": f"Invalid round type: {round_type}.",
            }

        existing_round = self.repository.get_round_by_type(
            tournament_id=tournament_id,
            round_type=round_type,
        )

        if existing_round:
            return {
                "success": False,
                "message": f"{round_type} already exists for this tournament.",
            }

        if not payload.matches:
            return {
                "success": False,
                "message": "At least one match is required.",
            }

        matches = [
            {
                "match_number": match.match_number,
                "team_a_id": match.team.id,
                "team_b_id": match.opponent.id,
                "scheduled_at": match.scheduled_at,
            }
            for match in payload.matches
        ]

        match_numbers = [match["match_number"] for match in matches]

        if len(match_numbers) != len(set(match_numbers)):
            return {
                "success": False,
                "message": "Duplicate match numbers are not allowed.",
            }

        submitted_team_ids_list = [
            team_id
            for match in matches
            for team_id in (match["team_a_id"], match["team_b_id"])
        ]

        duplicate_team_ids = [
            team_id
            for team_id in set(submitted_team_ids_list)
            if submitted_team_ids_list.count(team_id) > 1
        ]

        if duplicate_team_ids:
            return {
                "success": False,
                "message": f"A team cannot participate in more than one {round_type} match.",
                "duplicate_team_ids": duplicate_team_ids,
            }

        submitted_team_ids = set(submitted_team_ids_list)

        registered_teams = self.repository.get_registered_teams(
            tournament_id=tournament_id
        )

        if not registered_teams:
            return {
                "success": False,
                "message": f"No approved team registrations found for tournament {tournament_id}.",
            }

        registered_team_ids = {
            registration.team_id for registration in registered_teams
        }

        invalid_team_ids = submitted_team_ids - registered_team_ids

        if invalid_team_ids:
            return {
                "success": False,
                "message": "One or more submitted teams are not registered for this tournament.",
                "invalid_team_ids": sorted(invalid_team_ids),
            }

        bye_team_ids = registered_team_ids - submitted_team_ids

        schedule_error = self._validate_match_schedules(
            matches=matches,
            tournament=tournament,
        )

        if schedule_error:
            return schedule_error

        created_round = self.repository.create_round(
            tournament_id=tournament_id,
            round_number=1,
            round_type=round_type,
            matches=matches,
        )

        return {
            "success": True,
            "message": f"{round_type} created successfully.",
            "tournament_id": tournament_id,
            "round_type": round_type,
            "round_id": created_round.id,
            "matches": matches,
            "bye_team_ids": sorted(bye_team_ids),
        }

    def _validate_match_schedules(self, matches, tournament):
        current_datetime = datetime.now(timezone.utc)

        tournament_start = tournament.starts_at
        tournament_end = tournament.ends_at

        if tournament_start.tzinfo is None:
            tournament_start = tournament_start.replace(tzinfo=timezone.utc)

        if tournament_end.tzinfo is None:
            tournament_end = tournament_end.replace(tzinfo=timezone.utc)

        for match in matches:
            scheduled_at = match["scheduled_at"]

            if not scheduled_at:
                return {
                    "success": False,
                    "message": (
                        f"Match {match['match_number']} "
                        "must have a scheduled date and time."
                    ),
                }

            if scheduled_at.tzinfo is None:
                scheduled_at = scheduled_at.replace(tzinfo=timezone.utc)

            if scheduled_at < current_datetime:
                return {
                    "success": False,
                    "message": (
                        f"Match {match['match_number']} "
                        "cannot be scheduled in the past."
                    ),
                }

            if scheduled_at < tournament_start:
                return {
                    "success": False,
                    "message": (
                        f"Match {match['match_number']} "
                        "cannot be scheduled before the tournament starts."
                    ),
                }

            if scheduled_at > tournament_end:
                return {
                    "success": False,
                    "message": (
                        f"Match {match['match_number']} "
                        "cannot be scheduled after the tournament ends."
                    ),
                }

        return None
