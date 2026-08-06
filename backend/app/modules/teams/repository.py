from sqlalchemy.orm import Session , joinedload , selectinload
from .models import Team,TeamMember,TeamWallet,TeamMemberStatus,TeamJoinRequest,TeamJoinRequestStatus
from ..auth.models import Player
from sqlalchemy import exists,func


class TeamRepository:

    def __init__(self, db: Session):
        self.db = db

    def create_join_application(self,team_id:int,player_id:int):
        join_application = TeamJoinRequest(
            team_id=team_id,
            player_id=player_id
        )

        self.db.add(join_application)
        self.db.commit()
        self.db.refresh()

        return join_application


    def has_pending_request_count(self,player_id:int):
        query = (
            self.db.query(TeamJoinRequest).
            filter(
                TeamJoinRequest.player_id == player_id,
                TeamJoinRequest.status == TeamJoinRequestStatus.PENDING
            )
            .count()
        )
        return query
    
    def has_pending_application(self,team_id:int,player_id:int):
        query = (
            self.db.query(TeamJoinRequest).
            filter(
                TeamJoinRequest.team_id == team_id,
                TeamJoinRequest.player_id == player_id,
                TeamJoinRequest.status == TeamJoinRequestStatus.PENDING
            )
            .first() 
            is not None
        )
        return query

    def get_team_by_id(self,team_id:int):
        query = (
            self.db.query(Team).
            filter(Team.id == team_id).
            first()
        )
        return query

    
    def load_all_active_teams(self, current_user: int, cursor: int | None, limit: int):

        query = (
            self.db.query(Team,func.count(TeamMember.id).label("members_count"))

            .outerjoin(TeamMember, Team.id == TeamMember.team_id)

            .filter(Team.visibility == "public",Team.captain_id != current_user.id,)

            .group_by(Team.id).order_by(Team.id)
        )

        if cursor is not None:
            query = query.filter(Team.id > cursor)

        return query.limit(limit + 1).all()

    

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
        
    # User Already has team
    def player_has_team(self, user_id: int):
        return (
            self.db.query(TeamMember)
            .filter(TeamMember.player_id == user_id)
            .first()
        )
        

    # Team Already Exits
    def get_team_by_name(self,team_name:str):
        return (
            self.db.query(Team)
            .filter(Team.name == team_name)
            .first()
        )

    # Create Team
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
        self.db.commit()
        self.db.refresh(team_member)
        return team_member
    
    def create_team_wallet(self,team_id:int):

        wallet = (
            TeamWallet(
                team_id = team_id,
            )
        )
        self.db.add(wallet)
        return wallet
    
    



        

       

