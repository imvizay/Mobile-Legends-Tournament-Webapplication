from .models import PaymentType
from datetime import datetime, timezone
from app.core.config.settings import settings


def generate_payment_reference(payment_type: PaymentType):

    now = datetime.now(timezone.utc)

    type_code = {
        PaymentType.TOURNAMENT_CONTRIBUTION: "TC",
        PaymentType.WALLET_TOPUP: "WT",
        PaymentType.WITHDRAWAL: "WD",
        PaymentType.REFUND: "RF",
        PaymentType.REWARD: "RW",
    }[payment_type]

    return f"PAY-{type_code}-{now:%Y-%m%d}"


# Responses helpers


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
            "gateway_payment_id": None,
            "payment_method": None,
        },
    }


def contribution_already_paid_response(contribution):
    return {
        "success": True,
        "code": "CONTRIBUTION_ALREADY_PAID",
        "message": "This contribution has already been paid.",
        "data": {
            "contribution_id": contribution.id,
            "status": contribution.status.value,
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


def payment_attempt_success_response(payment, payment_attempt):
    return {
        "success": True,
        "code": "PAYMENT_ATTEMPT_SUCCESS",
        "message": "Payment has already been successfully verified.",
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
            "completed_at": payment_attempt.completed_at,
        },
    }


def payment_attempt_processing_response(payment, payment_attempt):
    return {
        "success": True,
        "code": "PAYMENT_ATTEMPT_PROCESSING",
        "message": (
            "A payment order is currently being created. " "Please retry shortly."
        ),
        "data": {
            "payment_id": payment.id,
            "attempt_id": payment_attempt.id,
            "payment_reference": payment.payment_reference,
            "status": payment_attempt.status,
            "order_id": None,
            "amount": payment_attempt.amount,
            "currency": "INR",
            "key_id": settings.RAZORPAY_KEY_ID,
            "gateway_payment_id": payment_attempt.gateway_payment_id,
            "payment_method": payment_attempt.payment_method,
        },
    }


def payment_attempt_resumable_response(payment, payment_attempt):
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
