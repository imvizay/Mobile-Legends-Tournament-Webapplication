from fastapi import APIRouter,Request,Response,Depends,UploadFile,File
from app.modules.auth.models import Player
from .schemas import TeamCreateSchema
from app.dependencies.auth import get_current_user
from .services import TeamService
from .dependency import get_team_service

router = APIRouter(
    prefix='/player/team',
    tags=['Team']
)


# GET MY TEAM 
@router.get('/my-team')
async def get_my_team(
    team_service:TeamService = Depends(get_team_service),
    current_user:Player = Depends(get_current_user)
):
    
    return team_service.get_my_team(current_user)
    

# CREATE TEAM 
@router.post('/create')
async def create_team(
    payload: TeamCreateSchema = Depends(TeamCreateSchema.as_form),
    team_service: TeamService = Depends(get_team_service),
    logo: UploadFile | None = File(None),
    banner: UploadFile | None = File(None),
    current_user: Player = Depends(get_current_user),
):  

    print("Create Team Endpoint Reached.")
    return team_service.create_team(
        payload,
        logo,
        banner,
        current_user
    )


# Search teams 
@router.get("/discover")
async def discover_team( 
        cursor:int |None=None,
        limit:int = 12,
        current_user: Player = Depends(get_current_user),
        team_service: TeamService = Depends(get_team_service),
    ):
    
    return team_service.discover_team(
        cursor=cursor,
        limit=limit,
        current_user=current_user
    )

# Join team
@router.post("/{team_id}/join")
async def join_team(
    team_id : int,
    current_user : Player = Depends(get_current_user),
    team_service : TeamService = Depends(get_team_service),
):
   
    return team_service.join_team(team_id,current_user)

 