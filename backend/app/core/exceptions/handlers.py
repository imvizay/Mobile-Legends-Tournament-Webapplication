from fastapi import requests
from fastapi.responses import JSONResponse
from app.core.exceptions.exceptions import ( 
    UserAlreadyExistsError,
    PendingRegistrationExistsError,
    UserBannedException,
    UserNotFoundException,

    TokenExpiredException,
    RevokedTokenException,
    InvalidSessionException,
    InvalidTokenException,

    ExceptionPlayerAlreadyHasTeam,
    ExceptionTeamAlreadyExits,
    NoTeamException
    

)

# USER REGISTRATION HANDLERS
async def user_already_exists(request:requests,exception:UserAlreadyExistsError):
    return JSONResponse(
        status_code=409,
        content={
            "message":str(exception)
        }
    )


async def user_pending_registration_exists(request:requests,exception:PendingRegistrationExistsError):
    return JSONResponse(
        status_code=409,
        content={
            "status":'pending',
            "message":str(exception),
        }
    )

async def user_not_found(request: requests,exception: UserNotFoundException):
    return JSONResponse(
        status_code=404,
        content={
            "message":"User Not Found"
        }
    )


async def user_banned(request: requests,exception: UserBannedException):
    return JSONResponse(
        status_code=403,
        content = {
            "message":"Your account has been forbideen or banned"
        }
    )

# TOKEN EXCEP HANDLERS
async def invalid_credentials(request: requests,exception: InvalidTokenException):
    return JSONResponse(
        status_code=401,
        content={
            "success": False,
            "message": "Invalid email or password."
        }
    )

async def invalid_token(request: requests,exception: TokenExpiredException):
    return JSONResponse(
        status_code=401,
        content={
            "success": False,
            "message": "Authentication session has expired or the token is invalid."
        }
    )

async def revoked_token(request: requests,exception: RevokedTokenException):
    return JSONResponse(
        status_code=401,
        content={
            "success": False,
            "code": "TOKEN_REVOKED",
            "message": "Your session has been revoked. Please sign in again."
        }
    )

async def invalid_session(request: requests,exception: InvalidSessionException):
    return JSONResponse(
        status_code=401,
        content={
            "success": False,
            "code": "SESSION_NOT_FOUND",
            "message": "Your session is no longer valid. Please sign in again."
        }
    )

# TEAM EXCEPTION HANDLERS
async def team_exists(request:requests,exception:ExceptionTeamAlreadyExits):
    return JSONResponse(
        status_code=404,
        content={
            "message":"Team with this name already exits."
        }
    )

async def player_already_in_team(request:requests,exception:ExceptionPlayerAlreadyHasTeam):
    return JSONResponse(
        status_code=404,
        content={
            "message":"Player is associated with some team."
        }
    )

async def player_no_team(request:requests,exception:NoTeamException):
    return JSONResponse(
        status_code=404,
        content={
            "message":"You are not part of any team."
        }
    )