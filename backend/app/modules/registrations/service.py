from ..auth.models import Player
from ..teams.models import (
    TournamentRegistrationStatus,
    TournamentRosterStatus,
)
from .repository import TournamentRegistrationRepository
from fastapi import HTTPException


class TournamentRegistrationService:

    def __init__(self, repository: TournamentRegistrationRepository):
        self.repository = repository

    def approve_registration(self, team_id: int, registration_id: int, admin: Player):

        if not team_id or not registration_id:
            return {"code": 404, "status": "Not Found"}

        # try
        registration = self.repository.get_registration(
            team_id=team_id, registration_id=registration_id
        )

        if not registration:
            return {"code": 404, "status": "REG_APPLICATION_NOT_FOUND"}

        if registration.status == TournamentRegistrationStatus.CANCELLED.value:
            return {
                "code": 200,
                "status": "Ok",
                "message": "registration earlier marked as canclled cannot make change now.",
                "data": {
                    "team_id": registration.team_id,
                    "registration_id": registration.id,
                    "reg_status": registration.status,
                },
            }

        if registration.status == TournamentRegistrationStatus.APPROVED.value:
            return {
                "code": 200,
                "status": "OK",
                "message": "team already approved",
                "data": {
                    "team_id": registration.team_id,
                    "registration_id": registration.id,
                    "reg_status": registration.status,
                },
            }

        # get roster by team_id,registration_id and ensure the roster_player contribution is all paid count 5/5 paid

        # mark registration approved
        try:
            paid_count = self.repository.count_paid_roster_contributions(
                team_id=team_id,
                registration_id=registration_id,
                tournament_id=registration.tournament_id,
            )
            print("paid_count", paid_count)

            if paid_count != 5:
                return {
                    "code": 400,
                    "status": "BAD_REQUEST",
                    "message": "Incomplete Roster Player Payment.",
                }

            self.repository.mark_registration_approved(registration=registration)
            # send notification to the respective team

            return {
                "mssge": "Done",
                "data": {
                    "team_id": registration.team_id,
                    "registration_id": registration.id,
                    "reg_status": registration.status,
                },
            }
        except Exception as e:
            print("approve exception:", e)
            self.repository.db.rollback()
            raise

    def lock_roster(self, team_id: int, registration_id: int, admin: Player):

        if not team_id or not registration_id:
            raise HTTPException(
                status_code=404,
                detail="missing required credentials for locking roster",
            )

        try:
            roster = self.repository.get_team_roster_and_roster_player(
                team_id=team_id,
                registration_id=registration_id,
            )

            if not roster:
                return {
                    "code": 404,
                    "status": "ROSTER_NOT_FOUND",
                    "message": "Team roster not found.",
                }

            if roster.status == TournamentRosterStatus.LOCKED.value:
                return {
                    "code": 200,
                    "status": "OK",
                    "message": "Roster is already locked.",
                    "data": {
                        "team_id": team_id,
                        "registration_id": registration_id,
                        "roster_id": roster.id,
                        "roster_status": roster.status,
                    },
                }

            # Business rule:
            # Only a confirmed roster can be finally locked by admin.
            if roster.status != TournamentRosterStatus.CONFIRMED.value:
                return {
                    "code": 400,
                    "status": "BAD_REQUEST",
                    "message": "Only a confirmed roster can be locked.",
                }

            self.repository.mark_roster_locked(roster=roster)

            return {
                "code": 200,
                "status": "OK",
                "message": "Roster locked successfully.",
                "data": {
                    "team_id": team_id,
                    "registration_id": registration_id,
                    "roster_id": roster.id,
                    "roster_status": roster.status,
                },
            }

        except Exception:
            self.repository.db.rollback()
            raise

    def team_registration_failed(
        self, team_id: int, registration_id: int, payload: str
    ):

        if not team_id or not registration_id:
            return HTTPException(
                status_code=404,
                detail="missing required credentials to mark team registration failed.",
            )

        try:
            registration = self.repository.get_registration(
                team_id=team_id, registration_id=registration_id
            )

            if not registration:
                return HTTPException(
                    status_code=404,
                    detail="registration application with 'TEAM_ID:{team_id}' not found.",
                )
            if registration.status == TournamentRegistrationStatus.CANCELLED.value:
                return {
                    "status": "ALREADY_CANCELLED_OR_FAILED",
                    "code": 200,
                    "data": {
                        "team_id": registration.id,
                        "registration_id": registration.id,
                        "status": registration.status,
                    },
                }

            registration.status = TournamentRegistrationStatus.CANCELLED.value
            self.repository.db.commit()
            self.repository.db.refresh(registration)

            return {
                "code": 200,
                "status": "Done",
                "data": {
                    "team_id": registration.team_id,
                    "registration_id": registration.id,
                    "status": registration.status,
                },
            }

        except Exception:

            self.repository.db.rollback()
            raise
