from sqlalchemy.orm import Session , joinedload , selectinload
from .models import Team,TeamMember,TeamWallet,TeamMemberStatus
from ..auth.models import Player
from sqlalchemy import exists
class TeamRepository:

    def __init__(self, db: Session):
        self.db = db

    # check whether user is already associated with team as member or captain.
    def get_team_by_player(self,current_user_id:int):
        return (
            self.db.query(Team)
            .join(TeamMember)
            .options(
                joinedload(Team.wallet),
                selectinload(Team.members).joinedload(TeamMember.player),
            )
            .filter(
                TeamMember.player_id == current_user_id,
                TeamMember.status == TeamMemberStatus.ACTIVE
            )
            .first()
        )
        

    def player_has_team(self, user_id: int) -> bool:
        return (
            self.db.query(TeamMember)
            .filter(TeamMember.player_id == user_id)
            .first()
            is not None
        )
        

    # get team_name already exist
    def get_team_by_name(self,team_name:str):
        return (
            self.db.query(Team)
            .filter(Team.name == team_name)
            .first()
        )

    # generate team

    def create_team(self,current_user:str,payload:Team,logo: dict,banner:dict):
        
        logo_public_id = None
        logo_url = None

        if logo:
            logo_public_id = logo["public_id"]
            logo_url = logo["secure_url"]

        banner_public_id = None
        banner_url = None

        if banner:
            banner_public_id = banner["public_id"]
            banner_url = banner["secure_url"]

        team = (
            Team(
                name=payload.team_name,
                tag = payload.team_tag,

                logo_public_id = logo_public_id,
                logo_url = logo_url,

                banner_public_id = banner_public_id,
                banner_url = banner_url,

                description = payload.team_bio,

                country = payload.team_region,
                city = payload.team_city,

                visibility = payload.team_visibility ,

                is_verified = True,

                captain_id = current_user.id,
                created_by = current_user.id,
            )
        )
        self.db.add(team)

        return team
    
    def join_team(self,team_id:int,player_id:int,player_role:str):
        
        team_member = TeamMember (
            team_id = team_id,
            player_id = player_id,
            role=player_role
        )

        self.db.add(team_member)
        return team_member
    
    def create_team_wallet(self,team_id:int):

        wallet = (
            TeamWallet(
                team_id = team_id,
            )
        )
        self.db.add(wallet)
        return wallet
    
    



        

       

