from fastapi import Request
from fastapi.responses import JSONResponse
from .exceptions import(
    UserIsBlockedOrInactive,
    UserInTeam,
    TeamFullException,
    TeamNotFound,
    PendingApplicationException,
    MaximumJoinRequestException
)

def user_is_blocked_or_inactive(request:Request,exception:UserIsBlockedOrInactive):

    return JSONResponse(
        status_code=403,
        context={
            "success":False,
            "message":"User is either inactive or blocked."
        }
    )

def user_in_team(request: Request,exception:UserInTeam):

    return JSONResponse(
        status_code=409,
        content={
            "success":False,
            "message":"You are already in a team."
        }
    )

def team_full(request: Request,exception:TeamFullException):
    return JSONResponse(
        status_code=404,
        content={
            "success":False,
            "message":"Cannot Join,Team Full."
        }
    )

def team_not_found(request: Request,exception:TeamNotFound):
    return JSONResponse(
        status_code=404,
        content={
            "success":False,
            "message":"No team found."
        }
    )

def team_pending_application(request: Request,exception:PendingApplicationException):
    return JSONResponse(
        status_code=409,
        content={
            "success":False,
            "message":"Team join request already exists."
        }
    )

def maximum_join_request_exceed(request: Request,exception:MaximumJoinRequestException):
    return JSONResponse(
        status_code=409,
        content={
            "success":False,
            "message":"Maximum Join Request Reached."
        }
    )