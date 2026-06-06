from fastapi import APIRouter,Depends
from .schema import AuthCreateRequest,AuthResponse
from .service import AuthService
from .dependency import get_auth_service

# background tasks
from fastapi.background import BackgroundTasks

router = APIRouter(
    prefix='/auth',
    tags=['Authentication']
)

# dependency

@router.post('/register')
def register(
    payload: AuthCreateRequest,
    bg_task: BackgroundTasks,
    service: AuthService = Depends(get_auth_service),
):
    
    result = service.pending_registration(payload,bg_task)

    return {
        "status": 200,
        "data": {
            "id": result.id,
            "email": result.email,
        }
    }

@router.post('/verify-email')
def verify_email(token:str,service: AuthService=Depends(get_auth_service)):

    pass