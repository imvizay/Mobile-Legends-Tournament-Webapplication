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



settings = Settings()
