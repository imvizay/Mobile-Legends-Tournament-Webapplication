from datetime import date, time, datetime,timezone

from decimal import Decimal

from sqlalchemy import (
    Column,
    Date,
    DateTime,
    Integer,
    String,
    Text,
    Time,
    ForeignKey,
    Numeric
)
from sqlalchemy.orm import relationship
from sqlalchemy.orm import Mapped,mapped_column

from app.core.db.base import Base


class Tournament(Base):
    
    __tablename__ = "tournaments"

    id = Column(Integer, primary_key=True, index=True)

    # Basic Information
    tournament_name = Column(String(150), nullable=False,unique=True)
    game_name = Column(String(100), nullable=False)
    tournament_type = Column(String(50), nullable=False)
    team_format = Column(String(50), nullable=False)

    min_teams = Column(Integer, nullable=False,default=2)
    max_teams = Column(Integer, nullable=False)

    description = Column(Text, nullable=True)

    # Prize / Platform
    platform_fee = Column(String(50), nullable=True)
    winner_share = Column(String(50), nullable=True)
    runner_up_share = Column(String(50), nullable=True)

    # Registration Schedule
    reg_open_date = Column(Date, nullable=False)
    reg_open_time = Column(Time, nullable=False)

    reg_close_date = Column(Date, nullable=False)
    reg_close_time = Column(Time, nullable=False)

    # Tournament Schedule
    tournament_start_date = Column(Date, nullable=False)
    tournament_start_time = Column(Time, nullable=False)

    tournament_end_date = Column(Date, nullable=False)
    tournament_end_time = Column(Time, nullable=False)

    check_in = Column(String, nullable=True)
    grace_period = Column(String, nullable=True)

    # Tournament Settings
    bracket_format = Column(String(50), nullable=True)
    category = Column(String(50), nullable=True)
    competition_type = Column(String(50), nullable=True)
    seeding_method = Column(String(50), nullable=True)

    # Entry
    entry_fee : Mapped[Decimal] = mapped_column(Numeric(5,2),nullable=False,default=Decimal("0.00"))
    entry_type = Column(String(50), nullable=False)

    # Player Requirements
    minimum_account_level = Column(Integer, nullable=True)
    minimum_rank = Column(String(50), nullable=True)

    # Registration Settings
    registration_access = Column(String(50), nullable=True)
    registration_approval = Column(String(50), nullable=True)

    # Server
    server = Column(String(50), nullable=False)

    # Cloudinary - Background Image
    background_image_url = Column(Text, nullable=True)
    background_image_public_id = Column(String(255), nullable=True)

    # Cloudinary - Banner Image
    banner_image_url = Column(Text, nullable=True)
    banner_image_public_id = Column(String(255), nullable=True)
    
    # Tournament Lifecycle
    status = Column(String(30),default="scheduled",nullable=True,)

    # Registration Lifecycle
    registration_status = Column(String(30),nullable=True,default="upcoming",)

    # Visibility
    visibility_status = Column(String(20),nullable=True,default="unpublished",)

    # Admin who created the tournament
    created_by = Column(Integer,ForeignKey("players.id"),nullable=False,)

    # Metadata
    created_at = Column(DateTime,default=lambda:datetime.now(timezone.utc),nullable=False,)

    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda:datetime.now(timezone.utc),
        nullable=False,
    )