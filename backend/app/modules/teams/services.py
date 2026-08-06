
from fastapi import UploadFile
from sqlalchemy.orm import Session

# Auth User Model
from ...modules.auth.models import Player

# CLOUDINARY SERVICE 
from ...core.cloudinary.cloudinary_services import cloud_service 
from .validators import validate_image 

# Team Request & Response Schemas
from .schemas import( 
   TeamCreateSchema, 
   TeamResponseOutput, 
   TeamResponse, 
   TeamWalletResponse, 
   TeamMemberResponse,
   DiscoverTeamResponse,
   DiscoverTeamOutput, 
   JoinTeamResponse
)

# Team Custom Exception
from app.core.exceptions.exceptions import(
   ExceptionTeamAlreadyExits,
   ExceptionPlayerAlreadyHasTeam
)
from .exceptions import *

# Repository
from .repository import TeamRepository

# Team Service Class
class TeamService:

   def __init__(self,db:Session,repository:TeamRepository):
        self.db = db
        self.repository = repository

   def get_my_team(self,current_user: Player):
        
      team = self.repository.get_team_by_player(current_user.id)
      if not team:
           return TeamResponseOutput(team=None)
        
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
                 player_role = member.role,
                 
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

        
   def discover_team(self,cursor:int,limit:int,current_user: Player,):

      team_member = self.repository.player_has_team(user_id=current_user.id)

      my_team_id = team_member.team_id if team_member else None

      teams = self.repository.load_all_active_teams(current_user,cursor,limit)

      has_next = len(teams) > limit

      if has_next:
         next_cursor = teams[:-1].index
         teams = teams[:limit]

      else:
         next_cursor = None

      
      return DiscoverTeamOutput(
          my_team_id=my_team_id,
          has_next=has_next,
          next_cursor=next_cursor,
          items=[
              DiscoverTeamResponse(
                  id=team.id,
                  name=team.name,
                  tag=team.tag,
                  description=team.description,
                  visibility=team.visibility,
                  logo_url=team.logo_url,
                  banner_url=team.banner_url,
                  country=team.country,
                  created_at=team.created_at,
                  max_members=team.max_members,
                  members_count=members_count,
              )
              for team, members_count in teams
          ]
      )

   
   def join_team(self,team_id:int,current_user:Player):

      if current_user.is_banned:
         raise UserIsBlockedOrInactive()

      is_already_member = self.repository.player_has_team(current_user.id)

      if is_already_member:
         raise UserInTeam()

      team = self.repository.get_team_by_id(team_id)

      if not team:
         raise TeamNotFound()

      members_inside_team = len(team.members)

      if members_inside_team >= 7:
         raise TeamFullException()   
      
      if team.visibility == "public":
         self.repository.join_team(
                  team_id=team_id,
                  player_id=current_user.id,
                  player_role="player"
               )
         return JoinTeamResponse(
                  success=True,
                  status=200,
                  message="Team Joined Successfully."
               ) 

      already_applied = self.repository.has_pending_application(
                           team_id=team_id,
                           player_id=current_user.id
                        )

      if already_applied:
         raise PendingApplicationException()

      # Check pending application for private team
      pending_request = (
         self.repository.has_pending_request_count(
                  team_id=team_id,
                  player_id=current_user.id
               )
            )

      if pending_request >=10:
         raise MaximumJoinRequestException()
      
      self.repository.create_join_request(
         team_id=team_id,
         player_id=current_user.id
      )

      return JoinTeamResponse(
         success=True,
         status=200,
         message="Joining Request Sent Successfully"
      )

      
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
       