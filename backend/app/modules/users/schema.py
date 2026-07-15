from pydantic import BaseModel,ConfigDict
from datetime import datetime

class UsersList(BaseModel):
    id: int

    email: str
    provider: str

    verified: bool
    is_membership_active: bool
    is_banned: bool
    role: str
    created_at: datetime
    
    mlbb_id : str | None = None
    mlbb_server : str | None = None
    
    model_config = ConfigDict(from_attributes=True)


class AdminUsersResponse(BaseModel):
    success: bool
    message: str
    data: list[UsersList] 



# Players Dashboard

from datetime import date, time

class DashboardTournamentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    tournament_name: str
    game_name: str
    background_image_url : str | None= None
    banner_image_url: str | None = None
    tournament_start_date: date
    tournament_start_time: time
    entry_fee: float
    max_teams: int
    server:str 
    registration_status: str


class PlayerDashboardData(BaseModel):
    featured_tournaments: list[DashboardTournamentResponse]
    upcoming_tournaments: list[DashboardTournamentResponse]


class PlayerDashboardResponse(BaseModel):
    status: str
    data: PlayerDashboardData