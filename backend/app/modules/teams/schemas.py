from typing import Annotated, Optional
import re
from datetime import datetime
from fastapi import Form
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field, field_validator

from .models import TeamVisibility


class TeamCreateSchema(BaseModel):

    model_config = ConfigDict(str_strip_whitespace=True)

    team_name: str = Field(min_length=3, max_length=60)

    team_tag: str = Field(min_length=2, max_length=10)

    team_bio: str | None = Field(default=None, max_length=500)

    team_country: str = Field(min_length=2, max_length=50)

    team_region: str | None = Field(min_length=2, max_length=50)

    team_city: str | None = Field(default=None, max_length=60)

    team_visibility: TeamVisibility

    @field_validator("team_tag")
    @classmethod
    def normalize_tag(cls, value: str):

        return value.upper()

    @field_validator("team_name")
    @classmethod
    def validate_team_name(cls, value: str) -> str:

        if not re.fullmatch(r"[A-Za-z0-9 _-]+", value):
            raise ValueError(
                "Team name may only contain letters, numbers, spaces, '_' and '-'."
            )

        if not re.search(r"[A-Za-z]", value):
            raise ValueError("Team name cannot contain only numbers.")

        return value

    @classmethod
    def as_form(
        cls,
        team_name: Annotated[str, Form(...)],
        team_tag: Annotated[str, Form(...)],
        team_description: Annotated[str | None, Form()] = None,
        team_country: Annotated[str, Form(...)] = "India",
        team_region: Annotated[str, Form(...)] = "",
        team_city: Annotated[str | None, Form()] = None,
        team_visibility: Annotated[TeamVisibility, Form(...)] = TeamVisibility.PUBLIC,
    ) -> "TeamCreateSchema":

        return cls(
            team_name=team_name,
            team_tag=team_tag,
            team_bio=team_description,
            team_country=team_country,
            team_region=team_region,
            team_city=team_city,
            team_visibility=team_visibility,
        )


# Return Team Created Response
class TeamWalletResponse(BaseModel):
    wallet_balance: Decimal
    status: str


class TeamMemberResponse(BaseModel):
    player_role: str
    player_name: str
    player_email: str
    
    


class TeamResponse(BaseModel):
    id:int
    team_name: str
    team_bio: str
    team_tag: str
    team_logo_url: str | None
    team_banner_url: str | None
    team_max_members: int
    team_created_at: datetime

    team_country: str
    team_visibility: str

    team_wallet: TeamWalletResponse
    team_members: list[TeamMemberResponse]


class TeamResponseOutput(BaseModel):
    team: Optional[TeamResponse] = None


class DiscoverTeamResponse(BaseModel):
    id: int
    name: str
    tag: str | None
    description: str | None
    visibility: str
    logo_url: str | None
    banner_url: str | None
    country: str | None
    created_at: datetime
    max_members: int
    members_count: int


class DiscoverTeamOutput(BaseModel):
    my_team_id: int | None
    has_next: bool
    next_cursor: int | None
    items: list[DiscoverTeamResponse]


class JoinTeamResponse(BaseModel):
    success: bool
    status: int
    message: str


# Team Summary
class CaptainSummary(BaseModel):
    id: int
    captain_name: str
    role: str


class TeamSummary(BaseModel):
    id: int
    name: str
    tag: str
    country: str
    captain: CaptainSummary
    members_count: int = 0


class TeamSummaryResponse(BaseModel):
    has_team: bool
    team: TeamSummary | None = None

 
# REGISTERED TOURNAMENT DASHBOARD RESPONSE
class TeamRegisteredTournament(BaseModel):
    model_config=ConfigDict(from_attributes=True)
    tournament_id: int
    tournament_name: str

    server: str

    prize_pool: Decimal | None = None
    entry_fee: Decimal
    max_teams: int

    registration_open_date:datetime
    registration_end_date: datetime
    tournament_start_date: datetime
    tournament_end_date: datetime

    status: str
    applied_at: datetime
    
class TeamMembers(BaseModel):
    model_config=ConfigDict(from_attributes=True)
    
    id:int
    email:str 
    mlbb_id:str | None = None
    mlbb_server:str | None = None
    
    role:str
    status:str
    

class TeamDashboardData(BaseModel):
    current_tournament: TeamRegisteredTournament | None = None
    upcoming_tournament: list[TeamRegisteredTournament] | None = None
    team_members: list[TeamMembers] 


class TeamDashboardResponse(BaseModel):
    success: bool
    data: TeamDashboardData | None = None
