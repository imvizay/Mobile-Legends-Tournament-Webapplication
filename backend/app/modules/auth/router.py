from fastapi import APIRouter,Depends,Response,Request
from .schema import AuthCreateRequest,LoginRequest
from .service import AuthService
from .dependency import get_auth_service
from app.core.config.settings import settings
import json

from .oauth import oauth
from fastapi.responses import RedirectResponse

# background tasks
from fastapi.background import BackgroundTasks

router = APIRouter(
    prefix='/auth',
    tags=['Authentication']
)

# Social Login
@router.get('/discord/login')
async def discord_login(request:Request):
   
    redirect_uri = f'{settings.BACKEND_URL}/api/auth/discord/callback'

    return  await oauth.discord.authorize_redirect(
        request,
        redirect_uri
    )

@router.get('/discord/callback')
async def discord_callback(
    request:Request,
    service: AuthService = Depends(get_auth_service)
):
    token = await oauth.discord.authorize_access_token(request)
   
    resp = await oauth.discord.get(
        "users/@me",
        token=token
    )

    user_info = resp.json()

    result = await service.social_login(
        email=user_info.get("email"),
        provider="discord",
        provider_id=user_info["id"]
    )

    response = RedirectResponse(
        url="http://localhost:5173",
        status_code=302
    )

    response.set_cookie(
        key="access_token",
        value=result["access"],
        httponly=True,
        secure=False,
        samesite="lax"
    )

    response.set_cookie(
        key="refresh_token",
        value=result["refresh"],
        httponly=True,
        secure=False,
        samesite="lax"
    )

    return response



@router.get('/google/login')
async def google_login( request:Request ):

    redirect_uri = f"{settings.BACKEND_URL}/api/auth/google/callback"

    return await oauth.google.authorize_redirect(request,redirect_uri)
    
@router.get('/google/callback')
async def google_callback(
    request:Request,
    service:AuthService=Depends(get_auth_service)
):
    token = await oauth.google.authorize_access_token(request)

    user_info = token["userinfo"]

    result = await service.social_login(
        email=user_info["email"],
        provider="google",
        provider_id=user_info["sub"]
    )

    response = RedirectResponse(
        url="http://localhost:5173",
        status_code=302
    )
    
    response.set_cookie(
        key="access_token",
        value=result["access"],
        httponly=True,
        secure=False, 
        samesite="lax"
    )

    response.set_cookie(
        key="refresh_token",
        value=result["refresh"],
        httponly=True,
        secure=False,
        samesite="lax"
    )

    return response



# Local Login
@router.post('/login')
def login(
    payload:LoginRequest,
    response:Response,
    service:AuthService=Depends(get_auth_service)
    
):

    result =  service.login(payload)

    response.set_cookie(
        key="access_token",
        value=result['access'],
        httponly=True,
        secure=False,
        samesite='lax'
    )

    response.set_cookie(
        key="refresh_token",
        value=result['refresh'],
        httponly=True,
        secure=False,
        samesite='lax'
    )

    return {
        "status":200,
        "message":"login success"
    }



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