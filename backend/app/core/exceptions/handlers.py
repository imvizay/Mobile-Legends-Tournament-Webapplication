from fastapi import requests
from fastapi.responses import JSONResponse
from app.core.exceptions.exceptions import ( 
    UserAlreadyExistsError,
    PendingRegistrationExistsError,
    UserBannedException,
    UserNotFoundException,
    InvalidCredentialsException,
    InvalidTokenException
)

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
            "message":"Your account has been banned"
        }
    )

async def invalid_credentials(request: requests,exception: InvalidCredentialsException):
    return JSONResponse(
        status_code=401,
        content = {
           "message": "Invalid email or password"
        }
    )

async def invalid_token(request:requests,exception:InvalidTokenException):
    return JSONResponse(
        status_code = 404,
        content = {
            "message":"token is either invalid or expired."
        }
    )