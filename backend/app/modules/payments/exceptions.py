from ...core.exceptions.exceptions import AppException


class PaymentException(AppException):
    """Base exception for all payment-related errors."""

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


# =========================================================
# REQUEST / VALIDATION
# =========================================================

class MissingContributionIdException(PaymentException):
    def __init__(self):
        super().__init__(
            "Contribution ID is required."
        )


class ContributionNotFoundException(PaymentException):
    def __init__(self, contribution_id: int):
        super().__init__(
            f"Contribution with ID {contribution_id} was not found."
        )


class InvalidContributionException(PaymentException):
    def __init__(self):
        super().__init__(
            "The contribution is invalid for this payment."
        )


class MissingIdempotencyKeyException(PaymentException):
    def __init__(self):
        super().__init__(
            "Idempotency-Key header is required."
        )


class InvalidIdempotencyKeyException(PaymentException):
    def __init__(self):
        super().__init__(
            "The provided Idempotency-Key is invalid."
        )


class IdempotencyKeyAlreadyExistsException(PaymentException):
    def __init__(self):
        super().__init__(
            "This idempotency key has already been used."
        )


# =========================================================
# TEAM / REGISTRATION ELIGIBILITY
# =========================================================

class PlayerTeamNotFoundException(PaymentException):
    def __init__(self):
        super().__init__(
            "Player does not belong to a team eligible for this payment."
        )


class TournamentRegistrationNotFoundException(PaymentException):
    def __init__(self):
        super().__init__(
            "Tournament registration was not found."
        )


class TournamentRegistrationNotEligibleException(PaymentException):
    def __init__(self):
        super().__init__(
            "This tournament registration is not eligible for payment."
        )


class TournamentRegistrationCancelledException(PaymentException):
    def __init__(self):
        super().__init__(
            "This tournament registration has been cancelled."
        )


class TournamentRegistrationFailedException(PaymentException):
    def __init__(self):
        super().__init__(
            "This tournament registration is no longer valid for payment."
        )


# =========================================================
# ROSTER ELIGIBILITY
# =========================================================

class TournamentRosterNotFoundException(PaymentException):
    def __init__(self):
        super().__init__(
            "Tournament roster was not found."
        )


class RosterNotLockedException(PaymentException):
    def __init__(self):
        super().__init__(
            "Roster must be locked before payment can be made."
        )


class PlayerNotInRosterException(PaymentException):
    def __init__(self):
        super().__init__(
            "Player is not part of the tournament roster."
        )


class InvalidRosterException(PaymentException):
    def __init__(self):
        super().__init__(
            "The tournament roster is not eligible for payment."
        )


# =========================================================
# CONTRIBUTION STATE
# =========================================================

class ContributionAlreadyPaidException(PaymentException):
    def __init__(self):
        super().__init__(
            "This contribution has already been paid."
        )


class ContributionPaymentInProgressException(PaymentException):
    def __init__(self):
        super().__init__(
            "A payment for this contribution is already in progress."
        )


class ContributionPaymentExpiredException(PaymentException):
    def __init__(self):
        super().__init__(
            "This contribution is no longer eligible for payment."
        )


class ContributionPaymentNotAllowedException(PaymentException):
    def __init__(self):
        super().__init__(
            "Payment is not allowed for this contribution."
        )


# =========================================================
# TOURNAMENT PAYMENT ELIGIBILITY
# =========================================================

class TournamentNotFoundException(PaymentException):
    def __init__(self):
        super().__init__(
            "Tournament was not found."
        )


class TournamentNotAcceptingPaymentsException(PaymentException):
    def __init__(self):
        super().__init__(
            "This tournament is not currently accepting payments."
        )


class InvalidTournamentScheduleException(PaymentException):
    def __init__(self):
        super().__init__(
            "The tournament payment schedule is invalid."
        )


class PaymentWindowNotOpenException(PaymentException):
    def __init__(self):
        super().__init__(
            "The tournament payment window has not opened yet."
        )


class PaymentWindowClosedException(PaymentException):
    def __init__(self):
        super().__init__(
            "The tournament payment window has closed."
        )


# =========================================================
# PAYMENT ATTEMPT
# =========================================================

class PaymentAttemptNotFoundException(PaymentException):
    def __init__(self):
        super().__init__(
            "Payment attempt was not found."
        )


class PaymentAttemptAlreadyProcessedException(PaymentException):
    def __init__(self):
        super().__init__(
            "This payment attempt has already been processed."
        )


class PaymentAttemptAlreadyInProgressException(PaymentException):
    def __init__(self):
        super().__init__(
            "A payment attempt for this contribution is already in progress."
        )


class PaymentAttemptExpiredException(PaymentException):
    def __init__(self):
        super().__init__(
            "This payment attempt has expired."
        )


# =========================================================
# RAZORPAY ORDER
# =========================================================

class RazorpayOrderCreationException(PaymentException):
    def __init__(self):
        super().__init__(
            "Unable to create the Razorpay order."
        )


class RazorpayOrderAlreadyExistsException(PaymentException):
    def __init__(self):
        super().__init__(
            "A Razorpay order has already been created for this contribution."
        )


class RazorpayOrderNotFoundException(PaymentException):
    def __init__(self):
        super().__init__(
            "The Razorpay order could not be found."
        )


class RazorpayOrderMismatchException(PaymentException):
    def __init__(self):
        super().__init__(
            "The Razorpay order does not belong to this contribution."
        )


class RazorpayOrderAmountMismatchException(PaymentException):
    def __init__(self):
        super().__init__(
            "The Razorpay order amount does not match the contribution amount."
        )


class RazorpayOrderAlreadyPaidException(PaymentException):
    def __init__(self):
        super().__init__(
            "This Razorpay order has already been paid."
        )


# =========================================================
# PAYMENT
# =========================================================

class PaymentNotFoundException(PaymentException):
    def __init__(self):
        super().__init__(
            "Payment record was not found."
        )


class PaymentAlreadyProcessedException(PaymentException):
    def __init__(self):
        super().__init__(
            "This payment has already been processed."
        )


class PaymentVerificationFailedException(PaymentException):
    def __init__(self):
        super().__init__(
            "Payment verification failed."
        )


class PaymentSignatureMismatchException(PaymentException):
    def __init__(self):
        super().__init__(
            "Payment signature verification failed."
        )


class PaymentAmountMismatchException(PaymentException):
    def __init__(self):
        super().__init__(
            "The payment amount does not match the expected amount."
        )


class PaymentCurrencyMismatchException(PaymentException):
    def __init__(self):
        super().__init__(
            "The payment currency does not match the expected currency."
        )


class PaymentFailedException(PaymentException):
    def __init__(self):
        super().__init__(
            "The payment failed."
        )

class PaymentAlreadyProcessingException(PaymentException):
    def __init__(self):
        super().__init__("Payment Already In Processing,Please Wait.")

# =========================================================
# WEBHOOK
# =========================================================

class InvalidWebhookSignatureException(PaymentException):
    def __init__(self):
        super().__init__(
            "Invalid Razorpay webhook signature."
        )


class UnsupportedWebhookEventException(PaymentException):
    def __init__(self, event: str):
        super().__init__(
            f"Unsupported Razorpay webhook event: {event}."
        )


class WebhookProcessingException(PaymentException):
    def __init__(self):
        super().__init__(
            "Unable to process the Razorpay webhook."
        )


class WebhookEventAlreadyProcessedException(PaymentException):
    def __init__(self):
        super().__init__(
            "This webhook event has already been processed."
        )


# =========================================================
# REFUND
# =========================================================

class RefundNotAllowedException(PaymentException):
    def __init__(self):
        super().__init__(
            "Refund is not allowed for this payment."
        )


class RefundAlreadyInitiatedException(PaymentException):
    def __init__(self):
        super().__init__(
            "A refund has already been initiated for this payment."
        )


class RefundAlreadyProcessedException(PaymentException):
    def __init__(self):
        super().__init__(
            "This payment has already been refunded."
        )


class RefundNotFoundException(PaymentException):
    def __init__(self):
        super().__init__(
            "Refund record was not found."
        )


class RefundAmountMismatchException(PaymentException):
    def __init__(self):
        super().__init__(
            "The refund amount does not match the allowed refund amount."
        )


class RefundProcessingException(PaymentException):
    def __init__(self):
        super().__init__(
            "Unable to process the refund."
        )


class RazorpayRefundCreationException(PaymentException):
    def __init__(self):
        super().__init__(
            "Unable to create the refund with Razorpay."
        )