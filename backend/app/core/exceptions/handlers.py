from fastapi import requests
from fastapi.responses import JSONResponse
from app.core.exceptions.exceptions import UserAlreadyExistsError,PendingRegistrationExistsError

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
            "message":str(exception.message),
            "status":exception.status,
            "email_sent_at":exception.email_sent_at
        }
    )