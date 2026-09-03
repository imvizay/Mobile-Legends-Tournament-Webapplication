from datetime import datetime, timezone

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

    # PAYMENT VERIFICATION
    def get_payment_attempt_by_gateway_order_id_for_update(
        self,
        gateway_order_id: str,
    ):
        return (
            self.db.query(PaymentAttempt)
            .join(Payment)
            .filter(
                PaymentAttempt.gateway_order_id == gateway_order_id,
            )
            .with_for_update()
            .first()
        )

    # ---------------------------------------------------------
    # PAYMENT
    # ---------------------------------------------------------

    def get_payment_by_contribution_id(
        self,
        contribution_id: int,
    ):
        return (
            self.db.query(Payment)
            .filter(
                Payment.contribution_id == contribution_id,
            )
            .first()
        )

    def get_payment_by_contribution_id_for_update(
        self,
        contribution_id: int,
    ):
        return (
            self.db.query(Payment)
            .filter(
                Payment.contribution_id == contribution_id,
            )
            .with_for_update()
            .first()
        )

    def get_active_payment(
        self,
        payment_id: int,
    ):
        return (
            self.db.query(Payment)
            .filter(
                Payment.id == payment_id,
                Payment.status == PaymentStatus.PENDING,
            )
            .first()
        )

    def get_payment_for_verification(
        self,
        payment_id: int,
    ):
        return (
            self.db.query(Payment)
            .options(
                joinedload(Payment.contribution),
            )
            .filter(
                Payment.id == payment_id,
            )
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
            payment_type=payment_type,
            status=status,
            amount=amount,
            player_id=player_id,
            payment_reference=generate_payment_reference(payment_type),
            team_id=team_id,
            tournament_id=tournament_id,
            registration_id=registration_id,
            contribution_id=contribution_id,
        )

        self.db.add(payment)
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

        payment.status = PaymentStatus.PAID
        payment.paid_at = datetime.now(timezone.utc)

        self.db.flush()

        return payment

    # ---------------------------------------------------------
    # PAYMENT ATTEMPT
    # ---------------------------------------------------------

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

    def get_payment_attempt_by_payment_and_idempotency_key(
        self,
        payment_id: int,
        idempotency_key: str,
    ):
        return (
            self.db.query(PaymentAttempt)
            .filter(
                PaymentAttempt.payment_id == payment_id,
                PaymentAttempt.idempotency_key == idempotency_key,
            )
            .first()
        )

    def get_payment_attempt(
        self,
        attempt_id: int,
    ):
        return (
            self.db.query(PaymentAttempt)
            .filter(
                PaymentAttempt.id == attempt_id,
            )
            .first()
        )

    def get_payment_attempt_for_update(
        self,
        attempt_id: int,
    ):
        return (
            self.db.query(PaymentAttempt)
            .filter(
                PaymentAttempt.id == attempt_id,
            )
            .with_for_update()
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
        latest_attempt = (
            self.db.query(PaymentAttempt.attempt_number)
            .filter(
                PaymentAttempt.payment_id == payment_id,
            )
            .order_by(
                PaymentAttempt.attempt_number.desc(),
            )
            .first()
        )

        if not latest_attempt:
            return 1

        return latest_attempt[0] + 1

    def create_payment_attempt(
        self,
        payment_id: int,
        attempt_number: int,
        idempotency_key: str,
        status: PaymentAttemptStatus,
        amount,
        gateway: PaymentGateway,
    ):
        payment_attempt = PaymentAttempt(
            payment_id=payment_id,
            attempt_number=attempt_number,
            idempotency_key=idempotency_key,
            status=status,
            amount=amount,
            gateway=gateway.value,
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
        failure_code: str | None = None,
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
        payment_attempt.failure_code = failure_code
        payment_attempt.completed_at = datetime.now(timezone.utc)

        self.db.flush()

        return payment_attempt

    def mark_payment_attempt_success(
        self,
        attempt_id: int,
        gateway_payment_id: str,
        payment_method: PaymentMethod | None = None,
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

    def mark_tournament_contribution_paid(self, roster_player_id: int):
        contribution = (
            self.db.query(TeamTournamentContribution)
            .filter(roster_player_id=roster_player_id)
            .first()
        )

        contribution.status = TeamTournamentContributionStatus.PAID

        self.db.flush()

        return contribution

    # ---------------------------------------------------------
    # TEAM / CONTRIBUTION
    # ---------------------------------------------------------

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
                TournamentRoster.id
                == TournamentRosterPlayer.roster_id,
            )
            .filter(
                TournamentRoster.registration_id == registration_id,
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

    def find_contribution_id(
        self,
        roster_id: int,
        player_id: int,
    ):
        contribution = (
            self.db.query(TournamentRosterPlayer)
            .select_from(TeamTournamentContribution)
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

        return contribution

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
