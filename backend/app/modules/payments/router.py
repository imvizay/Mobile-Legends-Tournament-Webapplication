from fastapi import APIRouter, Depends, Header

from ..auth.models import Player
from app.dependencies.auth import get_current_user
from .services import PaymentService
from .dependency import get_payment_service

router = APIRouter(prefix="/payments", tags=["PAYMETS"])

@router.post("/contribution/{registration_id}/razorpay/create-order")
def create_razorpay_order(
    registration_id: int,
    idempotency_key: str = Header(
        ...,
        alias="Idempotency-Key"
    ),
    current_user: Player = Depends(get_current_user),
    payment_service: PaymentService = Depends(get_payment_service),
):
    print("REGISTRATION ID:", registration_id)
    print("IDEMPOTENCY KEY:", idempotency_key)

    return payment_service.create_razorpay_order(
        registration_id=registration_id,
        current_user=current_user,
        idempotency_key=idempotency_key,
    )