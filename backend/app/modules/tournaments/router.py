from fastapi import APIRouter,Depends,UploadFile,File
from app.modules.auth.models import Player
from .dependency import get_tournament_service,get_tournament_form
from .service import TournamentService
from app.dependencies.roles import get_current_admin
from .schema import TournamentForm

router  = APIRouter(
    prefix="/tournament",
    tags=["Tournaments"]
)

@router.post("/create")
async def create_tournament(
    data:TournamentForm = Depends(get_tournament_form),
    background_image:UploadFile | None = File(None),
    banner_image:UploadFile | None = File(None),
    current_user:Player = Depends(get_current_admin),
    tournament_service: TournamentService = Depends(get_tournament_service)
) :
    
    return await tournament_service.create_tournament(
        admin=current_user,
        validated_data=data,
        background_image=background_image,
        banner_image=banner_image
    )