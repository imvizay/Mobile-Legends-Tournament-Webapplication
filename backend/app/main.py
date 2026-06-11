from fastapi import FastAPI
from fastapi.responses import JSONResponse
from app.core.middleware.middleware import register_middlewares
from app.modules.auth.router import router as auth_router

# Exceptions
from app.core.exceptions.exceptions import *
from app.core.exceptions.handlers import * 

app = FastAPI()


@app.get('/')
async def read_root():
    return {'message'  : 'Backend is running'}

register_middlewares(app)


app.include_router(auth_router,prefix='/api')

# App Exception
EXCEPTION_DICT = {
    UserAlreadyExistsError:user_already_exists,
    PendingRegistrationExistsError:user_pending_registration_exists,
    UserNotFoundException:user_not_found,
    UserBannedException:user_banned,
    InvalidCredentialsException:invalid_credentials,
    InvalidTokenException:invalid_token
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