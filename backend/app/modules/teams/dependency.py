from .services import TeamService
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.db.session import get_db
from .repository import TeamRepository

def get_team_repository(db:Session=Depends(get_db)):
    return TeamRepository(db)

def get_team_service(db: Session = Depends(get_db),repository:TeamRepository=Depends(get_team_repository)):
    
    return TeamService(db,repository)