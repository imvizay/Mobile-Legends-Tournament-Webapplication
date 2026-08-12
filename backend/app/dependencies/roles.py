from app.modules.auth.models import Player
from fastapi import Depends,HTTPException,status
from app.dependencies.auth import get_current_user

def get_current_admin(
    current_user : Player = Depends(get_current_user)
    ):
    
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin Access Required"
        )
        
    return current_user
        