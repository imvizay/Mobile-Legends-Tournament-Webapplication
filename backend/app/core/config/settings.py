from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv
load_dotenv()

class Settings(BaseSettings):

    APP_NAME : str = "MLBB Esports Tournamnet WebApp"
    APP_VERSION : str =  '1.0'\
    
    # CONFIGURE DATABASE
    DATABASE_URL : str = os.getenv("DATABASE_URL")
    SECRET_KEY:str = os.getenv("SECRET_KEY")

    # Secrets and Keys
    GOOGLE_CLIENT_ID : str = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET : str = os.getenv("GOOGLE_CLIENT_SECRET")

    DISCORD_CLIENT_ID : str = os.getenv('DISCORD_CLIENT_ID')
    DISCORD_CLIENT_SECRET : str  = os.getenv("DISCORD_CLIENT_SECRET")

    BACKEND_URL: str = os.getenv("BACKEND_URL")



settings = Settings()
