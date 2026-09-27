from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from .models import *

from sqlalchemy.sql import func

from sqlalchemy.orm import joinedload, selectinload, load_only, with_loader_criteria
from ..auth.models import Player

# team and chain models to fetch data
from ..teams.models import (
    Team,
    TeamTournamentRegistration,
    TournamentRoster,
    TournamentRosterPlayer,
    TeamTournamentContribution,
    TournamentRosterPlayerStatus,
    TournamentRegistrationStatus,
)

from ..tournaments.models import *


class TournamentRepository:

    def __init__(self, db: AsyncSession):
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

    def create_round(
        self,
        tournament_id: int,
        round_number: int,
        round_type: TournamentRoundType,
        matches: list,
    ):
        tournament_round = TournamentRound(
            tournament_id=tournament_id,
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
        self.db.commit()

        return tournament_round

    def get_registered_teams(self, tournament_id: int):
        return (
            self.db.query(TeamTournamentRegistration)
            .filter(
                TeamTournamentRegistration.tournament_id == tournament_id,
                TeamTournamentRegistration.status == "approved",
            )
            .all()
        )

    def tournament_registration_by_id(self, tournament_id: int):
        registration = (
            self.db.query(Tournament)
            .filter(Tournament.id == tournament_id)
            .one_or_none()
        )

        return registration

    def get_tournament(self, ongoing_tournament_id: int):
        detail = (
            self.db.query(Tournament)
            .options(
                load_only(
                    Tournament.id,
                    Tournament.background_image_url,
                    Tournament.tournament_name,
                    Tournament.game_name,
                    Tournament.min_teams,
                    Tournament.max_teams,
                    Tournament.prize_pool,
                    Tournament.entry_fee,
                    Tournament.registration_opens_at,
                    Tournament.registration_closes_at,
                    Tournament.starts_at,
                    Tournament.ends_at,
                    Tournament.bracket_format,
                    Tournament.tournament_type,
                    Tournament.server,
                    Tournament.status,
                )
            )
            .filter(Tournament.id == ongoing_tournament_id)
            .one_or_none()
        )
        if detail is None:
            raise HTTPException(
                status_code=404,
                detail="Tournament not found",
            )
        return detail

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

    def get_ongoing_tournament(self, ongoing_tournament_id: int):
        tournament = (
            self.db.query(Tournament)
            .filter(
                Tournament.id == ongoing_tournament_id,
            )
            .one_or_none()
        )
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

    def get_initial_bracket_team_data(self, tournament_id: int):
        teams = (
            self.db.query(TeamTournamentRegistration)
            .join(Team, Team.id == TeamTournamentRegistration.team_id)
            .filter(
                TeamTournamentRegistration.tournament_id == tournament_id,
                TeamTournamentRegistration.status
                == TournamentRegistrationStatus.APPROVED.value,
            )
            .with_entities(
                Team.id,
                Team.name,
                Team.tag,
                Team.logo_url,
            )
            .all()
        )

        if not teams:
            return None

        return [
            {
                "team_id": team.id,
                "team_name": team.name,
                "team_tag": team.tag,
                "team_logo": team.logo_url,
            }
            for team in teams
        ]
