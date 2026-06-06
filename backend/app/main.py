from fastapi import FastAPI
from fastapi.responses import JSONResponse
from app.core.middleware.middleware import register_middlewares
from app.modules.auth.router import router as auth_router

# Exceptions
from app.core.exceptions.exceptions import UserAlreadyExistsError,PendingRegistrationExistsError
from app.core.exceptions.handlers import user_already_exists,user_pending_registration_exists

app = FastAPI()


@app.get('/')
async def read_root():
    return {'message'  : 'Backend is running'}

register_middlewares(app)


app.include_router(auth_router,prefix='/api')

# App Exception
app.add_exception_handler(UserAlreadyExistsError,user_already_exists)
app.add_exception_handler(PendingRegistrationExistsError,user_pending_registration_exists)



# Global Exception
@app.exception_handler(Exception)
async def global_exception_handler(request,e):
    print(f"ERROR :",e)
    
    return JSONResponse({
        "status":500,
        'message':"Internal Server Error"
    })