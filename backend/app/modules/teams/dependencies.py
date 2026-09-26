from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.db.session import get_db

from .repository import TeamRepository
from .service import TeamService
from .tournament_repository import TeamTournamentRepository
from .tournament_service import TeamTournamentService


def get_team_repository(db: Session = Depends(get_db)) -> TeamRepository:
    return TeamRepository(db)


def get_team_service(
    repository: TeamRepository = Depends(get_team_repository),
) -> TeamService:
    return TeamService(repository=repository)


def get_team_tournament_repository(
    db: Session = Depends(get_db),
) -> TeamTournamentRepository:
    return TeamTournamentRepository(db)


def get_team_tournament_service(
    repository: TeamTournamentRepository = Depends(
        get_team_tournament_repository
    ),
) -> TeamTournamentService:
    return TeamTournamentService(repository=repository)
