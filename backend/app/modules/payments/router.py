from fastapi import APIRouter,Depends

from ..auth.models import Player
from app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/payments",
    tags=["PAYMETS"]
)

@router.post('contribution/{contribution_id}/razorpay/create-order')
def create_razorpay_order(
    contribution_id:int,
    current_user:Player=Depends(get_current_user),
):
    pass