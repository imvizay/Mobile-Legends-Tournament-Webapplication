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

    # Mail
    RESEND_API_KEY:str = os.getenv("RESEND_API_KEY")

    FRONTEND_URL:str = os.getenv("FRONTEND_URL")
    BACKEND_URL: str = os.getenv("BACKEND_URL")

    # Cloudinary Config
    CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME")
    CLOUDINARY_API_KEY:str = os.getenv("CLOUDINARY_API_KEY")
    CLOUDINARY_API_SECRET:str = os.getenv("CLOUDINARY_API_SECRET")



settings = Settings()
