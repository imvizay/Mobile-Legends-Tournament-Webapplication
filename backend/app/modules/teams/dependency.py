from .services import TeamService,TeamTournamentService
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.db.session import get_db
from .repository import TeamRepository,TeamTournamentRepository

# Team Service
def get_team_repository(db:Session=Depends(get_db)):
    return TeamRepository(db)

def get_team_service(db: Session = Depends(get_db),repository:TeamRepository=Depends(get_team_repository)):
    
    return TeamService(db,repository)

# Team Tournament Service
def get_teamtournament_repository(db: Session=Depends(get_db)):
    return TeamTournamentRepository(db)

def get_teamtournament_service(repository: Session=Depends(get_teamtournament_repository)):
    return TeamTournamentService(repository)