from sqlalchemy.orm import Session
from .schemas import TeamCreateSchema
from fastapi import UploadFile
from .validators import validate_image , validate_user_eligibility
from ...modules.auth.models import Player
from .repository import TeamRepository


class TeamService:

    def __init__(self,db:Session,repository:TeamRepository):
        self.db = db
        self.repository = repository

    def create_team(
        self,
        payload: TeamCreateSchema,
        logo: UploadFile | None,
        banner: UploadFile | None,
        current_user: Player,
    ):

        validate_image(logo)
        validate_image(banner)

        # Ensure user eligible to create team.
        user_eligibility = self.repository.player_has_team(current_user.id)
        if user_eligibility is not None:
           raise "ExceptionPlayerHasTeam"

        # Ensure wehther a team with team name already exits or not. 
        team_exists = self.repository.get_team_by_name(payload.team_name)
        if team_exists is not None:
           raise "ExceptionTeamExits"
        
        # upload image to cloudinary helper
        # logo_url = self._upload_logo(logo)
        # banner_url = self._upload_banner(banner)

        try:
            # create team
            team = self.repository.create_team(
                payload,
                logo_url,
                banner_url,
                current_user,
            )

            self.repository.create_wallet(team)
            self.repository.create_owner_membership(team,current_user)

            self.db.commit()

            return team
        
        except:
         self.db.rollback()
         raise


    def join_team(self,team_id:int,player_id:int):
       pass
    
    # This service makes captain invite players and notifies player about invitation through notification. 
    def invite_player(self,current_user:int,player_id:int):
        
        # background task notify invited user about invitation 
       pass

    # remove specific player from team
    def remove_player(self,player_id:int):
       pass
    
    # disbanned team if captain manually disband or all members leaves the team 
    def disbanned_team(self,captain_id:int):
       pass
       