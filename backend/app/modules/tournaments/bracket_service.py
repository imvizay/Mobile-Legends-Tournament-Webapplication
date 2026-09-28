from datetime import datetime, timezone

from app.modules.auth.models import Player
from app.modules.teams.models import TeamTournamentRegistration

from .models import TournamentStatus
from .repository import TournamentRepository
from .schemas import RoundCreateRequest


class BracketService:
    """Read and mutate the tournament bracket without coupling the UI to DB state."""

    ROUND_TYPES = {
        "round_1",
        "round_2",
        "quarter_final",
        "semi_final",
        "final",
    }

    def __init__(self, repository: TournamentRepository):
        self.repository = repository

    def get_tournament_bracket(
        self,
        tournament_id: int,
        user: Player | None = None,
    ):
        if not tournament_id:
            return {
                "code": 400,
                "status": "BAD_REQUEST",
                "message": "Tournament ID is required.",
            }

        tournament = self.repository.get_tournament_by_id(tournament_id)

        if not tournament:
            return {
                "code": 404,
                "status": "NOT_FOUND",
                "message": "Tournament not found.",
            }

        if tournament.status in (
            TournamentStatus.CANCELLED.value,
            TournamentStatus.COMPLETED.value,
        ):
            return {
                "code": 400,
                "status": "BAD_REQUEST",
                "message": "Tournament is either cancelled or completed.",
            }

        registered_teams = self.repository.get_registered_teams(tournament_id)
        existing_rounds = self.repository.get_tournament_bracket(tournament_id)

        bracket = self._build_bracket_projection(
            registered_teams=registered_teams,
            existing_rounds=existing_rounds,
        )

        return {
            "code": 200,
            "status": "SUCCESS",
            "message": "Tournament bracket fetched successfully.",
            "tournament_id": tournament.id,
            "bracket_status": tournament.bracket_status,
            "bracket": bracket,
        }

    def get_initial_bracket_data(self, tournament_id: int):
        """Return the approved teams available to the admin bracket builder."""
        if not tournament_id:
            return {
                "code": 400,
                "status": "BAD_REQUEST",
                "message": "Tournament ID is required.",
            }

        tournament = self.repository.get_tournament_by_id(tournament_id)
        if not tournament:
            return {
                "code": 404,
                "status": "NOT_FOUND",
                "message": "Tournament not found.",
            }

        registrations = self.repository.get_registered_teams(tournament_id)

        return {
            "code": 200,
            "status": "SUCCESS",
            "message": "Registered teams fetched successfully.",
            "tournament_id": tournament.id,
            "teams": [self._serialize_registered_team(registration) for registration in registrations],
        }

    def create_initial_round(
        self,
        tournament_id: int,
        payload: RoundCreateRequest,
    ):
        if not tournament_id:
            return {
                "success": False,
                "message": "Missing tournament ID.",
            }

        tournament = self.repository.get_tournament_by_id(tournament_id)

        if not tournament:
            return {
                "success": False,
                "message": "Tournament not found.",
            }

        round_type = payload.round_type or "round_1"

        if round_type not in self.ROUND_TYPES:
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

        submitted_team_ids = {
            team_id
            for match in matches
            for team_id in (match["team_a_id"], match["team_b_id"])
            if team_id is not None
        }

        all_submitted_team_ids = [
            team_id
            for match in matches
            for team_id in (match["team_a_id"], match["team_b_id"])
            if team_id is not None
        ]

        duplicate_team_ids = sorted(
            team_id
            for team_id in set(all_submitted_team_ids)
            if all_submitted_team_ids.count(team_id) > 1
        )

        if duplicate_team_ids:
            return {
                "success": False,
                "message": f"A team cannot participate in more than one {round_type} match.",
                "duplicate_team_ids": duplicate_team_ids,
            }

        registered_teams = self.repository.get_registered_teams(tournament_id)

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

        bye_team_ids = sorted(registered_team_ids - submitted_team_ids)

        schedule_error = self._validate_match_schedules(
            matches=matches,
            tournament=tournament,
        )

        if schedule_error:
            return schedule_error

        created_round = self.repository.create_round(
            tournament=tournament,
            round_number=self._resolve_round_number(round_type, tournament_id),
            round_type=round_type,
            matches=matches,
        )

        if not created_round:
            return {
                "success": False,
                "message": "Failed to create round.",
            }

        self.repository.db.commit()

        return {
            "success": True,
            "message": f"{round_type} created successfully.",
            "tournament_id": tournament_id,
            "round_type": round_type,
            "round_id": created_round.id,
            "matches": matches,
            "bye_team_ids": bye_team_ids,
        }

    def _build_bracket_projection(
        self,
        registered_teams: list[TeamTournamentRegistration],
        existing_rounds,
    ):
        team_count = len(registered_teams)

        if team_count < 2:
            return {
                "registered_team_count": team_count,
                "bracket_size": team_count,
                "total_rounds": 0,
                "rounds": [],
                "byes": [],
            }

        bracket_size = self._next_power_of_two(team_count)
        total_rounds = bracket_size.bit_length() - 1

        existing_round_map = {
            round_obj.round_number: round_obj
            for round_obj in existing_rounds
        }

        rounds = []

        for round_number in range(1, total_rounds + 1):
            round_type = self._resolve_round_type(
                round_number,
                total_rounds,
            )
            match_count = self._resolve_match_count(
                round_number,
                bracket_size,
                team_count,
            )

            existing_round = existing_round_map.get(round_number)

            if existing_round:
                matches = [
                    self._serialize_match(match)
                    for match in sorted(
                        existing_round.matches,
                        key=lambda item: item.match_number,
                    )
                ]
                round_status = existing_round.status
            else:
                matches = self._build_empty_matches(match_count)
                round_status = "NOT_STARTED"

            rounds.append(
                {
                    "round_number": round_number,
                    "round_type": round_type,
                    "match_format": "BO5" if round_type == "final" else "BO3",
                    "status": round_status,
                    "match_count": match_count,
                    "matches": matches,
                }
            )

        return {
            "registered_team_count": team_count,
            "bracket_size": bracket_size,
            "total_rounds": total_rounds,
            "rounds": rounds,
            "byes": self._build_byes(
                registered_teams,
                existing_round_map,
                total_rounds,
            ),
        }

    def _serialize_registered_team(self, registration):
        team = registration.team
        return {
            "registration_id": registration.id,
            "team": self._serialize_team(team),
        }

    @staticmethod
    def _serialize_team(team):
        if team is None:
            return None

        return {
            "id": team.id,
            "name": team.name,
            "tag": team.tag,
            "logo": team.logo_url,
        }

    def _serialize_match(self, match):
        return {
            "match_id": match.id,
            "match_number": match.match_number,
            "team_a": self._serialize_team(match.team_a),
            "team_b": self._serialize_team(match.team_b),
            "winner_team_id": match.winner_team_id,
            "scheduled_at": match.scheduled_at,
            "status": match.status,
        }

    @staticmethod
    def _build_empty_matches(match_count: int):
        return [
            {
                "match_id": None,
                "match_number": match_number,
                "team_a": None,
                "team_b": None,
                "winner_team_id": None,
                "scheduled_at": None,
                "status": "TBD",
            }
            for match_number in range(1, match_count + 1)
        ]

    def _build_byes(
        self,
        registered_teams,
        existing_round_map,
        total_rounds: int,
    ):
        round_1 = existing_round_map.get(1)
        if not round_1:
            return []

        assigned_team_ids = set()
        for match in round_1.matches:
            if match.team_a_id:
                assigned_team_ids.add(match.team_a_id)
            if match.team_b_id:
                assigned_team_ids.add(match.team_b_id)

        next_round_type = self._resolve_round_type(
            2,
            total_rounds,
        ) if total_rounds >= 2 else "final"

        byes = []
        for registration in registered_teams:
            team = registration.team
            if team and team.id not in assigned_team_ids:
                byes.append(
                    {
                        "team": self._serialize_team(team),
                        "type": "BYE",
                        "auto_advance": True,
                        "advance_to_round": 2 if total_rounds >= 2 else 1,
                        "advance_to_round_type": next_round_type,
                    }
                )

        return byes

    def _resolve_round_number(self, round_type: str, tournament_id: int) -> int:
        team_count = len(self.repository.get_registered_teams(tournament_id))
        if team_count < 2:
            return 1

        bracket_size = self._next_power_of_two(team_count)
        total_rounds = bracket_size.bit_length() - 1

        for round_number in range(1, total_rounds + 1):
            if self._resolve_round_type(round_number, total_rounds) == round_type:
                return round_number

        raise ValueError(f"Unable to resolve round number for {round_type}.")

    @staticmethod
    def _resolve_round_type(
        round_number: int,
        total_rounds: int,
    ) -> str:
        if round_number == total_rounds:
            return "final"
        if round_number == total_rounds - 1:
            return "semi_final"
        if total_rounds >= 4 and round_number == total_rounds - 2:
            return "quarter_final"
        return f"round_{round_number}"

    @staticmethod
    def _resolve_match_count(
        round_number: int,
        bracket_size: int,
        team_count: int,
    ) -> int:
        if round_number == 1:
            return max(team_count - bracket_size // 2, 0)
        return bracket_size // (2 ** round_number)

    @staticmethod
    def _next_power_of_two(number: int) -> int:
        value = 1
        while value < number:
            value *= 2
        return value

    @staticmethod
    def _validate_match_schedules(matches, tournament):
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
