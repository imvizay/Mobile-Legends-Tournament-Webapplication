from fastapi import Request
from fastapi.responses import JSONResponse

from app.core.exceptions.exceptions import (
    InvalidSessionException,
    InvalidTokenException,
    PendingRegistrationExistsError,
    RevokedTokenException,
    TokenExpiredException,
    UserAlreadyExistsError,
    UserBannedException,
    UserNotFoundException,
)
from app.modules.teams.exceptions import (
    NoTeamError,
    PlayerAlreadyHasTeamError,
    TeamAlreadyExistsError,
)


# USER REGISTRATION HANDLERS
async def user_already_exists(request: Request,exception:UserAlreadyExistsError):
    return JSONResponse(
        status_code=409,
        content={
            "message":str(exception)
        }
    )


async def user_pending_registration_exists(request: Request,exception:PendingRegistrationExistsError):
    return JSONResponse(
        status_code=409,
        content={
            "status":'pending',
            "message":str(exception),
        }
    )

async def user_not_found(request: Request,exception: UserNotFoundException):
    return JSONResponse(
        status_code=404,
        content={
            "message":"User Not Found"
        }
    )


async def user_banned(request: Request,exception: UserBannedException):
    return JSONResponse(
        status_code=403,
        content = {
            "message":"Your account has been forbideen or banned"
        }
    )

# TOKEN EXCEP HANDLERS
async def invalid_credentials(request: Request,exception: InvalidTokenException):
    return JSONResponse(
        status_code=401,
        content={
            "success": False,
            "message": "Invalid email or password."
        }
    )

async def invalid_token(request: Request,exception: TokenExpiredException):
    return JSONResponse(
        status_code=401,
        content={
            "success": False,
            "message": "Authentication session has expired or the token is invalid."
        }
    )

async def revoked_token(request: Request,exception: RevokedTokenException):
    return JSONResponse(
        status_code=401,
        content={
            "success": False,
            "code": "TOKEN_REVOKED",
            "message": "Your session has been revoked. Please sign in again."
        }
    )

async def invalid_session(request: Request,exception: InvalidSessionException):
    return JSONResponse(
        status_code=401,
        content={
            "success": False,
            "code": "SESSION_NOT_FOUND",
            "message": "Your session is no longer valid. Please sign in again."
        }
    )

# TEAM EXCEPTION HANDLERS
async def team_exists(request: Request,exception:TeamAlreadyExistsError):
    return JSONResponse(
        status_code=404,
        content={
            "message":"Team with this name already exits."
        }
    )

async def player_already_in_team(request: Request,exception:PlayerAlreadyHasTeamError):
    return JSONResponse(
        status_code=404,
        content={
            "message":"Player is associated with some team."
        }
    )

async def player_no_team(request: Request,exception:NoTeamError):
    return JSONResponse(
        status_code=404,
        content={
            "code":"TEAM_NOT_FOUND",
            "message":"You are not part of any team.",
            "has_team":False
        }
    )