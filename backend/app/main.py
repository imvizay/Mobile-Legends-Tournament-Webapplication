from fastapi import FastAPI
from fastapi.responses import JSONResponse
from app.core.middleware.middleware import register_middlewares
from app.modules.auth.router import router as auth_router
from app.modules.teams.router import router as team_router
from app.modules.tournaments.router import router as tournament_router

# Exceptions
from app.modules.teams.exceptions import *
from app.modules.teams.handlers import * 

from app.core.exceptions.exceptions import *
from app.core.exceptions.handlers import * 

app = FastAPI()


@app.get('/')
async def read_root():
    return {'message'  : 'Backend is running'}

register_middlewares(app)


app.include_router(auth_router,prefix='/api')
app.include_router(team_router,prefix='/api')
app.include_router(tournament_router,prefix="/api")


# App Exception
EXCEPTION_DICT = {
    UserAlreadyExistsError:user_already_exists,
    PendingRegistrationExistsError:user_pending_registration_exists,
    UserNotFoundException:user_not_found,
    UserBannedException:user_banned,
    InvalidTokenException:invalid_credentials,
    TokenExpiredException:invalid_token,

    # TEAM EXCEPTION
    ExceptionPlayerAlreadyHasTeam:player_already_in_team,
    ExceptionTeamAlreadyExits:team_exists,
    NoTeamException:player_no_team,
    UserIsBlockedOrInactive:user_is_blocked_or_inactive,
    UserInTeam:user_in_team,
    TeamFullException:team_full,
    TeamNotFound:team_not_found,
    PendingApplicationException:team_pending_application,
    MaximumJoinRequestException:maximum_join_request_exceed
}   

for exception,handler in EXCEPTION_DICT.items():
    app.add_exception_handler(exception,handler) 



# Global Exception
@app.exception_handler(Exception)
async def global_exception_handler(request,e):
    print(f"ERROR :",e)
    
    return JSONResponse({
        "status":500,
        'message':"Internal Server Error"
    })