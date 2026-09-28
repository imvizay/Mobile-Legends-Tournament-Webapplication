from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload, selectinload, with_loader_criteria

from ..auth.models import Player
from ..teams.models import (
    Team,
    TeamTournamentRegistration,
    TournamentRoster,
    TournamentRosterPlayer,
    TeamTournamentContribution,
    TournamentRosterPlayerStatus,
    TournamentRegistrationStatus,
)
from .models import (
    BracketStatus,
    Tournament,
    TournamentMatch,
    TournamentMatchStatus,
    TournamentRound,
    TournamentRoundStatus,
    TournamentRoundType,
    TournamentStatus,
)


class TournamentRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_round_by_type(self, tournament_id: int, round_type: str):
        return (
            self.db.query(TournamentRound)
            .filter(
                TournamentRound.tournament_id == tournament_id,
                TournamentRound.round_type == round_type,
            )
            .first()
        )
        
    def get_tournament_bracket(self, tournament_id: int):
        return (
            self.db.query(TournamentRound)
            .options(
                selectinload(TournamentRound.matches).joinedload(TournamentMatch.team_a),
                selectinload(TournamentRound.matches).joinedload(TournamentMatch.team_b),
            )
            .filter(TournamentRound.tournament_id == tournament_id)
            .order_by(TournamentRound.round_number.asc())
            .all()
        )

    def create_round(
        self,
        tournament: Tournament,
        round_number: int,
        round_type: TournamentRoundType,
        matches: list,
    ):

        tournament_round = TournamentRound(
            tournament_id=tournament.id,
            round_number=round_number,
            round_type=round_type,
            status=TournamentRoundStatus.READY.value,
        )

        self.db.add(tournament_round)
        self.db.flush()

        tournament_matches = [
            TournamentMatch(
                round_id=tournament_round.id,
                match_number=match["match_number"],
                team_a_id=match["team_a_id"],
                team_b_id=match["team_b_id"],
                scheduled_at=match["scheduled_at"],
                status=TournamentMatchStatus.UPCOMING.value,
            )
            for match in matches
        ]

        self.db.add_all(tournament_matches)
        tournament.bracket_status = BracketStatus.GENERATED.value
        self.db.flush()

        return tournament_round

    def get_registered_teams(self, tournament_id: int):
        return (
            self.db.query(TeamTournamentRegistration)
            .options(joinedload(TeamTournamentRegistration.team))
            .filter(
                TeamTournamentRegistration.tournament_id == tournament_id,
                TeamTournamentRegistration.status == TournamentRegistrationStatus.APPROVED.value,
            )
            .all()
        )


    def get_tournament_by_id(self, tournament_id: int):
        return (
            self.db.query(Tournament)
            .filter(Tournament.id == tournament_id)
            .one_or_none()
        )

    def check_tournament_name(self, tournament_name: str):
        return (
            self.db.query(Tournament)
            .filter(Tournament.tournament_name == tournament_name)
            .first()
            is not None
        )

    def load_tournaments(self):
        return self.db.query(Tournament).all()

    def create_tournament(self, tournament_data: dict):

        background_image = tournament_data.get("background_image")

        banner_image = tournament_data.get("banner_image")

        db_data = {
            key: value
            for key, value in tournament_data.items()
            if key
            not in {
                "background_image",
                "banner_image",
            }
        }

        tournament = Tournament(
            **db_data,
            background_image_url=(
                background_image.get("url") if background_image else None
            ),
            background_image_public_id=(
                background_image.get("public_id") if background_image else None
            ),
            banner_image_url=(banner_image.get("url") if banner_image else None),
            banner_image_public_id=(
                banner_image.get("public_id") if banner_image else None
            ),
        )

        self.db.add(tournament)

        self.db.commit()
        self.db.refresh(tournament)

        return tournament

    def publish_tournament(self, tournament_id: int):

        tournament = (
            self.db.query(Tournament).filter(Tournament.id == tournament_id).first()
        )

        if not tournament:
            raise HTTPException(status_code=404, detail="Tournament not found.")

        if tournament.visibility_status == "published":
            raise HTTPException(status_code=400, detail="Tournament already published")

        tournament.visibility_status = "published"

        self.db.commit()
        self.db.refresh(tournament)

        return tournament


    def check_and_get_ongoing_tournament_registration(
        self,
    ):

        tournaments = (
            self.db.query(
                Tournament,
                func.count(TeamTournamentRegistration.id).label("registration_count"),
            )
            .outerjoin(
                TeamTournamentRegistration,
                TeamTournamentRegistration.tournament_id == Tournament.id,
            )
            .filter(
                Tournament.visibility_status == "published",
                Tournament.status == TournamentStatus.SCHEDULED,
            )
            .group_by(Tournament.id)
            .all()
        )

        return tournaments

    def check_and_get_ongoing_tournament_registration_detail(
        self,
        ongoing_tournament_id: int,
    ):

        ongoing_detail = (
            self.db.query(TeamTournamentRegistration)
            .options(
                # Registration --> Team
                joinedload(TeamTournamentRegistration.team).load_only(
                    Team.id,
                    Team.name,
                    Team.tag,
                    Team.logo_url,
                    Team.is_verified,
                ),
                # Registration --> Captain
                joinedload(TeamTournamentRegistration.captain).load_only(
                    Player.id,
                    Player.username,
                    Player.mlbb_id,
                    Player.email,
                    Player.profile_url,
                ),
                # Registration --> Roster --> Players --> Contribution
                joinedload(TeamTournamentRegistration.roster)
                .load_only(
                    TournamentRoster.id,
                    TournamentRoster.registration_id,
                    TournamentRoster.team_id,
                    TournamentRoster.status,
                )
                .selectinload(TournamentRoster.players)
                .load_only(
                    TournamentRosterPlayer.id,
                    TournamentRosterPlayer.roster_id,
                    TournamentRosterPlayer.player_id,
                    TournamentRosterPlayer.status,
                    TournamentRosterPlayer.tournament_readiness,
                )
                .joinedload(TournamentRosterPlayer.contribution)
                .load_only(
                    TeamTournamentContribution.id,
                    TeamTournamentContribution.roster_player_id,
                    TeamTournamentContribution.amount,
                    TeamTournamentContribution.status,
                    TeamTournamentContribution.paid_at,
                ),
                with_loader_criteria(
                    TournamentRosterPlayer,
                    TournamentRosterPlayer.status
                    == TournamentRosterPlayerStatus.SELECTED.value,
                    include_aliases=True,
                ),
            )
            .filter(TeamTournamentRegistration.tournament_id == ongoing_tournament_id)
            .all()
        )

        return ongoing_detail

