from sqlalchemy.sql import func
from datetime import datetime, timezone
from decimal import Decimal, ROUND_DOWN

from ..auth.models import Player
from ..teams.models import (
    TeamTournamentContributionStatus,
    TournamentRegistrationStatus,
    TournamentRosterStatus,
)

from .models import (
    PaymentAttemptStatus,
    PaymentGateway,
    PaymentStatus,
    PaymentType,
)

from .exceptions import *
from .razorpay_verifier_exception import *
from .repository import PaymentRepository
from .responses import (
    payment_already_paid_response,
    payment_attempt_failed_response,
    payment_attempt_resumable_response,
    payment_attempt_success_response,
    payment_order_created_response,
    PaymentSuccessResponse,
    PaymentSuccessData,
)

from app.core.logging.config import get_logger

from app.core.config.settings import settings
from app.integrations.razorpay.verifier import RazorpayVerifier
from app.integrations.razorpay.razorpay_service import (
    RazorpayGatewayService,
)
from app.integrations.razorpay.razorpay_inspector import (
    RazorpayPaymentInspector,
)

payment_logger = get_logger("app.payment")


class PaymentService:

    def __init__(self, repository: PaymentRepository):
        self.repository = repository
        self.razorpay_verifier = RazorpayVerifier()
        self.razorpay_service = RazorpayGatewayService()
        self.razorpay_inspector = RazorpayPaymentInspector()

    # ============================================================
    # CREATE RAZORPAY ORDER
    # ============================================================

    def create_razorpay_order(
        self,
        registration_id: int,
        roster_id: int,
        current_user: Player,
        idempotency_key: str,
    ):

        if not registration_id:
            raise MissingRegistrationIdException()

        if not roster_id:
            raise TournamentRosterNotFoundException()

        if not current_user or not current_user.id:
            raise PlayerTeamNotFoundException()

        if not idempotency_key:
            raise MissingIdempotencyKeyException()

        payment_logger.info(
            "payment_order_request player=%s registration=%s roster=%s",
            current_user.id,
            registration_id,
            roster_id,
        )

        # ========================================================
        # Find contribution belonging to CURRENT PLAYER
        # ========================================================

        contribution = self.repository.find_contribution_id(
            roster_id=roster_id,
            player_id=current_user.id,
        )

        if not contribution:
            payment_logger.warning(
                "payment_contribution_not_found player=%s roster=%s",
                current_user.id,
                roster_id,
            )

            return {
                "success": False,
                "code": "CONTRIBUTION_RECORD_NOT_FOUND",
                "message": (
                    "You are not a member of the roster player list "
                    "for the provided roster."
                ),
                "data": None,
            }

        contribution_id = contribution.id

        # ========================================================
        # Find logical Payment
        # ========================================================

        payment = self.repository.get_payment_by_contribution_id(
            contribution_id=contribution_id,
            player_id=current_user.id,
        )

        # ========================================================
        # Existing Payment
        # ========================================================

        if payment:

            if payment.status == PaymentStatus.PAID.value:
                payment_logger.info(
                    "payment_already_paid payment=%s player=%s",
                    payment.id,
                    current_user.id,
                )

                return payment_already_paid_response(payment)

            if payment.status != PaymentStatus.PENDING.value:
                raise ContributionPaymentNotAllowedException()

            # ====================================================
            # Check exact idempotency request
            # ====================================================

            existing_attempt = self.repository.get_payment_attempt_by_idempotency_key(
                idempotency_key=idempotency_key,
            )

            if existing_attempt:

                if existing_attempt.payment_id != payment.id:
                    payment_logger.error(
                        "idempotency_key_mismatch key=%s payment=%s attempt_payment=%s",
                        idempotency_key,
                        payment.id,
                        existing_attempt.payment_id,
                    )

                    raise PaymentException(
                        "The idempotency key belongs to another payment."
                    )

                # ------------------------------------------------
                # Same request already succeeded
                # ------------------------------------------------

                if existing_attempt.status == PaymentAttemptStatus.SUCCESS.value:

                    if payment.status != PaymentStatus.PAID.value:
                        self.repository.mark_payment_paid(
                            payment_id=payment.id,
                        )

                    self.repository.db.commit()

                    return payment_attempt_success_response(
                        payment=payment,
                        payment_attempt=existing_attempt,
                    )

                # ------------------------------------------------
                # Same request has a Razorpay order
                # ------------------------------------------------

                if (
                    existing_attempt.status == PaymentAttemptStatus.CREATED.value
                    and existing_attempt.gateway_order_id
                ):

                    return self._reconcile_existing_attempt(
                        payment=payment,
                        payment_attempt=existing_attempt,
                    )

                # ------------------------------------------------
                # Same request exists but Razorpay order failed
                # ------------------------------------------------

                if (
                    existing_attempt.status == PaymentAttemptStatus.CREATED.value
                    and not existing_attempt.gateway_order_id
                ):

                    self.repository.mark_payment_attempt_failed(
                        attempt_id=existing_attempt.id,
                        failure_reason=("Razorpay order was not created."),
                    )

                    self.repository.db.commit()

                    payment_logger.warning(
                        "payment_attempt_failed_without_order payment=%s attempt=%s",
                        payment.id,
                        existing_attempt.id,
                    )

                    # Important:
                    # Do NOT reuse this attempt.
                    # Continue and create a new attempt.

            # Check latest attempt belonging to this Payment.

            latest_attempt = self.repository.get_latest_payment_attempt(
                payment_id=payment.id,
            )

            if latest_attempt:

                if (
                    latest_attempt.status == PaymentAttemptStatus.CREATED.value
                    and latest_attempt.gateway_order_id
                ):

                    return self._reconcile_existing_attempt(
                        payment=payment,
                        payment_attempt=latest_attempt,
                    )

                if (
                    latest_attempt.status == PaymentAttemptStatus.CREATED.value
                    and not latest_attempt.gateway_order_id
                ):

                    self.repository.mark_payment_attempt_failed(
                        attempt_id=latest_attempt.id,
                        failure_reason=(
                            "Previous Razorpay order creation " "did not complete."
                        ),
                    )

                    self.repository.db.commit()

        # Perform expensive registration validation only when necessary.

        team_membership = self.repository.get_contributer_team_membership(
            player_id=current_user.id,
        )

        if not team_membership:
            raise PlayerTeamNotFoundException()

        team_id = team_membership.team_id

        tournament_registration = self.repository.get_contribution_summary(
            registration_id=registration_id,
            team_id=team_id,
            player_id=current_user.id,
        )

        if not tournament_registration:
            raise TournamentRegistrationNotFoundException()

        if tournament_registration.status in (
            TournamentRegistrationStatus.CANCELLED.value,
            TournamentRegistrationStatus.FAILED.value,
        ):
            raise TournamentRegistrationNotEligibleException()

        roster = tournament_registration.roster

        if not roster:
            raise TournamentRosterNotFoundException()

        if roster.id != roster_id:
            raise TournamentRosterNotFoundException()

        if roster.status != TournamentRosterStatus.CONFIRMED.value:
            raise RosterNotLockedException()

        roster_player = next(
            (
                member
                for member in roster.players
                if member.player_id == current_user.id
            ),
            None,
        )

        if not roster_player:
            raise PlayerNotInRosterException()

        contribution = roster_player.contribution

        if not contribution:
            raise ContributionNotFoundException()

        if contribution.status == TeamTournamentContributionStatus.PAID.value:
            return payment_already_paid_response(contribution)

        if contribution.status in (
            TeamTournamentContributionStatus.REFUND_PENDING.value,
            TeamTournamentContributionStatus.REFUNDED.value,
        ):
            raise ContributionPaymentNotAllowedException()

        tournament = tournament_registration.tournament

        if not tournament:
            raise TournamentNotFoundException()

        # Payment amount

        payment_amount = contribution.amount

        if payment_amount is None:
            raise ContributionPaymentNotAllowedException()

        payment_amount = Decimal(str(payment_amount))

        if payment_amount <= Decimal("0"):
            raise ContributionPaymentNotAllowedException()

        razorpay_amount = int(
            (payment_amount * Decimal("100")).quantize(
                Decimal("1"),
                rounding=ROUND_DOWN,
            )
        )

        if razorpay_amount <= 0:
            raise ContributionPaymentNotAllowedException()

        # Lock payment row before creating attempt

        payment = self.repository.get_payment_by_contribution_id_for_update(
            contribution_id=contribution.id,
            player_id=current_user.id,
        )

        if payment:

            if payment.status == PaymentStatus.PAID.value:
                self.repository.db.commit()

                return payment_already_paid_response(payment)

            if payment.status != PaymentStatus.PENDING.value:
                self.repository.db.rollback()

                raise ContributionPaymentNotAllowedException()

        else:

            try:
                payment = self.repository.create_payment(
                    payment_type=PaymentType.TOURNAMENT_CONTRIBUTION,
                    status=PaymentStatus.PENDING,
                    amount=payment_amount,
                    team_id=team_id,
                    player_id=current_user.id,
                    tournament_id=tournament.id,
                    registration_id=registration_id,
                    contribution_id=contribution.id,
                )

                self.repository.db.flush()

            except Exception:
                self.repository.db.rollback()
                raise

        # ========================================================
        # Lock is now held.
        # Check again for active attempt.
        # ========================================================

        active_attempt = self.repository.get_latest_active_payment_attempt(
            payment_id=payment.id,
        )

        if active_attempt:

            if (
                active_attempt.status == PaymentAttemptStatus.CREATED.value
                and active_attempt.gateway_order_id
            ):

                return self._reconcile_existing_attempt(
                    payment=payment,
                    payment_attempt=active_attempt,
                )

            if (
                active_attempt.status == PaymentAttemptStatus.CREATED.value
                and not active_attempt.gateway_order_id
            ):

                self.repository.mark_payment_attempt_failed(
                    attempt_id=active_attempt.id,
                    failure_reason=(
                        "Previous Razorpay order creation " "did not complete."
                    ),
                )

                self.repository.db.flush()

        # Create new PaymentAttempt

        attempt_number = self.repository.get_next_attempt_number(
            payment_id=payment.id,
        )

        payment_attempt = self.repository.create_payment_attempt(
            payment_id=payment.id,
            attempt_number=attempt_number,
            idempotency_key=idempotency_key,
            status=PaymentAttemptStatus.CREATED,
            amount=payment_amount,
            gateway=PaymentGateway.RAZORPAY,
        )

        # Persist attempt BEFORE calling Razorpay

        self.repository.db.commit()

        payment_logger.info(
            "payment_attempt_created payment=%s attempt=%s",
            payment.id,
            payment_attempt.id,
        )

        # Create Razorpay order outside the db transaction
        try:

            razorpay_order = self.razorpay_service.create_order(
                amount=razorpay_amount,
                currency="INR",
                receipt=payment.payment_reference,
            )

        except Exception as exc:

            payment_logger.exception(
                "razorpay_order_creation_failed payment=%s attempt=%s",
                payment.id,
                payment_attempt.id,
            )

            self.repository.mark_payment_attempt_failed(
                attempt_id=payment_attempt.id,
                failure_reason=str(exc),
            )

            self.repository.db.commit()

            raise RazorpayOrderCreationException() from exc

        gateway_order_id = razorpay_order.get("id")

        if not gateway_order_id:

            self.repository.mark_payment_attempt_failed(
                attempt_id=payment_attempt.id,
                failure_reason=("Razorpay returned no gateway order ID."),
            )

            self.repository.db.commit()

            raise RazorpayOrderCreationException()

        # Save Razorpay order ID
        updated_attempt = self.repository.update_payment_attempt_order(
            attempt_id=payment_attempt.id,
            gateway_order_id=gateway_order_id,
        )

        if not updated_attempt:

            self.repository.db.rollback()

            raise RazorpayOrderCreationException()

        self.repository.db.commit()

        payment_logger.info(
            "razorpay_order_created payment=%s attempt=%s",
            payment.id,
            payment_attempt.id,
        )

        return payment_order_created_response(
            payment=payment,
            payment_attempt=payment_attempt,
            razorpay_order=razorpay_order,
        )

    # RAZORPAY RECONCILIATION
    def _reconcile_existing_attempt(
        self,
        payment,
        payment_attempt,
    ):

        payment_logger.info(
            "payment_reconciliation_started payment=%s attempt=%s order=%s",
            payment.id,
            payment_attempt.id,
            payment_attempt.gateway_order_id,
        )

        inspection = self.razorpay_inspector.inspect(payment_attempt.gateway_order_id)

        state = inspection["state"]

        # --------------------------------------------------------
        # Razorpay says PAID
        # --------------------------------------------------------

        if state == "PAID":

            razorpay_payment = inspection.get("payment")

            if not razorpay_payment:

                payment_logger.warning(
                    "razorpay_order_paid_payment_missing payment=%s attempt=%s",
                    payment.id,
                    payment_attempt.id,
                )

                return payment_attempt_resumable_response(
                    payment=payment,
                    payment_attempt=payment_attempt,
                )

            gateway_payment_id = razorpay_payment.get("id")

            if not gateway_payment_id:
                raise PaymentException(
                    "Razorpay reported a paid order without a payment ID."
                )

            payment_method = razorpay_payment.get("method")

            self.repository.mark_payment_attempt_success(
                attempt_id=payment_attempt.id,
                gateway_payment_id=gateway_payment_id,
                payment_method=payment_method,
            )

            self.repository.mark_payment_paid(
                payment_id=payment.id,
            )

            self.repository.db.commit()

            payment_logger.info(
                "payment_reconciled_successfully payment=%s attempt=%s",
                payment.id,
                payment_attempt.id,
            )

            return payment_attempt_success_response(
                payment=payment,
                payment_attempt=payment_attempt,
            )

        # --------------------------------------------------------
        # Razorpay order still usable
        # --------------------------------------------------------

        if state == "RESUMABLE":

            self.repository.db.commit()

            payment_logger.info(
                "payment_order_resumable payment=%s attempt=%s",
                payment.id,
                payment_attempt.id,
            )

            return payment_attempt_resumable_response(
                payment=payment,
                payment_attempt=payment_attempt,
            )

        # --------------------------------------------------------
        # Razorpay order unavailable / invalid
        # --------------------------------------------------------

        if state in ("UNKNOWN", "INVALID"):

            self.repository.mark_payment_attempt_failed(
                attempt_id=payment_attempt.id,
                failure_reason=("Razorpay order is no longer usable."),
            )

            self.repository.db.commit()

            payment_logger.warning(
                "razorpay_order_invalid payment=%s attempt=%s",
                payment.id,
                payment_attempt.id,
            )

            return payment_attempt_failed_response(
                payment=payment,
                payment_attempt=payment_attempt,
            )

        raise PaymentException("Unable to determine Razorpay payment state.")

    # VERIFY PAYMENT
    def verify_razorpay_payment(
        self,
        registration_id: int,
        current_user: Player,
        razorpay_order_id: str,
        razorpay_payment_id: str,
        razorpay_signature: str,
    ):

        # Validate Req

        if not registration_id:
            raise MissingRegistrationIdException()

        if not current_user or not current_user.id:
            raise PlayerTeamNotFoundException()

        if not razorpay_order_id:
            raise PaymentVerificationException("Razorpay order ID is required.")

        if not razorpay_payment_id:
            raise PaymentVerificationException("Razorpay payment ID is required.")

        if not razorpay_signature:
            raise PaymentVerificationException(
                "Razorpay payment signature is required."
            )

        # Find our payment attempt using Razorpay order ID
        payment_attempt = (
            self.repository.get_payment_attempt_by_gateway_order_id_for_update(
                gateway_order_id=razorpay_order_id,
            )
        )

        # Find Roster Through Registration Id And Player Id
        # From Roster.team_id -- > roster player
        contribution = self.repository.get_contribution_by_registration_and_player(
            registration_id=registration_id, player_id=current_user.id
        )

        if not contribution:
            raise TournamentContributionNotFoundException()

        if not payment_attempt:
            raise PaymentVerificationException("Payment attempt could not be found.")

        payment = payment_attempt.payment

        if not payment:
            raise PaymentVerificationException("Payment record could not be found.")

        if payment.player_id != current_user.id:
            raise PaymentVerificationException(
                "This payment does not belong to the current player."
            )

        if payment_attempt.gateway_order_id != razorpay_order_id:
            raise PaymentVerificationException(
                "Razorpay order does not match the payment attempt."
            )

        if payment.status == PaymentStatus.PAID:

            self.repository.db.commit()

            return {
                "success": True,
                "code": "PAYMENT_ALREADY_VERIFIED",
                "message": "This payment has already been verified.",
                "data": {
                    "payment_id": payment.id,
                    "payment_reference": payment.payment_reference,
                    "attempt_id": payment_attempt.id,
                    "gateway_order_id": payment_attempt.gateway_order_id,
                    "gateway_payment_id": payment_attempt.gateway_payment_id,
                    "status": payment.status,
                },
            }

        # Verify Razorpay Checkout Signature
        signature_valid = self.razorpay_verifier.verify_payment_signature(
            order_id=razorpay_order_id,
            payment_id=razorpay_payment_id,
            razorpay_signature=razorpay_signature,
        )

        if not signature_valid:

            self.repository.mark_payment_attempt_failed(
                attempt_id=payment_attempt.id,
                failure_reason="Invalid Razorpay payment signature.",
            )

            self.repository.db.commit()

            raise PaymentVerificationException("Payment verification failed.")

        if payment_attempt.gateway_payment_id:
            if payment_attempt.gateway_payment_id != razorpay_payment_id:
                raise PaymentVerificationException(
                    "Payment ID does not match the existing payment attempt."
                )

        self.repository.mark_payment_attempt_success(
            attempt_id=payment_attempt.id,
            gateway_payment_id=razorpay_payment_id,
        )

        self.repository.mark_payment_paid(
            payment_id=payment.id,
        )

        # mark current user contribution as paid
        contribution.status = TeamTournamentContributionStatus.PAID
        contribution.paid_at = func.now()
        self.repository.db.flush()

        self.repository.db.commit()

        return {
            "success": True,
            "code": "PAYMENT_VERIFIED",
            "message": "Payment verified successfully.",
            "data": {
                "payment_id": payment.id,
                "payment_reference": payment.payment_reference,
                "attempt_id": payment_attempt.id,
                "gateway_order_id": payment_attempt.gateway_order_id,
                "gateway_payment_id": razorpay_payment_id,
                "status": PaymentStatus.PAID,
            },
        }

    # Check Payment Staus
    def get_successful_payment_by_reference(
        self,
        payment_reference: str,
        current_user: Player,
    ) -> PaymentSuccessResponse:
        payment = self.repository.get_payment_reference(
            reference=payment_reference,
            player_id=current_user.id,
        )

        if payment is None:
            raise PaymentRecordNotFoundException()

        return PaymentSuccessResponse(data=PaymentSuccessData.model_validate(payment))
