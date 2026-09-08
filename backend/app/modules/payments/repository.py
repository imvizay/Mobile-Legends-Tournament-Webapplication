from datetime import datetime, timezone

from sqlalchemy import func
from sqlalchemy.orm import joinedload, with_loader_criteria

from ..teams.models import *
from .models import *
from .helpers import generate_payment_reference

ACTIVE_ATTEMPT_STATUSES = (
    PaymentAttemptStatus.CREATED,
    PaymentAttemptStatus.PROCESSING,
)


class PaymentRepository:

    def __init__(self, db):
        self.db = db

    def get_payment_by_idempotency_key(self,idempotency_key: str,):
        return (
            self.db.query(Payment)
            .filter(
                Payment.idempotency_key == idempotency_key,
            )
            .first()
        )

    def get_active_payment(self,payment_id: int,):
        return (
            self.db.query(Payment)
            .filter(
                Payment.id == payment_id,
                Payment.status == PaymentStatus.PENDING,
            )
            .first()
        )

    def get_latest_payment_attempt(self, payment_id: int):
        return (
            self.db.query(PaymentAttempt)
            .join(Payment, Payment.id == PaymentAttempt.payment_id)
            .filter(
                Payment.id == payment_id,
                PaymentAttempt.status.in_(ACTIVE_ATTEMPT_STATUSES),
            )
            .order_by(PaymentAttempt.attempt_number.desc())
            .first()
        )

    def get_contributer_team_membership(self,player_id: int,):
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

    def create_payment(
        self,
        idempotency_key: str,
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
            idempotency_key=idempotency_key,
            payment_type=payment_type,
            status=status,
            amount=amount,
            player_id=player_id,
            team_id=team_id,
            tournament_id=tournament_id,
            registration_id=registration_id,
            contribution_id=contribution_id,
        )

        self.db.add(payment)
        self.db.flush()

        payment.payment_reference = generate_payment_reference(
            payment_type=payment_type,
            payment_id=payment.id,
        )

        self.db.add(payment)
        self.db.flush()

        return payment

    def get_next_attempt_number(self,payment_id: int,):
        latest_attempt = (
            self.db.query(PaymentAttempt.attempt_number)
            .filter(
                PaymentAttempt.payment_id == payment_id,
            )
            .order_by(PaymentAttempt.attempt_number.desc())
            .first()
        )

        if not latest_attempt:
            return 1

        return latest_attempt[0] + 1

    def create_payment_attempt(
        self,
        payment_id: int,
        attempt_number: int,
        status: PaymentAttemptStatus,
        amount,
        gateway: str,
    ):
        payment_attempt = PaymentAttempt(
            payment_id=payment_id,
            attempt_number=attempt_number,
            status=status,
            amount=amount,
            gateway=gateway,
        )

        self.db.add(payment_attempt)
        self.db.flush()

        return payment_attempt

    def update_payment_attempt_order(
        self,
        attempt_id: int,
        gateway_order_id: str,
    ):
        payment_attempt = (
            self.db.query(PaymentAttempt)
            .filter(
                PaymentAttempt.id == attempt_id,
            )
            .first()
        )

        if not payment_attempt:
            return None

        payment_attempt.gateway_order_id = gateway_order_id

        self.db.flush()

        return payment_attempt

    def mark_payment_attempt_failed(
        self,
        attempt_id: int,
        failure_reason: str | None = None,
    ):
        payment_attempt = (
            self.db.query(PaymentAttempt)
            .filter(
                PaymentAttempt.id == attempt_id,
            )
            .first()
        )

        if not payment_attempt:
            return None

        payment_attempt.status = PaymentAttemptStatus.FAILED
        payment_attempt.failure_reason = failure_reason
        payment_attempt.completed_at = datetime.now(timezone.utc)

        self.db.flush()

        return payment_attempt

    def mark_payment_attempt_cancelled(self,attempt_id: int,):
        payment_attempt = (
            self.db.query(PaymentAttempt)
            .filter(
                PaymentAttempt.id == attempt_id,
                PaymentAttempt.status.in_(ACTIVE_ATTEMPT_STATUSES),
            )
            .first()
        )

        if not payment_attempt:
            return None

        payment_attempt.status = PaymentAttemptStatus.CANCELLED
        payment_attempt.completed_at = datetime.now(timezone.utc)

        self.db.flush()

        return payment_attempt

    def mark_payment_attempt_success(
        self,
        attempt_id: int,
        gateway_payment_id: str,
        payment_method: str | None = None,
    ):
        payment_attempt = (
            self.db.query(PaymentAttempt)
            .filter(
                PaymentAttempt.id == attempt_id,
            )
            .first()
        )

        if not payment_attempt:
            return None

        payment_attempt.status = PaymentAttemptStatus.SUCCESS
        payment_attempt.gateway_payment_id = gateway_payment_id
        payment_attempt.payment_method = payment_method
        payment_attempt.completed_at = datetime.now(timezone.utc)

        self.db.flush()

        return payment_attempt

    def mark_payment_paid(self,payment_id: int,):
        payment = (
            self.db.query(Payment)
            .filter(
                Payment.id == payment_id,
            )
            .first()
        )

        if not payment:
            return None

        payment.status = PaymentStatus.PAID
        payment.paid_at = datetime.now(timezone.utc)

        self.db.flush()

        return payment
