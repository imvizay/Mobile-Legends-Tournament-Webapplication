from sqlalchemy.orm import Session
from .models import Team,TeamMember
from ..auth.models import Player
from sqlalchemy import exists
class TeamRepository:

    def __init__(self, db: Session):
        self.db = db

    # check whether user is already associated with team as member or captain.
    def player_has_team(self,user_id:int):
        return ( 
           exists().where(
               TeamMember.player_id == user_id
           ).scalar()
        )
        

    # get team_name already exist
    def get_team_by_name(self,team_name:str):
        return (
            self.db.query(Team)
            .filter(Team.name == team_name)
            .first()
        )

    # generate team

    def create_team(self,team_slug:str,team_data):
       pass

