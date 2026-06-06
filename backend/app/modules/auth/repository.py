from sqlalchemy.orm import Session
import datetime
from .models import Player,PendingRegistration

class AuthRepository:

    def __init__(self,db:Session):
        self.db = db

    # returns pending registration
    def get_pending_email(self,email:str):
        return (
            self.db.query(PendingRegistration)
            .filter(PendingRegistration.email == email)
            .first()
        )
    
    # Update verification token and expiry
    def update_verification_token(  
        self,
        pending_user: PendingRegistration,
        token: str,
        expiry: datetime
    ):
        pending_user.verification_token = token
        pending_user.token_expire_at = expiry

        self.db.commit()
        self.db.refresh(pending_user)

        return pending_user

    
    # returns existing user
    def check_user_exists(self,email:str):
        return (
            self.db.query(Player)
            .filter(Player.email == email) 
            .first()
        )

    # create user 
    def create_pending_user(self,player:PendingRegistration):
        self.db.add(player)
        self.db.commit()
        self.db.refresh(player)

        return player
        