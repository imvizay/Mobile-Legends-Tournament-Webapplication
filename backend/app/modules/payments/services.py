from datetime import datetime, timezone
from decimal import Decimal, ROUND_DOWN
from sqlalchemy.sql import func
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
from .repository import PaymentRepository
from .helpers import *
from app.core.config.settings import settings
from app.integrations.razorpay.razorpay_client import razorpay_client
from app.integrations.razorpay.verifier import RazorpayVerifier
from .razorpay_verifier_exception import *
from app.integrations.razorpay.razorpay_service import RazorpayGatewayService
from app.integrations.razorpay.razorpay_inspector import RazorpayPaymentInspector


class PaymentService:

    def __init__(self, repository: PaymentRepository):
        self.repository = repository
        self.razorpay_verifier = RazorpayVerifier()
        self.razorpay_service = RazorpayGatewayService()
        self.razorpay_inspector = RazorpayPaymentInspector()

    def create_razorpay_order(
        self,
        registration_id: int,
        roster_id: int,
        current_user: Player,
        idempotency_key: str,
    ):
        if not registration_id:
            raise MissingContributionIdException()

        if not roster_id:
            raise TournamentRosterNotFoundException()

        if not idempotency_key:
            raise MissingIdempotencyKeyException()

        contribution_player = self.repository.find_contribution_id(
            roster_id=roster_id,
            player_id=current_user.id,
        )

        if contribution_player is None:
            return {
                "success": False,
                "code": "CONTRIBUTION_RECORD_NOT_FOUND",
                "message": (
                    "You are not a member of the roster player list"
                    "for the provided roster."
                ),
                "data": None,
            }

        contribution_id = contribution_player.id

        payment = self.repository.get_payment_by_contribution_id(
            contribution_id=contribution_id,
        )

        if payment:
            if payment.status == PaymentStatus.PAID:
                return payment_already_paid_response(payment)

            if payment.status == PaymentStatus.PENDING:

                # if any same request attempt exists
                existing_attempt = (
                    self.repository.get_payment_attempt_by_idempotency_key(
                        idempotency_key=idempotency_key,
                    )
                )

                if existing_attempt:

                    if existing_attempt.payment_id != payment.id:
                        raise PaymentException(
                            "The idempotency key belongs to another payment."
                        )

                    # if existing attempt of the same request is paid
                    if existing_attempt.status == PaymentAttemptStatus.SUCCESS:
                        if payment.status != PaymentStatus.PAID:
                            self.repository.mark_payment_paid(
                                payment_id=payment.id,
                            )
                            self.repository.db.commit()

                        return payment_attempt_success_response(
                            payment=payment,
                            payment_attempt=existing_attempt,
                        )

                    # if existing attempt of the same request is due/unpaid/created
                    if (
                        existing_attempt.status == PaymentAttemptStatus.CREATED
                        and existing_attempt.gateway_order_id
                    ):
                        razorpay_order = self.razorpay_inspector.inspect_order(
                            existing_attempt.gateway_order_id
                        )

                        if razorpay_order["state"] == "UNKNOWN":
                            return {
                                "code": 404,
                                "status": "RAZORPAY_ORDER_NOT_FOUND",
                                "message": "No such order with this order id {existing_attempt.gateway_order_id} found",
                            }

                        if razorpay_order["state"] == "PAID":

                            # razorpay_order_payments
                            razorpay_payments = (
                                self.razorpay_inspector.inspect_payments(
                                    existing_attempt.gateway_order_id
                                )
                            )

                            if razorpay_payments["state"] == "PAID":
                                self.repository.mark_payment_attempt_success(
                                    attempt_id=existing_attempt.id,
                                    gateway_payment_id=razorpay_payments["payment"].id,
                                )
                                self.repository.mark_payment_paid(payment_id=payment.id)
                                self.repository.db.commit()

                                return payment_already_paid_response(payment)

                        # if razorpay order status other than paid
                        return payment_attempt_resumable_response(
                            payment=payment,
                            payment_attempt=existing_attempt,
                        )

                    if (
                        existing_attempt.status
                        in (
                            PaymentAttemptStatus.CREATED,
                            PaymentAttemptStatus.PROCESSING,
                        )
                        and not existing_attempt.gateway_order_id
                    ):
                        return payment_attempt_processing_response(
                            payment=payment,
                            payment_attempt=existing_attempt,
                        )

                    if existing_attempt.status == PaymentAttemptStatus.FAILED:
                        raise PaymentException(
                            "This payment attempt has already failed. "
                            "Please create a new payment attempt."
                        )

                latest_attempt = self.repository.get_latest_payment_attempt(
                    payment_id=payment.id,
                )

                if latest_attempt:
                    print("LATEST ATTEMPT", True)
                    if (
                        latest_attempt.status == PaymentAttemptStatus.CREATED
                        and latest_attempt.gateway_order_id
                    ):
                        # razorpay reconcilation
                        razorpay_order = self.razorpay_inspector.inspect_order(
                            latest_attempt.gateway_order_id
                        )

                        if razorpay_order["state"] == "PAID":

                            self.repository.mark_payment_attempt_success(
                                attempt_id=latest_attempt.id,
                                gateway_payment_id=razorpay_order["order"].id,
                            )

                            self.repository.mark_payment_paid(payment_id=payment.id)
                            self.repository.db.commit()

                            return payment_already_paid_response(payment)

                        return payment_attempt_resumable_response(
                            payment=payment,
                            payment_attempt=latest_attempt,
                        )

                    if (
                        latest_attempt.status == PaymentAttemptStatus.CREATED
                        and not latest_attempt.gateway_order_id
                    ):

                        return payment_attempt_resumable_response(payment=payment)

        # continue as if no payments exists proceed towards creating an order
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
            TournamentRegistrationStatus.CANCELLED,
            TournamentRegistrationStatus.FAILED,
        ):
            raise TournamentRegistrationNotEligibleException()

        roster = tournament_registration.roster

        if not roster:
            raise TournamentRosterNotFoundException()

        if roster.id != roster_id:
            raise TournamentRosterNotFoundException()

        if roster.status != TournamentRosterStatus.CONFIRMED:
            raise RosterNotLockedException()

        roster_player = next(
            (
                roster_member
                for roster_member in roster.players
                if roster_member.player_id == current_user.id
            ),
            None,
        )

        if not roster_player:
            raise PlayerNotInRosterException()

        contribution = roster_player.contribution

        if not contribution:
            raise ContributionNotFoundException()

        if roster_player.id != contribution.roster_player_id:
            raise ContributionNotFoundException(
                contribution_id=contribution_id,
            )

        if contribution.status == TeamTournamentContributionStatus.PAID:
            return contribution_already_paid_response(contribution)

        if contribution.status in (
            TeamTournamentContributionStatus.REFUND_PENDING,
            TeamTournamentContributionStatus.REFUNDED,
        ):
            raise ContributionPaymentNotAllowedException()

        tournament = tournament_registration.tournament

        if not tournament:
            raise TournamentNotFoundException()

        now = datetime.now(timezone.utc)

        registration_opens_at = tournament.registration_opens_at
        registration_closes_at = tournament.registration_closes_at

        if not registration_opens_at or not registration_closes_at:
            raise InvalidTournamentScheduleException()

        if registration_opens_at >= registration_closes_at:
            raise InvalidTournamentScheduleException()

        if now < registration_opens_at:
            raise PaymentWindowNotOpenException()

        if now > registration_closes_at:
            raise PaymentWindowClosedException()

        payment = self.repository.get_payment_by_contribution_id(
            contribution_id=contribution.id,
        )

        if payment:

            if payment.status == PaymentStatus.PAID:
                return payment_already_paid_response(payment)

            if payment.status == PaymentStatus.PENDING:

                latest_attempt = self.repository.get_latest_payment_attempt(
                    payment_id=payment.id,
                )

                if latest_attempt:

                    if (
                        latest_attempt.status == PaymentAttemptStatus.CREATED
                        and latest_attempt.gateway_order_id
                    ):
                        return payment_attempt_resumable_response(
                            payment=payment,
                            payment_attempt=latest_attempt,
                        )

                    if (
                        latest_attempt.status == PaymentAttemptStatus.PROCESSING
                        and latest_attempt.gateway_order_id
                    ):
                        return payment_attempt_resumable_response(
                            payment=payment,
                            payment_attempt=latest_attempt,
                        )

                    if (
                        latest_attempt.status == PaymentAttemptStatus.PROCESSING
                        and not latest_attempt.gateway_order_id
                    ):
                        return payment_attempt_processing_response(
                            payment=payment,
                            payment_attempt=latest_attempt,
                        )

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

        if not payment:
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

        locked_payment = self.repository.get_payment_by_contribution_id_for_update(
            contribution_id=contribution.id,
        )

        if not locked_payment:
            raise PaymentException("Unable to lock the payment record.")

        payment = locked_payment

        if payment.status == PaymentStatus.PAID:
            self.repository.db.commit()

            return payment_already_paid_response(payment)

        if payment.status != PaymentStatus.PENDING:
            self.repository.db.rollback()
            raise ContributionPaymentNotAllowedException()

        active_attempt = self.repository.get_latest_active_payment_attempt(
            payment_id=payment.id,
        )

        if active_attempt:

            if (
                active_attempt.status == PaymentAttemptStatus.CREATED
                and active_attempt.gateway_order_id
            ):
                self.repository.db.commit()

                return payment_attempt_resumable_response(
                    payment=payment,
                    payment_attempt=active_attempt,
                )

            if (
                active_attempt.status == PaymentAttemptStatus.PROCESSING
                and active_attempt.gateway_order_id
            ):
                self.repository.db.commit()

                return payment_attempt_resumable_response(
                    payment=payment,
                    payment_attempt=active_attempt,
                )

            if (
                active_attempt.status == PaymentAttemptStatus.PROCESSING
                and not active_attempt.gateway_order_id
            ):
                self.repository.db.commit()

                return payment_attempt_processing_response(
                    payment=payment,
                    payment_attempt=active_attempt,
                )

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

        self.repository.db.commit()

        try:
            razorpay_order = razorpay_client.order.create(
                data={
                    "amount": razorpay_amount,
                    "currency": "INR",
                    "receipt": payment.payment_reference,
                    "partial_payment": False,
                }
            )

        except Exception as exc:
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
                failure_reason="Razorpay returned no order ID.",
            )

            self.repository.db.commit()

            raise RazorpayOrderCreationException()

        updated_attempt = self.repository.update_payment_attempt_order(
            attempt_id=payment_attempt.id,
            gateway_order_id=gateway_order_id,
        )

        if not updated_attempt:
            self.repository.db.rollback()
            raise RazorpayOrderCreationException()

        self.repository.db.commit()

        return payment_order_created_response(
            payment=payment,
            payment_attempt=payment_attempt,
            razorpay_order=razorpay_order,
        )

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
