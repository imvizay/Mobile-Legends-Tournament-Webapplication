from sqlalchemy.orm import Session
from .models import Player

class AuthRepository:

    def __init__(self,db:Session):
        self.db = db

    def get_by_email(self,email:str):
        return (
            self.db.query(Player)
            .filter(Player.email == email)
            .first()
        )

    def create_user(self,player:Player):
        self.db.add(player)
        self.db.commit()
        self.db.refresh(player)

        return player
        