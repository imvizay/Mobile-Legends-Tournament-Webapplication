from typing import Annotated
import re

from fastapi import Form
from pydantic import BaseModel, ConfigDict, Field, field_validator

from .models import TeamVisibility


class TeamCreateSchema(BaseModel):

    model_config = ConfigDict(str_strip_whitespace=True)

    team_name: str = Field(min_length=3,max_length=60)

    team_tag: str = Field(min_length=2,max_length=10)

    team_bio: str | None = Field(default=None,max_length=500)

    team_country: str = Field(min_length=2,max_length=50)

    team_region: str = Field(min_length=2,max_length=50)

    team_city: str | None = Field(default=None,max_length=60)

    team_visibility: TeamVisibility

    @field_validator("tag")
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
        name: Annotated[str, Form(...)],
        tag: Annotated[str, Form(...)],
        description: Annotated[str | None, Form()] = None,
        country: Annotated[str, Form(...)] = "India",
        region: Annotated[str, Form(...)] = "",
        city: Annotated[str | None, Form()] = None,
        visibility: Annotated[TeamVisibility, Form(...)] = TeamVisibility.PUBLIC,
    ) -> "TeamCreateSchema":
        
        return cls(
            name=name,
            tag=tag,
            description=description,
            country=country,
            region=region,
            city=city,
            visibility=visibility,
        )