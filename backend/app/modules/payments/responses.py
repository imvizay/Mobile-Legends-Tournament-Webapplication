# responses.py

from app.core.config.settings import settings


def payment_already_paid_response(payment):
    """
    Response returned when the contribution payment
    has already been completed.
    """

    return {
        "success": True,
        "code": "PAYMENT_ALREADY_PAID",
        "message": "This payment has already been completed.",
        "data": {
            "payment_id": payment.id,
            "payment_reference": payment.payment_reference,
            "status": payment.status.value
            if hasattr(payment.status, "value")
            else payment.status,
            "paid_at": payment.paid_at,
        },
    }


def payment_attempt_processing_response(
    payment,
    payment_attempt,
):
    """
    Response returned when a payment attempt exists but
    the Razorpay order has not been created/persisted yet.
    """

    return {
        "success": True,
        "code": "PAYMENT_ATTEMPT_PROCESSING",
        "message": (
            "Your payment request is being processed. "
            "Please retry shortly."
        ),
        "data": {
            "payment_id": payment.id,
            "attempt_id": payment_attempt.id,
            "payment_reference": payment.payment_reference,
            "status": payment_attempt.status.value
            if hasattr(payment_attempt.status, "value")
            else payment_attempt.status,
            "order_id": payment_attempt.gateway_order_id,
            "amount": float(payment_attempt.amount),
            "currency": "INR",
            "key_id": None,
            "gateway_payment_id": payment_attempt.gateway_payment_id,
            "payment_method": (
                payment_attempt.payment_method.value
                if hasattr(payment_attempt.payment_method, "value")
                else payment_attempt.payment_method
            ),
        },
    }


def payment_attempt_resumable_response(
    payment,
    payment_attempt,
):
    """
    Response returned when an existing Razorpay order
    can safely be resumed.
    """

    return {
        "success": True,
        "code": "PAYMENT_ATTEMPT_RESUMABLE",
        "message": "An existing payment order can be resumed.",
        "data": {
            "payment_id": payment.id,
            "attempt_id": payment_attempt.id,
            "payment_reference": payment.payment_reference,
            "status": payment_attempt.status.value
            if hasattr(payment_attempt.status, "value")
            else payment_attempt.status,
            "order_id": payment_attempt.gateway_order_id,
            "amount": float(payment_attempt.amount),
            "currency": "INR",
            "key_id": settings.RAZORPAY_KEY_ID,
            "gateway_payment_id": payment_attempt.gateway_payment_id,
            "payment_method": (
                payment_attempt.payment_method.value
                if hasattr(payment_attempt.payment_method, "value")
                else payment_attempt.payment_method
            ),
        },
    }


def payment_order_created_response(
    payment,
    payment_attempt,
    razorpay_order,
):
    """
    Response returned after successfully creating
    and persisting a Razorpay order.
    """

    return {
        "success": True,
        "code": "PAYMENT_ORDER_CREATED",
        "message": "Payment order created successfully.",
        "data": {
            "payment_id": payment.id,
            "attempt_id": payment_attempt.id,
            "payment_reference": payment.payment_reference,
            "status": payment_attempt.status.value
            if hasattr(payment_attempt.status, "value")
            else payment_attempt.status,
            "order_id": razorpay_order["id"],
            "amount": float(payment_attempt.amount),
            "currency": razorpay_order.get("currency", "INR"),
            "key_id": settings.RAZORPAY_KEY_ID,
            "gateway_payment_id": payment_attempt.gateway_payment_id,
            "payment_method": (
                payment_attempt.payment_method.value
                if hasattr(payment_attempt.payment_method, "value")
                else payment_attempt.payment_method
            ),
        },
    }


def payment_attempt_success_response(
    payment,
    payment_attempt,
):
    """
    Response returned when the payment attempt has
    been successfully verified/reconciled.
    """

    return {
        "success": True,
        "code": "PAYMENT_SUCCESS",
        "message": "Payment completed successfully.",
        "data": {
            "payment_id": payment.id,
            "attempt_id": payment_attempt.id,
            "payment_reference": payment.payment_reference,
            "status": payment_attempt.status.value
            if hasattr(payment_attempt.status, "value")
            else payment_attempt.status,
            "order_id": payment_attempt.gateway_order_id,
            "amount": float(payment_attempt.amount),
            "currency": "INR",
            "key_id": settings.RAZORPAY_KEY_ID,
            "gateway_payment_id": payment_attempt.gateway_payment_id,
            "payment_method": (
                payment_attempt.payment_method.value
                if hasattr(payment_attempt.payment_method, "value")
                else payment_attempt.payment_method
            ),
        },
    }