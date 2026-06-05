from fastapi import FastAPI
from fastapi.responses import JSONResponse
from app.core.middleware.middleware import register_middlewares
from app.modules.auth.router import router as auth_router
app = FastAPI()

@app.get('/')
async def read_root():
    return {'message'  : 'Backend is running'}

register_middlewares(app)


app.include_router(auth_router,prefix='/api')


@app.exception_handler(Exception)
async def global_exception_handler(request,e):
    print(f"ERROR :",e)
    
    return JSONResponse({
        "status":500,
        'message':"Internal Server Error"
    })