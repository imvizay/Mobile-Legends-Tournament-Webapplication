from fastapi import Depends, Form
from datetime import date, time

from sqlalchemy.orm import Session

from .schema import TournamentForm
from .service import TournamentService
from .repository import TournamentRepository
from app.core.db.session import get_db


def get_tournament_repository(db: Session = Depends(get_db)):
    return TournamentRepository(db)


def get_tournament_service(
    repository: TournamentRepository = Depends(get_tournament_repository),
):
    return TournamentService(repository)


# Get Tournament Form
def get_tournament_form(
    tournament_name: str = Form(...),
    game_name: str = Form("Mobile Legends: Bang Bang"),
    tournament_type: str = Form(...),
    team_format: str = Form(...),
    min_teams: int = Form(...),
    max_teams: int = Form(...),
    description: str | None = Form(None),
    platform_fee: str | None = Form(None),
    winner_share: str | None = Form(None),
    runner_up_share: str | None = Form(None),
    reg_open_date: date = Form(...),
    reg_open_time: time = Form(...),
    reg_close_date: date = Form(...),
    reg_close_time: time = Form(...),
    tournament_start_date: date = Form(...),
    tournament_start_time: time = Form(...),
    tournament_end_date: date = Form(...),
    tournament_end_time: time = Form(...),
    check_in: str | None = Form(None),
    grace_period: str | None = Form(None),
    bracket_format: str | None = Form(None),
    category: str | None = Form(None),
    competition_type: str | None = Form(None),
    seeding_method: str | None = Form(None),
    entry_fee: int = Form(...),
    entry_type: str = Form(...),
    minimum_account_level: int | None = Form(None),
    minimum_rank: str | None = Form(None),
    registration_access: str | None = Form(None),
    registration_approval: str | None = Form(None),
    server: str = Form(...),
):
    return TournamentForm(
        tournament_name=tournament_name,
        game_name=game_name,
        tournament_type=tournament_type,
        team_format=team_format,
        min_teams=min_teams,
        max_teams=max_teams,
        description=description,
        platform_fee=platform_fee,
        winner_share=winner_share,
        runner_up_share=runner_up_share,
        reg_open_date=reg_open_date,
        reg_open_time=reg_open_time,
        reg_close_date=reg_close_date,
        reg_close_time=reg_close_time,
        tournament_start_date=tournament_start_date,
        tournament_start_time=tournament_start_time,
        tournament_end_date=tournament_end_date,
        tournament_end_time=tournament_end_time,
        check_in=check_in,
        grace_period=grace_period,
        bracket_format=bracket_format,
        category=category,
        competition_type=competition_type,
        seeding_method=seeding_method,
        entry_fee=entry_fee,
        entry_type=entry_type,
        minimum_account_level=minimum_account_level,
        minimum_rank=minimum_rank,
        registration_access=registration_access,
        registration_approval=registration_approval,
        server=server,
    )
