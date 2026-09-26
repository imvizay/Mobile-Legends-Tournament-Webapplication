from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.logging.config import configure_logging, get_logger
from app.core.middleware.middleware import register_middlewares

# Routers
from app.modules.auth.router import router as auth_router
from app.modules.teams.router import router as team_router
from app.modules.tournaments.router import router as tournament_router
from app.modules.users.router import router as users_router, player_router
from app.modules.payments.router import router as payments_router
from app.modules.registrations.router import router as registration_router

# Exception handlers
from app.core.exceptions.exceptions import (
    InvalidTokenException,
    PendingRegistrationExistsError,
    TokenExpiredException,
    UserAlreadyExistsError,
    UserBannedException,
    UserNotFoundException,
)
from app.core.exceptions.handlers import (
    invalid_credentials,
    invalid_token,
    player_already_in_team,
    player_no_team,
    team_exists,
    user_banned,
    user_not_found,
    user_pending_registration_exists,
    user_already_exists,
)
from app.modules.teams.exceptions import (
    MaximumJoinRequestException,
    NoTeamError,
    PendingApplicationException,
    PlayerAlreadyHasTeamError,
    TeamAlreadyExistsError,
    TeamFullException,
    TeamNotFound,
    UserInTeam,
    UserIsBlockedOrInactive,
)
from app.modules.teams.handlers import (
    maximum_join_request_exceed,
    team_full,
    team_not_found,
    team_pending_application,
    user_in_team,
    user_is_blocked_or_inactive,
)



configure_logging()

app = FastAPI()
system_logger = get_logger("system")


# Root endpoint
@app.get("/")
async def read_root():
    return {"message": "Backend is running"}


# Register middleware
register_middlewares(app)


# Register routes
app_routes = (
    auth_router,
    team_router,
    tournament_router,
    users_router,
    player_router,
    payments_router,
    registration_router
)

for router in app_routes:
    app.include_router(router, prefix="/api")


# Application-specific exception handlers
EXCEPTION_HANDLERS = {
    UserAlreadyExistsError: user_already_exists,
    PendingRegistrationExistsError: user_pending_registration_exists,
    UserNotFoundException: user_not_found,
    UserBannedException: user_banned,
    InvalidTokenException: invalid_credentials,
    TokenExpiredException: invalid_token,
    # Team exceptions
    PlayerAlreadyHasTeamError: player_already_in_team,
    TeamAlreadyExistsError: team_exists,
    NoTeamError: player_no_team,
    UserIsBlockedOrInactive: user_is_blocked_or_inactive,
    UserInTeam: user_in_team,
    TeamFullException: team_full,
    TeamNotFound: team_not_found,
    PendingApplicationException: team_pending_application,
    MaximumJoinRequestException: maximum_join_request_exceed,
}

for exception_class, handler in EXCEPTION_HANDLERS.items():
    app.add_exception_handler(exception_class, handler)




@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    system_logger.exception(
        "Unhandled application exception",
        extra={
            "event": "unhandled_exception",
            "component": "system",  # Do not use "module"
            "http_method": request.method,
            "request_path": request.url.path,
        },
    )

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "code": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected error occurred.",
            "data": None,
        },
    )
