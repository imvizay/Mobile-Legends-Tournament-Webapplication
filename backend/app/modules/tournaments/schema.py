from datetime import date, time,datetime
from typing import Optional

from fastapi import Form


from datetime import date, time

from pydantic import BaseModel,model_validator


class TournamentForm(BaseModel):
    tournament_name: str
    game_name: str
    tournament_type: str
    team_format: str 
    min_teams: int
    max_teams: int

    description: str | None = None

    platform_fee: str | None = None
    winner_share: str | None = None
    runner_up_share: str | None = None

    reg_open_date: date
    reg_open_time: time
    reg_close_date: date
    reg_close_time: time

    tournament_start_date: date
    tournament_start_time: time
    tournament_end_date: date
    tournament_end_time: time

    check_in: str | None = None
    grace_period: str | None = None

    bracket_format: str | None = None
    category: str | None = None
    competition_type: str | None = None
    seeding_method: str | None = None

    entry_fee: int
    entry_type: str

    minimum_account_level: int | None = None
    minimum_rank: str | None = None

    registration_access: str | None = None
    registration_approval: str | None = None

    server: str

    @classmethod
    @model_validator(mode="after")
    def validate_schedule(self):
        
        reg_open = datetime.combine(self.reg_open_date,self.reg_open_time)
        reg_close = datetime.combine(self.reg_close_date,self.reg_close_time)
        
        tournament_start = datetime.combine(self.tournament_start_date,self.tournament_start_time)
        tournament_end = datetime.combine(self.tournament_end_date,self.tournament_end_time)
        
        if reg_close <= reg_open:
            raise ValueError("Registration close must be after registration open")
        
        if tournament_start <= reg_close:
            raise ValueError("Tournament must start after registration closes")
        
        if tournament_end <= tournament_start:
            raise ValueError("Tournament end must be after tournament start")
        
        return self
        
        
        
    
