from fastapi import APIRouter, Depends, Header,Query

from ..auth.models import Player
from app.dependencies.auth import get_current_user
from .services import PaymentService
from .dependency import get_payment_service
from .schemas import *

router = APIRouter(prefix="/payments", tags=["PAYMETS"])


@router.post("/contribution/{registration_id}/razorpay/create-order")
def create_razorpay_order(
    registration_id: int,
    payload: CreateRazorpayOrderRequest,
    idempotency_key: str = Header(..., alias="Idempotency-Key"),
    current_user: Player = Depends(get_current_user),
    payment_service: PaymentService = Depends(get_payment_service),
):
  
    return payment_service.create_razorpay_order(
        registration_id=registration_id,
        roster_id=payload.roster_id,
        current_user=current_user,
        idempotency_key=idempotency_key,
    )


@router.post("/contribution/{registration_id}/razorpay/verify-order")
async def verify_payment(
    registration_id: int,
    payload: VerifyRazorpayPaymentRequest,
    current_user: Player = Depends(get_current_user),
    payment_service: PaymentService = Depends(get_payment_service),
):

    return payment_service.verify_razorpay_payment(
        registration_id=registration_id,
        current_user=current_user,
        razorpay_order_id=payload.razorpay_order_id,
        razorpay_signature=payload.razorpay_signature,
        razorpay_payment_id=payload.razorpay_payment_id,
    )

# GET /api/payments/success/reference?payment_reference=PAY-TC-20260913-C98C550EB5
@router.get('/success/reference/{payment_reference}')
def get_payment_success_by_reference(
    payment_reference:str ,
    current_user:Player=Depends(get_current_user),
    payment_service:PaymentService=Depends(get_payment_service)
):
    
    return payment_service.get_successful_payment_by_reference(
        payment_reference=payment_reference,
        current_user=current_user
    )
