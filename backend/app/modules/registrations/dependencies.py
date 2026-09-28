from fastapi import Depends
from sqlalchemy.orm import Session
from .service import TournamentRegistrationService
from .repository import TournamentRegistrationRepository
from app.core.db.session import get_db


def get_tournament_registration_repository(db: Session = Depends(get_db)):
    return TournamentRegistrationRepository(db=db)


def get_tournament_registration_service(
    repository: TournamentRegistrationRepository = Depends(
        get_tournament_registration_repository
    ),
):
    return TournamentRegistrationService(repository=repository)
