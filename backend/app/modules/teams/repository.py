from sqlalchemy.orm import Session, joinedload, selectinload
from .models import (
    Team,
    TeamMember,
    TeamWallet,
    TeamMemberStatus,
    TeamJoinRequest,
    TeamJoinRequestStatus,
)
from ..auth.models import Player
from sqlalchemy import exists, func, select
from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession


class TeamRepository:

    def __init__(self, db: Session):
        self.db = db

    def team_summary(self, current_user):
        return (
            self.db.query(TeamMember)
            .options(joinedload(TeamMember.team).joinedload(Team.captain))
            .filter(TeamMember.player_id == current_user)
            .first()
        )

    def create_join_application(self, team_id: int, player_id: int):
        join_application = TeamJoinRequest(team_id=team_id, player_id=player_id)

        self.db.add(join_application)
        self.db.commit()
        self.db.refresh()

        return join_application

    def has_pending_request_count(self, player_id: int):
        query = (
            self.db.query(TeamJoinRequest)
            .filter(
                TeamJoinRequest.player_id == player_id,
                TeamJoinRequest.status == TeamJoinRequestStatus.PENDING,
            )
            .count()
        )
        return query

    def has_pending_application(self, team_id: int, player_id: int):
        query = (
            self.db.query(TeamJoinRequest)
            .filter(
                TeamJoinRequest.team_id == team_id,
                TeamJoinRequest.player_id == player_id,
                TeamJoinRequest.status == TeamJoinRequestStatus.PENDING,
            )
            .first()
            is not None
        )
        return query

    def get_team_by_id(self, team_id: int):
        query = self.db.query(Team).filter(Team.id == team_id).first()
        return query

    def load_all_active_teams(self, current_user: int, cursor: int | None, limit: int):

        query = (
            self.db.query(Team, func.count(TeamMember.id).label("members_count"))
            .outerjoin(TeamMember, Team.id == TeamMember.team_id)
            .filter(
                Team.visibility == "public",
                Team.captain_id != current_user.id,
            )
            .group_by(Team.id)
            .order_by(Team.id)
        )

        if cursor is not None:
            query = query.filter(Team.id > cursor)

        return query.limit(limit + 1).all()

    # check whether user is already associated with team as member or captain.
    def get_team_by_player(self, current_user_id: int):
        return (
            self.db.query(Team)
            .join(TeamMember)
            .options(
                joinedload(Team.wallet),
                selectinload(Team.members).joinedload(TeamMember.player),
            )
            .filter(
                TeamMember.player_id == current_user_id,
                TeamMember.status == TeamMemberStatus.ACTIVE,
            )
            .first()
        )

    # User Already has team
    def player_has_team(self, user_id: int):
        return self.db.query(TeamMember).filter(TeamMember.player_id == user_id).first()

    # Team Already Exits
    def get_team_by_name(self, team_name: str):
        return self.db.query(Team).filter(Team.name == team_name).first()

    # Create Team
    def create_team(self, current_user: str, payload: Team, logo: dict, banner: dict):

        logo_public_id = None
        logo_url = None

        if logo:
            logo_public_id = logo["public_id"]
            logo_url = logo["secure_url"]

        banner_public_id = None
        banner_url = None

        if banner:
            banner_public_id = banner["public_id"]
            banner_url = banner["secure_url"]

        team = Team(
            name=payload.team_name,
            tag=payload.team_tag,
            logo_public_id=logo_public_id,
            logo_url=logo_url,
            banner_public_id=banner_public_id,
            banner_url=banner_url,
            description=payload.team_bio,
            country=payload.team_region,
            city=payload.team_city,
            visibility=payload.team_visibility,
            is_verified=True,
            captain_id=current_user.id,
            created_by=current_user.id,
        )
        self.db.add(team)

        return team

    def join_team(self, team_id: int, player_id: int, player_role: str):

        team_member = TeamMember(team_id=team_id, player_id=player_id, role=player_role)

        self.db.add(team_member)
        self.db.commit()
        self.db.refresh(team_member)
        return team_member

    def create_team_wallet(self, team_id: int):

        wallet = TeamWallet(
            team_id=team_id,
        )
        self.db.add(wallet)
        return wallet


# TEAM TOURNAMENT REPOSITORY

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import TeamMemberStatus
from ..tournaments.models import Tournament
from .models import (
    TeamTournamentRegistration,
    TournamentRegistrationStatus,
)


class TeamTournamentRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    # Get the team membership of a player
    def get_player_team_membership(self, player_id: int):
        result =  self.db.execute(
            select(TeamMember).where(
                TeamMember.player_id == player_id,
                TeamMember.status == TeamMemberStatus.ACTIVE,
            )
        )

        return result.scalar_one_or_none()

    # Get tournament by ID
    def get_tournament(self, tournament_id: int):
        result =  self.db.execute(
            select(Tournament).where(Tournament.id == tournament_id)
        )

        return result.scalar_one_or_none()

    # Check if team already applied for this tournament
    def get_existing_registration(
        self,
        team_id: int,
        tournament_id: int,
    ):
        result =  self.db.execute(
            select(TeamTournamentRegistration).where(
                TeamTournamentRegistration.team_id == team_id,
                TeamTournamentRegistration.tournament_id == tournament_id,
            )
        )

        return result.scalar_one_or_none()

    # Create a new tournament registration
    def create_registration(
        self,
        team_id: int,
        tournament_id: int,
        captain_id: int,
    ):
        registration = TeamTournamentRegistration(
            team_id=team_id,
            tournament_id=tournament_id,
            captain_id=captain_id,
            status=TournamentRegistrationStatus.PENDING,
        )
        
        self.db.add(registration)
        self.db.flush()
        self.db.commit()

        return registration

    # Get all active registrations of a team
    def get_team_registrations(self, team_id: int):
        result =  self.db.execute(
            select(TeamTournamentRegistration).where(
                TeamTournamentRegistration.team_id == team_id,
                TeamTournamentRegistration.status.in_(
                    [
                        TournamentRegistrationStatus.PENDING,
                        TournamentRegistrationStatus.UNDER_REVIEW,
                        TournamentRegistrationStatus.PAYMENT_PENDING,
                        TournamentRegistrationStatus.APPROVED,
                    ]
                ),
            )
        )

        return list(result.scalars().all())

    # Check if the team is already registered for
    # another tournament happening at the same time
    def get_team_conflicting_tournament(
        self,
        team_id: int,
        start_at: datetime,
        end_at: datetime,
    ):
        result =  self.db.execute(
            select(TeamTournamentRegistration)
            .join(
                Tournament,
                Tournament.id == TeamTournamentRegistration.tournament_id,
            )
            .where(
                TeamTournamentRegistration.team_id == team_id,
                TeamTournamentRegistration.status.in_(
                    [
                        TournamentRegistrationStatus.PENDING,
                        TournamentRegistrationStatus.UNDER_REVIEW,
                        TournamentRegistrationStatus.PAYMENT_PENDING,
                        TournamentRegistrationStatus.APPROVED,
                    ]
                ),
            )
        )

        registrations = result.scalars().all()

        for registration in registrations:

            tournament =  self.get_tournament(registration.tournament_id)

            if not tournament:
                continue

            existing_start = datetime.combine(
                tournament.tournament_start_date,
                tournament.tournament_start_time,
                tzinfo=timezone.utc,
            )

            existing_end = datetime.combine(
                tournament.tournament_end_date,
                tournament.tournament_end_time,
                tzinfo=timezone.utc,
            )

            # Check if the two tournament time periods overlap
            if existing_start < new_end and existing_end > new_start:
                return tournament

        return None

    # Get number of teams registered for a tournament
    def get_registered_team_count(
        self,
        tournament_id: int,
    ) -> int:
        result =  self.db.execute(
            select(func.count(TeamTournamentRegistration.id)).where(
                TeamTournamentRegistration.tournament_id == tournament_id,
                TeamTournamentRegistration.status.in_(
                    [
                        TournamentRegistrationStatus.PENDING,
                        TournamentRegistrationStatus.UNDER_REVIEW,
                        TournamentRegistrationStatus.PAYMENT_PENDING,
                        TournamentRegistrationStatus.APPROVED,
                    ]
                ),
            )
        )

        return result.scalar_one()

    # Get pending registrations for a tournament
    def get_pending_registrations(
        self,
        tournament_id: int,
    ):
        result =  self.db.execute(
            select(TeamTournamentRegistration).where(
                TeamTournamentRegistration.tournament_id == tournament_id,
                TeamTournamentRegistration.status
                == TournamentRegistrationStatus.PENDING,
            )
        )

        return list(result.scalars().all())
