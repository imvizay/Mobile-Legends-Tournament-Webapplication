from sqlalchemy.orm import Session, joinedload, selectinload
from .models import (
    Team,
    TeamMember,
    TeamMemberStatus,
    TeamJoinRequest,
    TeamJoinRequestStatus,
    TeamRole,
    TournamentRosterPlayer,
    TeamTournamentContribution,
    TeamTournamentContributionStatus,
)

from ..auth.models import Player
from sqlalchemy import exists, func, select
from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession


class TeamRepository:

    def __init__(self, db: Session):
        self.db = db

    # ================== ROSTER ======================
    def get_selected_roster(self, registration_id: int):
        return (
            self.db.query(TournamentRosterPlayer)
            .join(TournamentRosterPlayer.roster)
            .options(
                joinedload(TournamentRosterPlayer.player),
            )
            .filter(TournamentRoster.registration_id == registration_id)
            .all()
        )

    # ================== TEAM =====================
    def get_team_captain(self, player_id: int):
        return (
            self.db.query(TeamMember)
            .filter(
                TeamMember.player_id == player_id, TeamMember.role == TeamRole.CAPTAIN
            )
            .first()
        )

    def get_team_registered_tournaments(self, team_id: int):

        tournaments = (
            self.db.query(TeamTournamentRegistration)
            .options(joinedload(TeamTournamentRegistration.tournament))
            .filter(TeamTournamentRegistration.team_id == team_id)
            .all()
        )

        return tournaments

    def get_team_members(self, team_id: int):
        members = (
            self.db.query(TeamMember)
            .options(joinedload(TeamMember.player))
            .filter(TeamMember.team_id == team_id)
            .all()
        )
        return members

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


# TEAM TOURNAMENT REPOSITORY

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import TeamMemberStatus
from ..tournaments.models import *
from .models import (
    TeamTournamentRegistration,
    TournamentRegistrationStatus,
    TournamentRoster,
    TournamentRosterStatus,
)


class TeamTournamentRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    # Get the team membership of a player
    def get_player_team_membership(self, player_id: int):
        result = self.db.execute(
            select(TeamMember).where(
                TeamMember.player_id == player_id,
                TeamMember.status == TeamMemberStatus.ACTIVE,
            )
        )

        return result.scalar_one_or_none()

    # Get tournament by ID
    def get_tournament(self, tournament_id: int):
        stmt = select(Tournament).where(
            Tournament.id == tournament_id,
            Tournament.visibility_status == VisibilityStatus.PUBLISHED,
            Tournament.status == TournamentStatus.SCHEDULED,
        )
        return self.db.execute(stmt).scalar_one_or_none()

    # Check if team already applied for this tournament
    def get_existing_registration(
        self,
        team_id: int,
        tournament_id: int,
    ):
        result = self.db.execute(
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
        result = self.db.execute(
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
        result = self.db.execute(
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

            tournament = self.get_tournament(registration.tournament_id)

            if not tournament:
                continue

            existing_start = tournament.starts_at

            existing_end = tournament.ends_at

            # Check if the two tournament time periods overlap
            if existing_start < end_at and existing_end > start_at:
                return tournament

        return None

    # Get number of teams registered for a tournament
    def get_registered_team_count(
        self,
        tournament_id: int,
    ) -> int:
        result = self.db.execute(
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
        result = self.db.execute(
            select(TeamTournamentRegistration).where(
                TeamTournamentRegistration.tournament_id == tournament_id,
                TeamTournamentRegistration.status
                == TournamentRegistrationStatus.PENDING,
            )
        )

        return list(result.scalars().all())

    # =========================
    # TOURNAMENT ROSTER
    # =========================

    def get_captain_tournament_roster(
        self,
        captain_id: int,
        tournament_id: int,
    ):
        return (
            self.db.query(TournamentRoster)
            .join(
                TeamMember,
                TeamMember.team_id == TournamentRoster.team_id,
            )
            .filter(
                TeamMember.player_id == captain_id,
                TeamMember.role == TeamRole.CAPTAIN,
                TeamMember.status == TeamMemberStatus.ACTIVE,
                TournamentRoster.tournament_id == tournament_id,
            )
            .with_for_update()
            .first()
        )

    def make_roster(
        self,
        team_id: int,
        tournament_id: int,
        registration_id: int,
    ):
        roster = TournamentRoster(
            team_id=team_id,
            tournament_id=tournament_id,
            registration_id=registration_id,
            status=TournamentRosterStatus.SELECTING,
        )

        self.db.add(roster)
        self.db.commit()
        self.db.refresh(roster)

        return roster

    def get_active_team_member(
        self,
        team_id: int,
        player_id: int,
    ):
        return (
            self.db.query(TeamMember)
            .filter(
                TeamMember.team_id == team_id,
                TeamMember.player_id == player_id,
                TeamMember.status == TeamMemberStatus.ACTIVE,
            )
            .first()
        )

    def get_roster_player(
        self,
        roster_id: int,
        player_id: int,
    ):
        return (
            self.db.query(TournamentRosterPlayer)
            .filter(
                TournamentRosterPlayer.roster_id == roster_id,
                TournamentRosterPlayer.player_id == player_id,
            )
            .first()
        )

    def count_roster_players(
        self,
        roster_id: int,
    ) -> int:
        return (
            self.db.query(TournamentRosterPlayer)
            .filter(
                TournamentRosterPlayer.roster_id == roster_id,
            )
            .count()
        )

    def add_roster_player(
        self,
        roster_id: int,
        roster_player_id: int,
    ):
        roster_player = TournamentRosterPlayer(
            roster_id=roster_id,
            player_id=roster_player_id,
        )

        self.db.add(roster_player)
        self.db.flush()

        return roster_player

    def my_roster(self, registration_id: int, member: Player):

        roster = (
            self.db.query(TournamentRoster)
            .options(
                joinedload(TournamentRoster.registration).joinedload(
                    TeamTournamentRegistration.tournament
                )
            )
            .filter(
                TournamentRoster.tournament_id == registration_id,
                TournamentRoster.team_id == member.team_id,
            )
            .first()
        )

        if not roster:
            return None

        return roster

    def confirm_roster(self, roster: TournamentRoster):
        roster.status = TournamentRosterStatus.CONFIRMED
        roster.created_at = datetime.now(timezone.utc)

    def create_contribution(
        self, roster_players: TournamentRosterPlayer, entry_fee: int
    ):

        for player in roster_players:

            contribution = TeamTournamentContribution(
                roster_player_id=player.id, amount=entry_fee
            )

            self.db.add(contribution)

    def get_tournament_contribution(self, registration_id: int, team_id: int):

        return (
            self.db.query(TeamTournamentContribution)
            .options(
                joinedload(TeamTournamentContribution.roster_player).joinedload(
                    TournamentRosterPlayer.player
                )
            )
            .join(
                TournamentRosterPlayer,
                TournamentRosterPlayer.id
                == TeamTournamentContribution.roster_player_id,
            )
            .join(
                TournamentRoster,
                TournamentRoster.id == TournamentRosterPlayer.roster_id,
            )
            .filter(
                TournamentRoster.registration_id == registration_id,
                TournamentRoster.team_id == team_id,
            )
            .all()
        )

    def get_tournament_review(self, tournament_id: int, player_id: int):
        review = (
            self.db.query(TeamTournamentRegistration)
            .options(
                joinedload(TeamTournamentRegistration.tournament),
                joinedload(TeamTournamentRegistration.team)
                
            )
            .join(
                TournamentRoster,
                TournamentRoster.team_id == TeamTournamentRegistration.team_id,
            )
            .join(
                TournamentRosterPlayer,
                TournamentRosterPlayer.roster_id == TournamentRoster.id,
            )
            .filter(
                TeamTournamentRegistration.tournament_id == tournament_id,
                TournamentRosterPlayer.player_id == player_id,
            )
            .first()
        )

        return review