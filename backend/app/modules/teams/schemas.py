from typing import Annotated
import re

from fastapi import Form
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field, field_validator

from .models import TeamVisibility


class TeamCreateSchema(BaseModel):

    model_config = ConfigDict(str_strip_whitespace=True)

    team_name: str = Field(min_length=3,max_length=60)

    team_tag: str = Field(min_length=2,max_length=10)

    team_bio: str | None = Field(default=None,max_length=500)

    team_country: str = Field(min_length=2,max_length=50)

    team_region: str | None = Field(min_length=2,max_length=50)

    team_city: str | None = Field(default=None,max_length=60)

    team_visibility: TeamVisibility

    @field_validator("team_tag")
    @classmethod
    def normalize_tag(cls, value: str):

        return value.upper()
    
    @field_validator("team_name")
    @classmethod
    def validate_team_name(cls, value: str) -> str:

        if not re.fullmatch(r"[A-Za-z0-9 _-]+", value):
            raise ValueError("Team name may only contain letters, numbers, spaces, '_' and '-'.")

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
    team_id : int
    

class TeamMemberResponse(BaseModel):
    player_role:str
    player_id:int
    player_name:str


class TeamResponse(BaseModel):

    team_id:int
    team_name:str
    team_bio:str
    team_tag:str
    team_logo_url:str | None
    team_banner_url:str | None

    team_country:str
    team_visibility:str
    
    team_wallet:TeamWalletResponse

    team_members : list [TeamMemberResponse]
   
    
class CreatedTeamResponse(BaseModel):
    message:str
    team:TeamResponse