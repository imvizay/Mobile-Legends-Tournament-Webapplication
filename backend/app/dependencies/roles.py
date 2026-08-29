from app.modules.auth.models import Player
from fastapi import Depends,HTTPException,status
from app.dependencies.auth import get_current_user
from app.modules.teams.repository import TeamRepository
from app.modules.teams.dependency import get_team_repository


def get_current_admin(
    current_user : Player = Depends(get_current_user)
    ):
    
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin Access Required"
        )
        
    return current_user

def get_team_captain(
    current_user:Player=Depends(get_current_user),
    repository: TeamRepository = Depends(get_team_repository)
):
    user_id = current_user.id

    captain = repository.get_team_captain(player_id=user_id)
    
    
    if captain is None:
        raise HTTPException(
            status_code=status.HTTP_403_BAD_REQUEST,
            detail="Team Captain Access Required"
        )
    
    return captain
        
    
        