from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from ..config.settings import settings

async def security_headers(request, call_next):
   response = await call_next(request)
   response.headers["X-Frame-Options"] = "DENY"
   response.headers["X-Content-Type-Options"] = "nosniff"
   response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
   
   return response


def register_middlewares(app):

    app.add_middleware(
        CORSMiddleware,
        allow_origins = [
            "http://localhost:5173"
        ],
        allow_credentials = True,
        allow_methods = ['*'],
        allow_headers = ['*']
    )

    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts = [
            '127.0.0.1'
        ]
    )

    app.add_middleware(
        SessionMiddleware,
        secret_key=settings.SECRET_KEY
    )

    app.middleware('http')(security_headers)
