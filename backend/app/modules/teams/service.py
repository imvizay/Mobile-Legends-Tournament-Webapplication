from datetime import datetime, timezone

from fastapi import UploadFile
from app.common.validators.image import validate_image
from app.integrations.cloudinary.service import cloudinary_service
from app.modules.auth.models import Player
from .exceptions import (
    PlayerAlreadyHasTeamError,
    TeamAlreadyExistsError,
    MaximumJoinRequestException,
    PendingApplicationException,
    TeamFullException,
    TeamNotFound,
    UserInTeam,
    UserIsBlockedOrInactive,
)
from .serializers import (
    make_member_response,
    make_recent_most_tournament_roster_response,
    make_tournament_response,
)
from .repository import TeamRepository
from .schemas import (
    CaptainSummary,
    DiscoverTeamOutput,
    DiscoverTeamResponse,
    JoinTeamResponse,
    TeamCreateSchema,
    TeamDashboardData,
    TeamDashboardResponse,
    TeamMemberResponse,
    TeamResponse,
    TeamResponseOutput,
    TeamSummary,
    TeamSummaryResponse,
)


class TeamService:

    def __init__(self, repository: TeamRepository):
        self.repository = repository

    # Team dashboard stats
    def get_team_dashboard(self, current_user: Player):

        now = datetime.now(timezone.utc)

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

            start = tournament.registration_opens_at

            end = tournament.registration_closes_at
            # Currently started tournament
            if start <= now <= end:
                current_tournament = registration

            # Upcoming not started yet
            elif start > now:
                upcoming_tournaments.append(registration)

        # Current Registered Tournament Roster.
        roster_players = []
        if current_tournament:
            roster_players = self.repository.get_selected_roster_and_contribution(
                registration_id=current_tournament.id
            )

        # Nearest tournament first
        upcoming_tournaments.sort(
            key=lambda registration: registration.tournament.starts_at
        )

        current_tournament = (
            make_recent_most_tournament_roster_response(
                current_tournament, roster_players
            )
            if current_tournament
            else None
        )

        upcoming_tournaments = [
            make_tournament_response(registration)
            for registration in upcoming_tournaments
        ]

        team_members = [make_member_response(member) for member in team_members]

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
                team_members=[
                    TeamMemberResponse(
                        player_name=member.player.email.split("@")[0],
                        player_email=member.player.email,
                        player_role=member.role,
                        mlbb_id=member.player.mlbb_id,
                        mlbb_server=member.player.mlbb_server,
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
            raise PlayerAlreadyHasTeamError()

        # Ensure wehther a team with team name already exits or not.
        team_exists = self.repository.get_team_by_name(payload.team_name)
        if team_exists:
            raise TeamAlreadyExistsError()

        # upload image to cloudinary helper
        logo = cloudinary_service.upload_image(logo, folder="teams/logo")
        banner = cloudinary_service.upload_image(banner, folder="teams/banner")

        try:
            # create team
            team = self.repository.create_team(
                current_user=current_user,
                payload=payload,
                logo=logo,
                banner=banner,
            )

            self.repository.db.flush()

            team_member = self.repository.join_team(
                team_id=team.id, player_id=current_user.id, player_role="captain"
            )

            self.repository.db.commit()
            self.repository.db.refresh(team)

            return {
                "message": "Team Created Successfully",
                "status": 200,
                "team_id": team.id,
            }

        except:
            self.repository.db.rollback()
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


