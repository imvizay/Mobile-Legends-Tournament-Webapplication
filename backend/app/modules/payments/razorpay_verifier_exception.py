from .exceptions import PaymentException

class TournamentContributionNotFoundException(PaymentException):
    def __init__(
        self,
        message: str = "No tournament contribution was found for this player.",
    ):
        super().__init__(message)
        

class PaymentVerificationException(PaymentException):
    def __init__(self,message:str):
        super().__init__(message)
        
class PaymentVerificationDataMissingException(PaymentException):
    def __init__(self):
        super().__init__("Required payment verification data is missing.")


class PaymentNotFoundForVerificationException(PaymentException):
    def __init__(self):
        super().__init__("The payment record could not be found for verification.")


class PaymentAttemptNotFoundForVerificationException(PaymentException):
    def __init__(self):
        super().__init__("The payment attempt could not be found for verification.")


class PaymentAttemptNotPendingException(PaymentException):
    def __init__(self):
        super().__init__("This payment attempt is no longer pending verification.")


class PaymentOrderMismatchException(PaymentException):
    def __init__(self):
        super().__init__("The Razorpay order does not match the payment attempt.")


class PaymentVerificationSignatureInvalidException(PaymentException):
    def __init__(self):
        super().__init__(
            "Payment verification failed because the Razorpay signature is invalid."
        )


class PaymentAlreadyVerifiedException(PaymentException):
    def __init__(self):
        super().__init__("This payment has already been successfully verified.")


class PaymentAmountMismatchException(PaymentException):
    def __init__(self):
        super().__init__(
            "The payment amount does not match the expected contribution amount."
        )


class PaymentCurrencyMismatchException(PaymentException):
    def __init__(self):
        super().__init__("The payment currency does not match the expected currency.")


class RazorpayPaymentNotCapturedException(PaymentException):
    def __init__(self):
        super().__init__(
            "The Razorpay payment has not been captured and cannot be marked as paid."
        )
