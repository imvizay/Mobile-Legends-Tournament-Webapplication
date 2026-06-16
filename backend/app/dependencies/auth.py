
from app.modules.auth.models import Player
from fastapi import Depends,Request
from sqlalchemy.orm import Session
from app.core.db.session import get_db

from app.modules.auth.service import TokenService
from app.core.exceptions.exceptions import InvalidTokenException

token_service = TokenService()

def get_current_user(
        request:Request,
        db:Session = Depends(get_db)
):

    # extract token from cookie
    token = request.cookies.get("access_token")

    if not token:
        raise InvalidTokenException()
    
    # decode token
    payload = token_service.decode_token(token)

    # verify token
    verified_token = token_service.verify_token_type(payload,"access")

    user_id = int(payload["sub"])

    # get user
    player  = (
        db.query(Player)
        .filter(
            Player.id == user_id,
            Player.is_banned == False,
            Player.verified == True
        )
        .first()
    )
    
    if player is None:
        raise InvalidTokenException()
    
    return player


