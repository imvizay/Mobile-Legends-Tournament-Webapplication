from pydantic import BaseModel , ConfigDict
from decimal import Decimal 
from app.core.config.settings import settings
from datetime import datetime
from .models import PaymentStatus,PaymentType
# frontend payment query res

class PaymentSuccessData(BaseModel):
    id: int
    payment_reference: str
    amount: Decimal
    payment_type: PaymentType
    status: PaymentStatus

    tournament_id: int
    team_id: int
    registration_id: int
    contribution_id: int

    paid_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class PaymentSuccessResponse(BaseModel):
    success: bool = True
    code: str = "PAYMENT_SUCCESS"
    message: str = "Payment was successfully completed."
    data: PaymentSuccessData


# razorpay order created and verification


def contribution_already_paid_response(contribution):
    return {
        "success": True,
        "code": "CONTRIBUTION_ALREADY_PAID",
        "message": "This contribution has already been paid.",
        "data": {
            "contribution_id": contribution.id,
            "status": (
                contribution.status.value
                if hasattr(contribution.status, "value")
                else contribution.status
            ),
            "amount": contribution.amount,
            "paid_at": contribution.paid_at,
        },
    }
def payment_already_paid_response(payment):
    return {
        "success": True,
        "code": "PAYMENT_ALREADY_PAID",
        "message": "This payment has already been completed.",
        "data": {
            "payment_id": payment.id,
            "payment_reference": payment.payment_reference,
            "status": payment.status,
            "paid_at": payment.paid_at,
        
        },
    }


def payment_attempt_success_response(
    payment,
    payment_attempt,
):
    return {
        "success": True,
        "code": "PAYMENT_VERIFIED",
        "message": "Payment has already been successfully verified.",
        "data": {
            "payment_id": payment.id,
            "attempt_id": payment_attempt.id,
            "payment_reference": payment.payment_reference,
            "status": payment_attempt.status,
            "order_id": payment_attempt.gateway_order_id,
            "gateway_payment_id": payment_attempt.gateway_payment_id,
            "amount": payment_attempt.amount,
            "currency": "INR",
        },
    }


def payment_attempt_resumable_response(
    payment,
    payment_attempt,
):
    return {
        "success": True,
        "code": "PAYMENT_ATTEMPT_RESUMABLE",
        "message": "An existing payment order can be resumed.",
        "data": {
            "payment_id": payment.id,
            "attempt_id": payment_attempt.id,
            "payment_reference": payment.payment_reference,
            "status": payment_attempt.status,
            "order_id": payment_attempt.gateway_order_id,
            "amount": payment_attempt.amount,
            "currency": "INR",
            "key_id": settings.RAZORPAY_KEY_ID,
            "gateway_payment_id": payment_attempt.gateway_payment_id,
            "payment_method": payment_attempt.payment_method,
        },
    }


def payment_order_created_response(
    payment,
    payment_attempt,
    razorpay_order,
):
    return {
        "success": True,
        "code": "PAYMENT_ORDER_CREATED",
        "message": "Payment order created successfully.",
        "data": {
            "payment_id": payment.id,
            "attempt_id": payment_attempt.id,
            "payment_reference": payment.payment_reference,
            "status": payment_attempt.status,
            "order_id": razorpay_order["id"],
            "amount": payment_attempt.amount,
            "currency": razorpay_order["currency"],
            "key_id": settings.RAZORPAY_KEY_ID,
        },
    }


def payment_attempt_failed_response(
    payment,
    payment_attempt,
):
    return {
        "success": False,
        "code": "PAYMENT_ATTEMPT_FAILED",
        "message": "This payment attempt has failed. A new payment attempt is required.",
        "data": {
            "payment_id": payment.id,
            "attempt_id": payment_attempt.id,
            "payment_reference": payment.payment_reference,
            "status": payment_attempt.status,
        },
    }