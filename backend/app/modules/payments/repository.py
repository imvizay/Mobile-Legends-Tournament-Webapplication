from datetime import datetime, timezone

from sqlalchemy.orm import joinedload, with_loader_criteria

from ..teams.models import *
from .models import *
from .helpers import generate_payment_reference

ACTIVE_ATTEMPT_STATUSES = (PaymentAttemptStatus.CREATED,)


class PaymentRepository:

    def __init__(self, db):
        self.db = db

    # ============================================================
    # PAYMENT
    # ============================================================
    def get_payment_reference(self, reference: str, player_id: int):

        payment = (
            self.db.query(Payment)
            .join(PaymentAttempt, Payment.id == PaymentAttempt.payment_id)
            .filter(
                Payment.payment_reference == reference, 
                Payment.player_id == player_id,
                PaymentAttempt.status == PaymentAttemptStatus.SUCCESS.value
            ).one_or_none()
        )
        
        return payment

    def get_payment_by_contribution_id(
        self,
        contribution_id: int,
        player_id: int,
    ):
        return (
            self.db.query(Payment)
            .filter(
                Payment.contribution_id == contribution_id,
                Payment.player_id == player_id,
            )
            .first()
        )

    def get_payment_by_contribution_id_for_update(
        self,
        contribution_id: int,
        player_id: int,
    ):
        return (
            self.db.query(Payment)
            .filter(
                Payment.contribution_id == contribution_id,
                Payment.player_id == player_id,
            )
            .with_for_update()
            .first()
        )

    def create_payment(
        self,
        payment_type: PaymentType,
        status: PaymentStatus,
        amount,
        player_id: int,
        team_id: int,
        tournament_id: int,
        registration_id: int,
        contribution_id: int,
    ):
        payment = Payment(
            payment_type=payment_type.value,
            status=status.value,
            amount=amount,
            player_id=player_id,
            team_id=team_id,
            tournament_id=tournament_id,
            registration_id=registration_id,
            contribution_id=contribution_id,
            payment_reference="TEMP",
        )

        self.db.add(payment)
        self.db.flush()

        # Generate reference only AFTER payment.id exists.
        payment.payment_reference = generate_payment_reference(
            payment_type=payment_type,
        )

        self.db.flush()

        return payment

    def mark_payment_paid(
        self,
        payment_id: int,
    ):
        payment = (
            self.db.query(Payment)
            .filter(
                Payment.id == payment_id,
            )
            .first()
        )

        if not payment:
            return None

        if payment.status != PaymentStatus.PAID.value:
            payment.status = PaymentStatus.PAID.value
            payment.paid_at = datetime.now(timezone.utc)

        self.db.flush()

        return payment

    # ============================================================
    # PAYMENT ATTEMPTS
    # ============================================================

    def get_payment_attempt_by_idempotency_key(
        self,
        idempotency_key: str,
    ):
        return (
            self.db.query(PaymentAttempt)
            .filter(
                PaymentAttempt.idempotency_key == idempotency_key,
            )
            .first()
        )

    def get_latest_payment_attempt(
        self,
        payment_id: int,
    ):
        return (
            self.db.query(PaymentAttempt)
            .filter(
                PaymentAttempt.payment_id == payment_id,
            )
            .order_by(
                PaymentAttempt.attempt_number.desc(),
            )
            .first()
        )

    def get_latest_active_payment_attempt(
        self,
        payment_id: int,
    ):
        return (
            self.db.query(PaymentAttempt)
            .filter(
                PaymentAttempt.payment_id == payment_id,
                PaymentAttempt.status.in_(ACTIVE_ATTEMPT_STATUSES),
            )
            .order_by(
                PaymentAttempt.attempt_number.desc(),
            )
            .first()
        )

    def get_next_attempt_number(
        self,
        payment_id: int,
    ):
        latest = (
            self.db.query(PaymentAttempt.attempt_number)
            .filter(
                PaymentAttempt.payment_id == payment_id,
            )
            .order_by(
                PaymentAttempt.attempt_number.desc(),
            )
            .first()
        )

        if not latest:
            return 1

        return latest[0] + 1

    def create_payment_attempt(
        self,
        payment_id: int,
        attempt_number: int,
        idempotency_key: str,
        status: PaymentAttemptStatus,
        amount,
        gateway: PaymentGateway,
    ):
        attempt = PaymentAttempt(
            payment_id=payment_id,
            attempt_number=attempt_number,
            idempotency_key=idempotency_key,
            status=status.value,
            amount=amount,
            gateway=gateway.value,
        )

        self.db.add(attempt)
        self.db.flush()

        return attempt

    def update_payment_attempt_order(
        self,
        attempt_id: int,
        gateway_order_id: str,
    ):
        attempt = (
            self.db.query(PaymentAttempt)
            .filter(
                PaymentAttempt.id == attempt_id,
            )
            .first()
        )

        if not attempt:
            return None

        attempt.gateway_order_id = gateway_order_id

        self.db.flush()

        return attempt

    def mark_payment_attempt_success(
        self,
        attempt_id: int,
        gateway_payment_id: str,
        payment_method: str | None = None,
    ):
        attempt = (
            self.db.query(PaymentAttempt)
            .filter(
                PaymentAttempt.id == attempt_id,
            )
            .first()
        )

        if not attempt:
            return None

        attempt.status = PaymentAttemptStatus.SUCCESS.value
        attempt.gateway_payment_id = gateway_payment_id
        attempt.payment_method = payment_method
        attempt.completed_at = datetime.now(timezone.utc)

        self.db.flush()

        return attempt

    def mark_payment_attempt_failed(
        self,
        attempt_id: int,
        failure_reason: str | None = None,
        failure_code: str | None = None,
    ):
        attempt = (
            self.db.query(PaymentAttempt)
            .filter(
                PaymentAttempt.id == attempt_id,
            )
            .first()
        )

        if not attempt:
            return None

        attempt.status = PaymentAttemptStatus.FAILED.value
        attempt.failure_reason = failure_reason
        attempt.failure_code = failure_code
        attempt.completed_at = datetime.now(timezone.utc)

        self.db.flush()

        return attempt

    def get_payment_attempt_by_gateway_order_id_for_update(
        self,
        gateway_order_id: str,
    ):
        return (
            self.db.query(PaymentAttempt)
            .filter(PaymentAttempt.gateway_order_id == gateway_order_id)
            .with_for_update(of=PaymentAttempt)
            .first()
        )

    # ============================================================
    # CONTRIBUTION
    # ============================================================

    def find_contribution_id(
        self,
        roster_id: int,
        player_id: int,
    ):
        return (
            self.db.query(TeamTournamentContribution)
            .join(
                TournamentRosterPlayer,
                TournamentRosterPlayer.id
                == TeamTournamentContribution.roster_player_id,
            )
            .filter(
                TournamentRosterPlayer.roster_id == roster_id,
                TournamentRosterPlayer.player_id == player_id,
            )
            .first()
        )

    def get_contributer_team_membership(
        self,
        player_id: int,
    ):
        return (
            self.db.query(TeamMember)
            .filter(
                TeamMember.player_id == player_id,
            )
            .first()
        )

    def get_contribution_summary(
        self,
        registration_id: int,
        team_id: int,
        player_id: int,
    ):
        return (
            self.db.query(TeamTournamentRegistration)
            .options(
                joinedload(TeamTournamentRegistration.tournament),
                joinedload(TeamTournamentRegistration.roster)
                .joinedload(TournamentRoster.players)
                .joinedload(TournamentRosterPlayer.contribution),
                with_loader_criteria(
                    TournamentRosterPlayer,
                    TournamentRosterPlayer.player_id == player_id,
                ),
            )
            .filter(
                TeamTournamentRegistration.id == registration_id,
                TeamTournamentRegistration.team_id == team_id,
                TournamentRoster.team_id == team_id,
                TournamentRosterPlayer.player_id == player_id,
            )
            .first()
        )

    def get_contribution_by_registration_and_player(
        self,
        registration_id: int,
        player_id: int,
    ):
        return (
            self.db.query(TeamTournamentContribution)
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
                TournamentRosterPlayer.player_id == player_id,
            )
            .first()
        )
