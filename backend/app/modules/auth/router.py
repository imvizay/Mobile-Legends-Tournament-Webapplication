from fastapi import APIRouter,Depends
from .schema import AuthCreateRequest
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
    
    return service.pending_registration(payload,bg_task)


@router.post('/verify-email')
def verify_email(
    token:str,
    service: AuthService=Depends(get_auth_service)
):

    return service.verify_registration_token(token)
    

@router.post('/resend-verification')
def resend_verification_token(
    email:str,
    bg_task: BackgroundTasks,
    service: AuthService=Depends(get_auth_service)
):
    return service.resend_verification_token(email,bg_task)