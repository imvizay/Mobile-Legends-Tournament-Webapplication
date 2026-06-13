from authlib.integrations.starlette_client import OAuth
from app.core.config.settings import settings

oauth = OAuth()

oauth.register(

    name='google',

    client_id=settings.GOOGLE_CLIENT_ID,

    client_secret=settings.GOOGLE_CLIENT_SECRET,

    server_metadata_url = "https://accounts.google.com/.well-known/openid-configuration",

    client_kwargs={
        "scope": "openid email profile"
    }
)


oauth.register(
    name="discord",
    client_id=settings.DISCORD_CLIENT_ID,
    client_secret=settings.DISCORD_CLIENT_SECRET,
    authorize_url="https://discord.com/api/oauth2/authorize",
    access_token_url="https://discord.com/api/oauth2/token",
    api_base_url="https://discord.com/api/",
    client_kwargs={
        "scope": "identify email"
    }
)

