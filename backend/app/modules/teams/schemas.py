from typing import Annotated

from fastapi import Form
from pydantic import BaseModel, ConfigDict, Field, field_validator

from .models import TeamVisibility


class TeamCreateSchema(BaseModel):

    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=3,max_length=60)

    tag: str = Field(min_length=2,max_length=10)

    description: str | None = Field(default=None,max_length=500)

    country: str = Field(min_length=2,max_length=50)

    region: str = Field(min_length=2,max_length=50)

    city: str | None = Field(default=None,max_length=60)

    visibility: TeamVisibility

    @field_validator("tag")
    @classmethod
    def normalize_tag(cls, value: str):

        return value.upper()

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