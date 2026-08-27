from sqlalchemy.orm import Session
from datetime import datetime, timezone
from fastapi import HTTPException, status, UploadFile

# Auth User Model
from ...modules.auth.models import Player

# CLOUDINARY SERVICE
from ...core.cloudinary.cloudinary_services import cloud_service
from .validators import validate_image

# Team Request & Response Schemas
from .schemas import (
    TeamCreateSchema,
    TeamResponseOutput,
    TeamResponse,
    TeamWalletResponse,
    TeamMemberResponse,
    DiscoverTeamResponse,
    DiscoverTeamOutput,
    JoinTeamResponse,
    TeamSummaryResponse,
    CaptainSummary,
    TeamSummary,
)

# Team Custom Exception
from app.core.exceptions.exceptions import (
    ExceptionTeamAlreadyExits,
    ExceptionPlayerAlreadyHasTeam,
)
from .exceptions import *

# Repository
from .repository import TeamRepository
from .schemas import (
    TeamRegisteredTournament,
    TeamDashboardData,
    TeamDashboardResponse,
    TeamMembers,
)


# Team Service
class TeamService:

    def __init__(self, db: Session, repository: TeamRepository):
        self.db = db
        self.repository = repository

    # Team dashboard stats
    def get_teamdashboard(self, current_user: Player):

        now = datetime.now(timezone.utc)
        print("NOW:", now)

        team = self.repository.get_team_by_player(current_user_id=current_user.id)

        team_tournaments = self.repository.get_team_registered_tournaments(
            team_id=team.id
        )

        team_members = self.repository.get_team_members(team_id=team.id)

        # Current tournament
        current_tournament = None

        # Upcoming tournaments
        upcoming_tournaments = []

        for registration in team_tournaments:

            tournament = registration.tournament

            start = datetime.combine(
                tournament.tournament_start_date, tournament.tournament_start_time
            ).replace(tzinfo=timezone.utc)

            end = datetime.combine(
                tournament.tournament_end_date, tournament.tournament_end_time
            ).replace(tzinfo=timezone.utc)

            # Currently started tournament
            if start <= now <= end:
                current_tournament = registration

            # Upcoming not started yet 
            elif start > now:
                current_tournament = registration
                upcoming_tournaments.append(registration)
        
        # Nearest tournament first 
        upcoming_tournaments.sort(
            key=lambda registration: registration.tournament.tournament_start_date
        )
        
        def make_tournament_response(registration):
                
            tournament = registration.tournament

            return TeamRegisteredTournament(
                tournament_id=tournament.id,
                tournament_name=tournament.tournament_name,
                server=tournament.server,
                prize_pool=tournament.prize_pool if tournament.prize_pool is not None else None ,
                entry_fee=tournament.entry_fee,
                max_teams=tournament.max_teams,

                registration_open_date=datetime.combine(
                    tournament.reg_open_date,
                    tournament.reg_open_time,
                ).replace(tzinfo=timezone.utc),
                
                registration_end_date=datetime.combine(
                    tournament.reg_close_date,
                    tournament.reg_close_time,
                ).replace(tzinfo=timezone.utc),

                tournament_start_date=datetime.combine(
                    tournament.tournament_start_date,
                    tournament.tournament_start_time,
                ).replace(tzinfo=timezone.utc),

                tournament_end_date=datetime.combine(
                    tournament.tournament_end_date,
                    tournament.tournament_end_time,
                ).replace(tzinfo=timezone.utc),

                status=registration.status.value,
                applied_at=registration.applied_at,
            )
            
        def make_member_response(member):
            return TeamMembers(
                id=member.player.id,
                email=member.player.email,
                role=member.role,
                status=member.status
            )
            
        current_tournament = (
            make_tournament_response(current_tournament)
            if current_tournament
            else None
        )
        
        upcoming_tournaments = [
            make_tournament_response(registration)
            for registration in upcoming_tournaments
        ]
        
        team_members = [
            make_member_response(member) for member in team_members 
        ]

        return TeamDashboardResponse(
            success=True,
            data=TeamDashboardData(
                current_tournament=current_tournament,
                upcoming_tournament=upcoming_tournaments,
                team_members=team_members,
            ),
        )

    def get_my_team_summary(self, current_user: Player):
        team_mem = self.repository.team_summary(current_user=current_user.id)

        if not team_mem:
            return {"message": f"NOT_IN_TEAM {current_user.email.split("@")[0]}"}

        return TeamSummaryResponse(
            has_team=True,
            team=TeamSummary(
                id=team_mem.id,
                name=team_mem.team.name,
                tag=team_mem.team.tag,
                country=team_mem.team.country,
                captain=CaptainSummary(
                    id=team_mem.team.captain_id,
                    captain_name=team_mem.team.captain.email.split("@")[0],
                    role="captain" if team_mem.role == "CAPTAIN" else "player",
                ),
                members_count=len(team_mem.team.members),
            ),
        )

    def get_my_team(self, current_user: Player):

        team = self.repository.get_team_by_player(current_user.id)
        if not team:
            return TeamResponseOutput(team=None)

        return TeamResponseOutput(
            team=TeamResponse(
                id=team.id,
                team_name=team.name,
                team_tag=team.tag,
                team_max_members=team.max_members,
                team_logo_url=team.logo_url,
                team_banner_url=team.banner_url,
                team_bio=team.description or "",
                team_country=team.country,
                team_visibility=team.visibility,
                team_created_at=team.created_at,
                team_wallet=TeamWalletResponse(
                    wallet_balance=team.wallet.balance, status=team.wallet.status
                ),
                team_members=[
                    TeamMemberResponse(
                        player_name=member.player.email.split("@")[0],
                        player_email=member.player.email,
                        player_role=member.role,
                    )
                    for member in team.members
                ],
            )
        )

    def create_team(
        self,
        payload: TeamCreateSchema,
        logo: UploadFile | None,
        banner: UploadFile | None,
        current_user: Player,
    ):

        validate_image(logo)
        validate_image(banner)

        # Ensure user eligible to create team.
        player_in_team = self.repository.player_has_team(current_user.id)

        if player_in_team:
            raise ExceptionPlayerAlreadyHasTeam()

        # Ensure wehther a team with team name already exits or not.
        team_exists = self.repository.get_team_by_name(payload.team_name)
        if team_exists:
            raise ExceptionTeamAlreadyExits()

        # upload image to cloudinary helper
        logo = cloud_service.upload_image(logo, folder="teams/logo")
        banner = cloud_service.upload_image(banner, folder="teams/banner")

        try:
            # create team
            team = self.repository.create_team(
                current_user=current_user,
                payload=payload,
                logo=logo,
                banner=banner,
            )

            self.db.flush()

            team_wallet = self.repository.create_team_wallet(team_id=team.id)
            team_member = self.repository.join_team(
                team_id=team.id, player_id=current_user.id, player_role="captain"
            )

            self.db.commit()
            self.db.refresh(team)

            return {
                "message": "Team Created Successfully",
                "status": 200,
                "team_id": team.id,
            }

        except:
            self.db.rollback()
            raise

    def discover_team(
        self,
        cursor: int,
        limit: int,
        current_user: Player,
    ):

        team_member = self.repository.player_has_team(user_id=current_user.id)

        my_team_id = team_member.team_id if team_member else None

        teams = self.repository.load_all_active_teams(current_user, cursor, limit)

        has_next = len(teams) > limit

        if has_next:
            next_cursor = teams[:-1].index
            teams = teams[:limit]

        else:
            next_cursor = None

        return DiscoverTeamOutput(
            my_team_id=my_team_id,
            has_next=has_next,
            next_cursor=next_cursor,
            items=[
                DiscoverTeamResponse(
                    id=team.id,
                    name=team.name,
                    tag=team.tag,
                    description=team.description,
                    visibility=team.visibility,
                    logo_url=team.logo_url,
                    banner_url=team.banner_url,
                    country=team.country,
                    created_at=team.created_at,
                    max_members=team.max_members,
                    members_count=members_count,
                )
                for team, members_count in teams
            ],
        )

    def join_team(self, team_id: int, current_user: Player):

        if current_user.is_banned:
            raise UserIsBlockedOrInactive()

        is_already_member = self.repository.player_has_team(current_user.id)

        if is_already_member:
            raise UserInTeam()

        team = self.repository.get_team_by_id(team_id)

        if not team:
            raise TeamNotFound()

        members_inside_team = len(team.members)

        if members_inside_team >= 7:
            raise TeamFullException()

        if team.visibility == "public":
            self.repository.join_team(
                team_id=team_id, player_id=current_user.id, player_role="player"
            )
            return JoinTeamResponse(
                success=True, status=200, message="Team Joined Successfully."
            )

        already_applied = self.repository.has_pending_application(
            team_id=team_id, player_id=current_user.id
        )

        if already_applied:
            raise PendingApplicationException()

        # Check pending application for private team
        pending_request = self.repository.has_pending_request_count(
            team_id=team_id, player_id=current_user.id
        )

        if pending_request >= 10:
            raise MaximumJoinRequestException()

        self.repository.create_join_request(team_id=team_id, player_id=current_user.id)

        return JoinTeamResponse(
            success=True, status=200, message="Joining Request Sent Successfully"
        )

    # This service makes captain invite players and notifies player about invitation through notification.
    def invite_player(self, current_user: int, player_id: int):

        # background task notify invited user about invitation
        pass
        # remove specific player from team

    def remove_player(self, player_id: int):
        pass

    # disbanned team if captain manually disband or all members leaves the team
    def disbanned_team(self, captain_id: int):
        pass


# Team Tournament Service
from .repository import TeamTournamentRepository
from .models import TeamRole, TournamentRegistrationStatus


class TeamTournamentService:

    def __init__(self, repository: TeamTournamentRepository):
        self.repository = repository

    def register_team_tournament(
        self,
        tournament_id: int,
        current_user: Player,
    ):
        # 1. Validate authenticated user
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unauthorized user.",
            )

        # 2. Validate user account
        if current_user.is_banned:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Banned users cannot register a team.",
            )

        if not current_user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Inactive users cannot register a team.",
            )

        # 3. Get current user's team membership
        membership = self.repository.get_player_team_membership(
            player_id=current_user.id
        )

        if not membership:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You must be a member of a team to register.",
            )

        # 4. Only team captain can create tournament registration
        if membership.role != TeamRole.CAPTAIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the team captain can register the team.",
            )

        team = membership.team

        # 5. Validate tournament
        tournament = self.repository.get_tournament(tournament_id=tournament_id)

        if not tournament:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Tournament with ID {tournament_id} does not exist.",
            )

        now = datetime.now(timezone.utc)

        reg_open_datetime = datetime.combine(
            tournament.reg_open_date,
            tournament.reg_open_time,
            tzinfo=timezone.utc,
        )

        registration_close_datetime = datetime.combine(
            tournament.reg_close_date,
            tournament.reg_close_time,
            tzinfo=timezone.utc,
        )

        tournament_start_datetime = datetime.combine(
            tournament.tournament_start_date,
            tournament.tournament_start_time,
            tzinfo=timezone.utc,
        )

        tournament_end_datetime = datetime.combine(
            tournament.tournament_end_date,
            tournament.tournament_end_time,
            tzinfo=timezone.utc,
        )

        # 6. Registration must still be open
        if now < reg_open_datetime:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tournament registration has not opened yet.",
            )

        if now >= registration_close_datetime:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tournament registration is closed.",
            )

        # 7. Tournament must not have started
        if now >= tournament_start_datetime:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tournament has already started.",
            )

        # 8. Prevent duplicate team registration
        existing_registration = self.repository.get_existing_registration(
            team_id=team.id,
            tournament_id=tournament.id,
        )

        if existing_registration:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Your team has already applied for this tournament.",
            )

        # 9. Prevent team from participating in overlapping tournaments
        conflicting_tournament = self.repository.get_team_conflicting_tournament(
            team_id=team.id,
            start_at=tournament.tournament_start_date,
            end_at=tournament.tournament_end_date,
        )

        if conflicting_tournament:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "Your team is already registered for another "
                    "tournament during this period."
                ),
            )

        # 10. Create pending registration.
        # A team can apply with only one member.
        registration = self.repository.create_registration(
            team_id=team.id,
            tournament_id=tournament.id,
            captain_id=current_user.id,
        )

        return {
            "registration_id": registration.id,
            "tournament_id": tournament.id,
            "team_id": team.id,
            "status": registration.status,
            "message": ("Your team has successfully applied " "for the tournament."),
        }
