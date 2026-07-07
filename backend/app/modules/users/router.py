from fastapi import APIRouter,Depends
from app.modules.auth.models import Player
from app.dependencies.roles import get_current_admin
from .service import UserService
from .dependency import get_user_service


router = APIRouter(
    prefix="/admin/users",
    tags=["Users"]
)

@router.get("/list")
def users(
    current_user:Player = Depends(get_current_admin),
    user_service: UserService = Depends(get_user_service)
):
    
    return user_service.get_users(current_user=current_user)