from datetime import datetime, timezone

from ..auth.models import Player
from ..teams.models import (
    TeamTournamentContributionStatus,
    TournamentRegistrationStatus,
    TournamentRosterStatus,
)

from .models import (
    PaymentAttemptStatus,
    PaymentStatus,
    PaymentType,
)

from .exceptions import (
    ContributionNotFoundException,
    ContributionPaymentNotAllowedException,
    InvalidTournamentScheduleException,
    MissingContributionIdException,
    MissingIdempotencyKeyException,
    PaymentWindowClosedException,
    PaymentWindowNotOpenException,
    PlayerNotInRosterException,
    PlayerTeamNotFoundException,
    RazorpayOrderCreationException,
    RosterNotLockedException,
    TournamentNotFoundException,
    TournamentRegistrationNotEligibleException,
    TournamentRegistrationNotFoundException,
    TournamentRosterNotFoundException,
)

from .repository import PaymentRepository

from app.core.config.settings import settings
from app.integrations.razorpay.razorpay_client import razorpay_client


class PaymentService:

    def __init__(self, repository: PaymentRepository):
        self.repository = repository

    def create_razorpay_order(
        self,
        registration_id: int,
        current_user: Player,
        idempotency_key: str,
    ):
        # Validate the request values that are required to start
        # the payment flow.
        if not registration_id:
            raise MissingContributionIdException()

        if not idempotency_key:
            raise MissingIdempotencyKeyException()

        # An idempotency key represents one logical payment request.
        # If the same request reaches the server again, return the
        # existing payment instead of creating another one.
        existing_payment = self.repository.get_payment_by_idempotency_key(
            idempotency_key=idempotency_key
        )

        if existing_payment:

            if existing_payment.status == PaymentStatus.PAID:
                return {
                    "success": True,
                    "code": "PAYMENT_ALREADY_PAID",
                    "message": "This payment has already been completed.",
                    "data": {
                        "payment_id": existing_payment.id,
                        "payment_reference": existing_payment.payment_reference,
                        "status": existing_payment.status,
                    },
                }

            if existing_payment.status == PaymentStatus.PENDING:
                latest_attempt  = self.repository.get_latest_payment_attempt()(
                    payment_id=existing_payment.id
                )

                if latest_attempt  == PaymentAttemptStatus.CREATED:
                    return {
                        "success": True,
                        "code": f"PAYMENT_ALREADY_{latest_attempt.status}",
                        "message": "A payment attempt is already in progress.",
                        "data": {
                            "payment_id": existing_payment.id,
                            "attempt_id": latest_attempt.id,
                            "payment_reference": existing_payment.payment_reference,
                            "order_id": latest_attempt.gateway_order_id,
                            "status": existing_payment.status,
                        },
                    }
                    
                if latest_attempt == PaymentAttemptStatus.CREATED:
                    return{
                        "success":True,
                        "code":f"PAYMENT_ALREADY_{latest_attempt.status}",
                        "message":"Payment for this order is in processing.",
                        "data":{
                            "payment_id":existing_payment.id,
                            "payment_refernce":existing_payment.payment_reference,
                            "status":latest_attempt.status
                        }
                    }
                    
                if latest_attempt.status == PaymentAttemptStatus.CREATED and not latest_attempt.gateway_order_id:
                    # incomplete attempt and mark that attemp as failed
                    pass
        

        # Find the team associated with the current player.
        # The contribution payment must be made in the context
        # of that team.
        team_membership = self.repository.get_contributer_team_membership(
            player_id=current_user.id
        )

        if not team_membership:
            raise PlayerTeamNotFoundException()

        # Load the registration together with the roster and the
        # player's contribution.
        tournament_registration = self.repository.get_contribution_summary(
            registration_id=registration_id,
            team_id=team_membership.team_id,
            player_id=current_user.id,
        )

        if not tournament_registration:
            raise TournamentRegistrationNotFoundException()

        # A cancelled or failed registration cannot proceed
        # through the payment flow.
        if tournament_registration.status in (
            TournamentRegistrationStatus.CANCELLED,
            TournamentRegistrationStatus.FAILED,
        ):
            raise TournamentRegistrationNotEligibleException()

        # A confirmed roster is required before the player can
        # make their tournament contribution.
        roster = tournament_registration.roster

        if not roster:
            raise TournamentRosterNotFoundException()

        if roster.status != TournamentRosterStatus.CONFIRMED:
            raise RosterNotLockedException()

        # Make sure the current player is actually part of the
        # confirmed tournament roster.
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

        # Every player who is required to contribute should have
        # a contribution associated with their roster entry.
        contribution = roster_player.contribution

        if not contribution:
            raise ContributionNotFoundException()

        # Already-paid is a valid business state. There is nothing
        # left for the player to pay.
        if contribution.status == TeamTournamentContributionStatus.PAID:
            return {
                "success": True,
                "code": "CONTRIBUTION_ALREADY_PAID",
                "message": "This contribution has already been paid.",
                "data": {
                    "contribution_id": contribution.id,
                    "status": contribution.status,
                    "amount": contribution.amount,
                    "paid_at": contribution.paid_at,
                },
            }

        # A refunded contribution cannot be paid again through
        # the normal contribution payment flow.
        if contribution.status in (
            TeamTournamentContributionStatus.REFUND_PENDING,
            TeamTournamentContributionStatus.REFUNDED,
        ):
            raise ContributionPaymentNotAllowedException()

        # The tournament schedule determines whether payment is
        # currently allowed.
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

        # Check whether there is an attempt that is genuinely
        # in progress. A CREATED attempt alone should not
        # permanently block the player because Checkout may never
        # have opened in the browser.
        active_attempt = self.repository.get_active_payment_attempt(
            contribution_id=contribution.id
        )

        if active_attempt:
            return {
                "success": True,
                "code": "PAYMENT_ALREADY_PROCESSING",
                "message": (
                    "A payment for this contribution is already in progress. "
                    "Please wait for it to complete."
                ),
                "data": {
                    "payment_id": active_attempt.payment_id,
                    "attempt_id": active_attempt.id,
                    "status": active_attempt.status,
                },
            }

        # The contribution amount is controlled by the server.
        # Never accept the amount from the frontend.
        payment_amount = contribution.amount

        # Razorpay expects INR amounts in paise.
        razorpay_amount = int(payment_amount * 100)

        # Create the internal Payment first. This represents the
        # business payment request.
        payment = self.repository.create_payment(
            idempotency_key=idempotency_key,
            payment_type=PaymentType.TOURNAMENT_CONTRIBUTION,
            status=PaymentStatus.PENDING,
            amount=payment_amount,
            team_id=team_membership.team_id,
            player_id=current_user.id,
            tournament_id=tournament.id,
            registration_id=registration_id,
            contribution_id=contribution.id,
        )

        # Create the attempt before contacting Razorpay.
        # This allows us to record the attempt even when Razorpay
        # fails to create the order.
        payment_attempt = self.repository.create_payment_attempt(
            payment_id=payment.id,
            attempt_number=1,
            status=PaymentAttemptStatus.CREATED,
            amount=payment_amount,
            gateway="razorpay",
        )
        self.repository.db.commit()
        try:
            # Create the Razorpay order using the server-controlled
            # amount and our own payment reference.
            razorpay_order = razorpay_client.order.create(
                data={
                    "amount": razorpay_amount,
                    "currency": "INR",
                    "receipt": payment.payment_reference,
                    "partial_payment": False,
                }
            )

        except Exception as exc:
            # The gateway order could not be created, so this
            # particular attempt has failed.
            self.repository.mark_payment_attempt_failed(
                payment_attempt.id,
                failure_reason=str(exc),
            )

            # The overall payment request did not successfully
            # start, so mark the payment accordingly.
            self.repository.mark_payment_failed(payment.id)
            self.repository.db.commit()
            print(f"Razorpay order creation failed " f"[{type(exc).__name__}]: {exc}")

            raise RazorpayOrderCreationException() from exc

        # Razorpay successfully created the order. Store its order ID
        # against this specific attempt.
        self.repository.update_payment_attempt_order(
            payment_attempt.id,
            gateway_order_id=razorpay_order["id"],
        )
        self.repository.db.commit()
        return {
            "success": True,
            "code": "PAYMENT_ORDER_CREATED",
            "message": "Payment order created successfully.",
            "data": {
                "payment_id": payment.id,
                "attempt_id": payment_attempt.id,
                "payment_reference": payment.payment_reference,
                "order_id": razorpay_order["id"],
                "amount": razorpay_order["amount"],
                "currency": razorpay_order["currency"],
                "key_id": settings.RAZORPAY_KEY_ID,
            },
        }
