from sqlalchemy.orm import Session
from .schemas import TeamCreateSchema , TeamResponseOutput , TeamResponse , TeamWalletResponse , TeamMemberResponse
from fastapi import UploadFile
from .validators import validate_image 
from app.core.exceptions.exceptions import ExceptionTeamAlreadyExits,ExceptionPlayerAlreadyHasTeam,NoTeamException
from ...modules.auth.models import Player
from .repository import TeamRepository

# upload image to cloudinary 
from ...core.cloudinary.cloudinary_services import cloud_service 

class TeamService:

    def __init__(self,db:Session,repository:TeamRepository):
        self.db = db
        self.repository = repository

    def get_my_team(self,current_user: Player):
        
        team = self.repository.get_team_by_player(current_user.id)

        if not team:
           raise NoTeamException()
        
        return( TeamResponseOutput (
          team = TeamResponse(
           team_name = team.name,
           team_tag = team.tag,
           team_max_members = team.max_members,
           team_logo_url = team.logo_url,
           team_banner_url = team.banner_url,
           team_bio = team.description or "",
           team_country = team.country,
           team_visibility = team.visibility,
           team_created_at = team.created_at,

           team_wallet = TeamWalletResponse(
              wallet_balance = team.wallet.balance,
              status = team.wallet.status
           ),

           team_members = [
              TeamMemberResponse(
                 player_name = member.player.email.split("@")[0],
                 player_email = member.player.email,
                 player_role = member.role
              )
              for member in team.members
           ]
          )
        ))
    

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
        player_in_team = self.repository.player_has_team(current_user.id)

        if player_in_team:
           raise ExceptionPlayerAlreadyHasTeam()

        # Ensure wehther a team with team name already exits or not. 
        team_exists = self.repository.get_team_by_name(payload.team_name)
        if team_exists:
           raise ExceptionTeamAlreadyExits()
        
        print("LOGO:",logo)
        print("BANNER:",banner)

        # upload image to cloudinary helper
        logo = cloud_service.upload_image(logo,folder="teams/logo")
        banner = cloud_service.upload_image(banner,folder="teams/banner")

        try:
            # create team
            team = self.repository.create_team(
                current_user=current_user,
                payload=payload,
                logo=logo,
                banner=banner,
            )   

            self.db.flush()

            team_wallet = self.repository.create_team_wallet(team_id=team.id)
            team_member = self.repository.join_team(team_id=team.id,player_id=current_user.id,player_role="captain")

            self.db.commit()
            self.db.refresh(team)

            return {
               "message":"Team Created Successfully",
               "status":200,
               "team_id":team.id
            }
        
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
       