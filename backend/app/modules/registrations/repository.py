from ..teams.models import (
    TeamTournamentRegistration,
    TournamentRegistrationStatus,
    TournamentRoster,
    TournamentRosterStatus,
    TournamentRosterPlayer,
    TeamTournamentContribution,
    TournamentRosterPlayerStatus,
    TeamTournamentContributionStatus,
)

from datetime import datetime, timezone
from sqlalchemy.orm import joinedload


class TournamentRegistrationRepository:

    def __init__(self, db):
        self.db = db

    def fetch_team_registered_application(self, team_id: int, registration_id: int):
        reg_application = (
            self.db.query(TeamTournamentRegistration)
            .filter(
                TeamTournamentRegistration.id == registration_id,
                TeamTournamentRegistration.team_id == team_id,
            )
            .one_or_none()
        )

        return reg_application

    def count_paid_roster_contributions(
        self,
        team_id: int,
        registration_id: int,
        tournament_id: int,
    ):
        paid_count = (
            self.db.query(TeamTournamentContribution.id)
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
                TournamentRoster.team_id == team_id,
                TournamentRoster.registration_id == registration_id,
                TournamentRoster.tournament_id == tournament_id,
                TournamentRoster.status == TournamentRosterStatus.CONFIRMED.value,
                TournamentRosterPlayer.status
                == TournamentRosterPlayerStatus.SELECTED.value,
                TeamTournamentContribution.status
                == TeamTournamentContributionStatus.PAID.value,
            )
            .count()
        )

        return paid_count

    def mark_registration_approved(self, registration: TeamTournamentRegistration):
        registration.status = TournamentRegistrationStatus.APPROVED.value
        registration.approved_at = datetime.now(timezone.utc)
        self.db.commit()
        self.db.refresh(registration)

    def get_team_roster_and_roster_player(self, team_id: int, registration_id: int):

        roster_and_roster_players = (
            self.db.query(TournamentRoster)
            .options(joinedload(TournamentRoster.players))
            .filter(
                TournamentRoster.team_id == team_id,
                TournamentRoster.registration_id == registration_id,
            )
            .one_or_none()
        )
        return roster_and_roster_players

    def mark_roster_locked(self, roster: TournamentRoster):
        roster.status = TournamentRosterStatus.LOCKED.value
        self.db.commit()
        self.db.refresh(roster)

    def get_registration(self, team_id: int, registration_id: int):
        
        registration = (
            self.db.query(TeamTournamentRegistration)
            .filter(
                TeamTournamentRegistration.team_id == team_id,
                TeamTournamentRegistration.id == registration_id,
            )
            .one_or_none()
        )
        return registration
