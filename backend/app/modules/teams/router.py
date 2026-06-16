from fastapi import APIRouter,Request,Response,Depends,UploadFile,File
from app.modules.auth.models import Player
from .schemas import TeamCreateSchema
from app.dependencies.auth import get_current_user

router = APIRouter(
    prefix='/player',
    tags='Team'
)

@router.post('/create-team')
@router.post("/teams")
async def create_team(
    payload: TeamCreateSchema = Depends(TeamCreateSchema.as_form),
    logo: UploadFile | None = File(None),
    banner: UploadFile | None = File(None),
    current_user: Player = Depends(get_current_user),
):

    return team_service.create_team(
        payload,
        logo,
        banner,
        current_user
    )
