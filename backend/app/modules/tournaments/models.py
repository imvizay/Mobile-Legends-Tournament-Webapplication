from datetime import datetime, timezone
from decimal import Decimal
from enum import Enum

from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric, String, Text, Index, CheckConstraint
from sqlalchemy.orm import relationship

from app.core.db.base import Base


class TournamentStatus(str, Enum):
    SCHEDULED = "scheduled"
    LIVE = "live"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    POSTPONED = "postponed"


class RegistrationStatus(str, Enum):
    UPCOMING = "upcoming"
    OPEN = "open"
    CLOSED = "closed"


class VisibilityStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class EntryType(str, Enum):
    FREE = "free"
    PAID = "paid"


class Tournament(Base):
    __tablename__ = "tournaments"

    id = Column(Integer, primary_key=True, index=True)
    tournament_name = Column(String(150), nullable=False, unique=True)
    game_name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)

    tournament_type = Column(String(50), nullable=False)
    team_format = Column(String(50), nullable=False)
    bracket_format = Column(String(50), nullable=True)
    competition_type = Column(String(50), nullable=True)
    seeding_method = Column(String(50), nullable=True)

    min_teams = Column(Integer, nullable=False, default=2)
    max_teams = Column(Integer, nullable=False)

    registration_opens_at = Column(DateTime(timezone=True), nullable=False)
    registration_closes_at = Column(DateTime(timezone=True), nullable=False)
    starts_at = Column(DateTime(timezone=True), nullable=False)
    ends_at = Column(DateTime(timezone=True), nullable=False)

    check_in = Column(String(50), nullable=True)
    grace_period = Column(String(50), nullable=True)

    entry_type = Column(String(30), nullable=False, default=EntryType.FREE.value)
    entry_fee = Column(Numeric(10, 2), nullable=False, default=Decimal("0.00"))
    prize_pool = Column(Numeric(12, 2), nullable=True)
    platform_fee = Column(Numeric(12, 2), nullable=True)
    winner_share = Column(Numeric(12, 2), nullable=True)
    runner_up_share = Column(Numeric(12, 2), nullable=True)

    minimum_account_level = Column(Integer, nullable=True)
    minimum_rank = Column(String(50), nullable=True)

    registration_access = Column(String(50), nullable=True)
    registration_approval = Column(String(50), nullable=True)
    server = Column(String(50), nullable=False)

    background_image_url = Column(Text, nullable=True)
    background_image_public_id = Column(String(255), nullable=True)
    banner_image_url = Column(Text, nullable=True)
    banner_image_public_id = Column(String(255), nullable=True)

    status = Column(String(30), nullable=False, default=TournamentStatus.SCHEDULED.value)
    registration_status = Column(String(30), nullable=False, default=RegistrationStatus.UPCOMING.value)
    visibility_status = Column(String(30), nullable=False, default=VisibilityStatus.DRAFT.value)

    created_by = Column(Integer, ForeignKey("players.id", ondelete="RESTRICT"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    creator = relationship("Player", foreign_keys=[created_by])
    team_registrations = relationship("TeamTournamentRegistration", back_populates="tournament", cascade="all, delete-orphan")

    __table_args__ = (
        CheckConstraint("min_teams >= 2", name="ck_tournament_min_teams"),
        CheckConstraint("max_teams >= min_teams", name="ck_tournament_max_teams"),
        CheckConstraint("entry_fee >= 0", name="ck_tournament_entry_fee"),
        CheckConstraint("prize_pool IS NULL OR prize_pool >= 0", name="ck_tournament_prize_pool"),
        CheckConstraint("platform_fee IS NULL OR platform_fee >= 0", name="ck_tournament_platform_fee"),
        CheckConstraint("winner_share IS NULL OR winner_share >= 0", name="ck_tournament_winner_share"),
        CheckConstraint("runner_up_share IS NULL OR runner_up_share >= 0", name="ck_tournament_runner_up_share"),
        Index("ix_tournaments_status", "status"),
        Index("ix_tournaments_registration_status", "registration_status"),
        Index("ix_tournaments_visibility_status", "visibility_status"),
        Index("ix_tournaments_starts_at", "starts_at"),
        Index("ix_tournaments_registration_window", "registration_opens_at", "registration_closes_at"),
        Index("ix_tournaments_game_status", "game_name", "status"),
    )