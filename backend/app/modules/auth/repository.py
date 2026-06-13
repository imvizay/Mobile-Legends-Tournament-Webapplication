from sqlalchemy.orm import Session
from datetime import datetime,UTC
from .models import Player,PendingRegistration

class AuthRepository:

    def __init__(self,db:Session):
        self.db = db

    def get_or_create_user(
            self,
            email:str,
            provider_id:int,
            provider:str
    ):
        
        # check existing user or create it 
        user = (
            self.db.query(Player)
            .filter(
                Player.email == email,
                Player.provider_id == provider_id
            )
            .first()
        )

        if user:
            return user,False
        
        user = Player(
            email=email,
            provider_id=provider_id,
            provider=provider,
            verified=True,
            password='n/a',
        )
        
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        return user,True


    def get_current_user(self,email:str):
        return(
            self.db.query(Player)
            .filter(Player.email == email)
            .first()
        )

    # returns pending registration
    def get_pending_user(self,email:str):
        return (
            self.db.query(PendingRegistration)
            .filter(PendingRegistration.email == email)
            .first()
        )
    
    # resend token 
    def resend_verification_token(
        self,pending_user: PendingRegistration,token: str,expiry: datetime
    ):
        pending_user.verification_token = token
        pending_user.token_expire_at = expiry

        pending_user.last_resent_at = datetime.now(UTC)
        
        pending_user.resent_count += 1

        self.db.commit()
        self.db.refresh(pending_user)

        return pending_user
    
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

    # create pending user 
    def create_pending_user(self,player:PendingRegistration):
        self.db.add(player)
        self.db.commit()
        self.db.refresh(player)

        return player
    
    def activate_pending_user (self, pending_user: PendingRegistration):
        player = Player(
            email=pending_user.email,
            password=pending_user.password,
            role=pending_user.role,
            provider=pending_user.provider,
            verified=True
        )
        self.db.add(player)
        self.db.delete(pending_user)
        
        self.db.commit()

        return player
        