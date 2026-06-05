from fastapi import APIRouter,Depends
from .schema import AuthCreateRequest,AuthResponse
from .service import AuthService
from .dependency import get_auth_service

router = APIRouter(
    prefix='/auth',
    tags=['Authentication']
)

# dependency

@router.post('/register')
def register( payload:AuthCreateRequest, service:AuthService = Depends(get_auth_service) ):
    
    result =  service.register(payload)

    return {
        "status":200,
        'data':result
    }