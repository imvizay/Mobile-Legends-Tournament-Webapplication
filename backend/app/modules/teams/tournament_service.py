from datetime import datetime, timezone

from fastapi import HTTPException, status

from app.modules.auth.models import Player
from app.modules.teams.models import (
    TeamRole,
    TournamentRosterPlayerStatus,
    TournamentRosterStatus,
)

from .schemas import (
    PlayerReview,
    TeamContributionResponse,
    TeamReview,
    TeamTournamentDetailResponse,
    TournamentReview,
    TournamentReviewResponse,
)
from .tournament_repository import TeamTournamentRepository


class TeamTournamentService:

    def __init__(self, repository: TeamTournamentRepository):
        self.repository = repository

    def register_team_tournament(
        self,
        tournament_id: int,
        current_user: Player,
    ):
        # Validate authenticated user
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unauthorized user.",
            )

        # Validate user account
        if current_user.is_banned:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Banned users cannot register a team.",
            )

        # if not current_user.is_active:
        #     raise HTTPException(
        #         status_code=status.HTTP_403_FORBIDDEN,
        #         detail="Inactive users cannot register a team.",
        #     )

        # Get current user's team membership
        membership = self.repository.get_player_team_membership(
            player_id=current_user.id
        )

        if not membership:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You must be a member of a team to register.",
            )

        # Only team captain can create tournament registration
        if membership.role != TeamRole.CAPTAIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the team captain can register the team.",
            )

        team = membership.team

        # Validate tournament
        tournament = self.repository.get_tournament_by_id(tournament_id=tournament_id)

        if not tournament:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Tournament with ID {tournament_id} does not exist.",
            )

        now = datetime.now(timezone.utc)

        reg_open_datetime = tournament.registration_opens_at

        registration_close_datetime = tournament.registration_closes_at

        tournament_start_datetime = tournament.starts_at

        tournament_end_datetime = tournament.ends_at

        # Registration must still be open
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

        # Tournament must not have started
        if now >= tournament_start_datetime:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tournament has already started.",
            )

        # Prevent duplicate team registration
        existing_registration = self.repository.get_existing_registration(
            team_id=team.id,
            tournament_id=tournament.id,
        )

        if existing_registration:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Your team has already applied for this tournament.",
            )

        # Prevent team from participating in overlapping tournaments
        conflicting_tournament = self.repository.get_team_conflicting_tournament(
            team_id=team.id,
            start_at=tournament.starts_at,
            end_at=tournament.ends_at,
        )

        if conflicting_tournament:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "Your team is already registered for another "
                    "tournament during this period."
                ),
            )

        # Create pending registration.
        # A team can apply with only one member.
        registration = self.repository.create_registration(
            team_id=team.id,
            tournament_id=tournament.id,
            captain_id=current_user.id,
        )

        # Tournament Roster
        roster = self.repository.make_roster(
            team_id=registration.team_id,
            registration_id=registration.id,
            tournament_id=registration.tournament_id,
        )

        return {
            "registration_id": registration.id,
            "roster_id": roster.id,
            "tournament_id": tournament.id,
            "team_id": team.id,
            "status": registration.status,
            "message": ("Your team has successfully appliedfor the tournament."),
        }

    # ADD TEAM MEMBER AS TOURNAMENT ROSTER PLAYER

    def add_roster_player(
        self,
        tournament_id: int,
        player_id: int,
        captain: Player,
    ):
        roster = self.repository.get_captain_tournament_roster(
            captain_id=captain.player_id,
            tournament_id=tournament_id,
        )

        if not roster:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament roster not found.",
            )

        # Roster must still be editable
        if roster.status != TournamentRosterStatus.SELECTING:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Roster can no longer be modified.",
            )

        # Player must belong to the team
        team_member = self.repository.get_active_team_member(
            team_id=roster.team_id,
            player_id=player_id,
        )

        if not team_member:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Player is not an active member of this team.",
            )

        # Check whether this player already has a roster record
        existing_player = self.repository.get_roster_player(
            roster_id=roster.id,
            player_id=player_id,
        )

        if existing_player:

            # Already selected , nothing to do
            if existing_player.status != TournamentRosterPlayerStatus.REMOVED.value:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Player is already in the tournament roster.",
                )

            # Previously removed , try to restore
            roster_count = self.repository.count_roster_players(
                roster_id=roster.id,
            )

            if roster_count >= 5:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Roster already contains the maximum of 5 players.",
                )

            existing_player.status = TournamentRosterPlayerStatus.SELECTED.value

            self.repository.db.commit()

            return {
                "message": "Player added back to tournament roster.",
                "roster_id": roster.id,
                "player_id": existing_player.player_id,
                "roster_size": roster_count + 1,
            }

        # Completely new player
        roster_count = self.repository.count_roster_players(
            roster_id=roster.id,
        )

        if roster_count >= 5:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Roster already contains the maximum of 5 players.",
            )

        roster_player = self.repository.add_roster_player(
            roster_id=roster.id,
            roster_player_id=player_id,
        )

        self.repository.db.commit()

        return {
            "message": "Player added to tournament roster.",
            "roster_id": roster.id,
            "player_id": roster_player.player_id,
            "roster_size": roster_count + 1,
        }

    # Remove Roster Player

    def remove_roster_player(
        self,
        tournament_id: int,
        captain: Player,
        player_id: int,
    ):
        if not tournament_id or not player_id:
            return

        try:
            roster = self.repository.get_captain_tournament_roster(
                captain_id=captain.player_id,
                tournament_id=tournament_id,
            )
            print("roster.id",roster.id)
            if not roster:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Tournament roster not found.",
                )

            roster_player = self.repository.get_roster_player_by_id(
                roster_id=roster.id, player_id=player_id
            )

            if not roster_player:
                return {
                    "code": 404,
                    "status": "NOT_FOUND",
                    "message": f"Roster player with id {player_id} was not found.",
                    "data": None,
                }

            # Already removed
            if roster_player.status == TournamentRosterPlayerStatus.REMOVED.value:
                return {
                    "code": 400,
                    "status": "ALREADY_REMOVED",
                    "message": "This player has already been removed from the roster.",
                    "data": None,
                }

            roster_player.status = TournamentRosterPlayerStatus.REMOVED.value

            self.repository.db.commit()

            return {
                "code": 200,
                "status": "REMOVED",
                "message": "Player removed from roster successfully.",
                "data": None,
            }

        except Exception as e:
            self.repository.db.rollback()
            print("Removing roster player error:", e)
            raise
        
        
        

    # Confirm Roster
    def confirm_roster(self, registration_id: int, captain: Player):

        roster = self.repository.my_roster(
            registration_id=registration_id, member=captain
        )

        if not roster:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament Roster Not Found.",
            )

        if roster.status != TournamentRosterStatus.SELECTING:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Roster has already been confirmed or locked.",
            )

        if roster.selected_roster_count != 5:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Roster must contain exactly 5 selected players. "
                f"Currently selected: {roster.selected_player_count}.",
            )

        confirmed_roster = self.repository.confirm_roster(roster=roster)
        entry_fee = roster.registration.tournament.entry_fee

        self.repository.create_contribution(
            roster_players=roster.players, entry_fee=entry_fee
        )

        self.repository.db.commit()
        self.repository.db.refresh(roster)

        return {"message": "Done.", "data": {"roster": roster}}

    def contribution_stats(
        self, registration_id: int, team_id: int, current_user: Player
    ):

        contributions = self.repository.get_tournament_contribution(
            registration_id=registration_id,
            team_id=team_id,
        )

        response = [
            TeamContributionResponse(
                id=contribution.id,
                username=contribution.roster_player.player.username,
                email=contribution.roster_player.player.email,
                mlbb_id=contribution.roster_player.player.mlbb_id,
                mlbb_server=contribution.roster_player.player.mlbb_server,
                amount=contribution.amount,
                contribution_status=contribution.status,
                paid_at=contribution.paid_at,
            )
            for contribution in contributions
        ]

        return {
            "message": "Success",
            "data": response,
        }

    def tournament_detail(self, tournament_id: int, current_user: Player):

        if not tournament_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Tournament Id Missing."
            )

        tournament = self.repository.get_tournament_by_id(tournament_id)

        if not tournament:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No tournament found with this ID",
            )

        return TeamTournamentDetailResponse.model_validate(tournament)

    def get_payment_review(self, tournament_id: int, current_user: Player):

        if not tournament_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Tournament Id Missing."
            )

        # Current User Team Tournament

        review = self.repository.get_tournament_review(
            tournament_id=tournament_id, player_id=current_user.id
        )

        if not review:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Tournament Not Found"
            )

        return TournamentReviewResponse(
            team=TeamReview(
                id=review.team.id,
                roster_id=review.roster.id,
                team_name=review.team.name,
            ),
            tournament=TournamentReview.model_validate(review.tournament),
            player=PlayerReview(
                id=current_user.id, player_name=current_user.email.split("@")[0]
            ),
        )

