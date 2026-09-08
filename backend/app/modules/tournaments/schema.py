from datetime import date, time, datetime
from fastapi import Form
from decimal import Decimal
from datetime import date, time
from pydantic import BaseModel, model_validator, ConfigDict


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

    registration_opens_at: datetime

    registration_closes_at: datetime

    starts_at: datetime
    ends_at: datetime

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

        reg_open = self.registration_opens_at
        reg_close = self.registration_closes_at

        tournament_start = self.starts_at
        tournament_end = self.ends_at

        if reg_close <= reg_open:
            raise ValueError("Registration close must be after registration open")

        if tournament_start <= reg_close:
            raise ValueError("Tournament must start after registration closes")

        if tournament_end <= tournament_start:
            raise ValueError("Tournament end must be after tournament start")

        return self


# Admin List tournament
class TournamentListResponse(BaseModel):

    id: int
    tournament_name: str
    game_name: str
    tournament_type: str
    team_format: str
    min_teams: int
    max_teams: int

    # images
    background_image_url: str | None = None
    banner_image_url: str | None = None

    description: str | None = None

    platform_fee: Decimal | None = None
    winner_share: Decimal | None = None
    runner_up_share: Decimal | None = None

    registration_opens_at: datetime
    registration_closes_at: datetime
    starts_at: datetime
    ends_at: datetime

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
    # status
    registration_status: str
    status: str
    visibility_status: str

    model_config = ConfigDict(from_attributes=True)


class AdminTournamentRes(BaseModel):
    tournament: list[TournamentListResponse]


class TournamentDetailResponse(BaseModel):
    success: str
    data: TournamentListResponse
