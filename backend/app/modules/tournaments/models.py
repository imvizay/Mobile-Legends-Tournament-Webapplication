from datetime import datetime, timezone
from decimal import Decimal
from enum import Enum

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    Index,
    CheckConstraint,
    UniqueConstraint,
)
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


class BracketStatus(str, Enum):
    NOT_READY = "not_ready"
    READY = "ready"
    GENERATED = "generated"


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
    bracket_status = Column(
        String(30), nullable=True, default=BracketStatus.NOT_READY.value
    )
    entry_type = Column(String(30), nullable=False, default=EntryType.FREE.value)

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

    status = Column(
        String(30), nullable=False, default=TournamentStatus.SCHEDULED.value
    )

    registration_status = Column(
        String(30), nullable=False, default=RegistrationStatus.UPCOMING.value
    )
    visibility_status = Column(
        String(30), nullable=False, default=VisibilityStatus.DRAFT.value
    )

    # Registration extended
    registration_extended_at = Column(DateTime(timezone=True), nullable=True)

    registration_extension_reason = Column(Text, nullable=True)

    # Postponement
    postponed_at = Column(DateTime(timezone=True), nullable=True)
    postponement_reason = Column(Text, nullable=True)

    # Cancellation
    cancelled_at = Column(DateTime(timezone=True), nullable=True)
    cancellation_reason = Column(Text, nullable=True)

    created_by = Column(
        Integer,
        ForeignKey("players.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    rounds = relationship(
        "TournamentRound",
        back_populates="tournament",
        cascade="all, delete-orphan",
    )
    creator = relationship("Player", foreign_keys=[created_by])
    team_registrations = relationship(
        "TeamTournamentRegistration",
        back_populates="tournament",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        CheckConstraint("min_teams >= 2", name="ck_tournament_min_teams"),
        CheckConstraint("max_teams >= min_teams", name="ck_tournament_max_teams"),
        CheckConstraint("entry_fee >= 0", name="ck_tournament_entry_fee"),
        CheckConstraint(
            "prize_pool IS NULL OR prize_pool >= 0", name="ck_tournament_prize_pool"
        ),
        CheckConstraint(
            "platform_fee IS NULL OR platform_fee >= 0",
            name="ck_tournament_platform_fee",
        ),
        CheckConstraint(
            "winner_share IS NULL OR winner_share >= 0",
            name="ck_tournament_winner_share",
        ),
        CheckConstraint(
            "runner_up_share IS NULL OR runner_up_share >= 0",
            name="ck_tournament_runner_up_share",
        ),
        Index("ix_tournaments_status", "status"),
        Index("ix_tournaments_registration_status", "registration_status"),
        Index("ix_tournaments_visibility_status", "visibility_status"),
        Index("ix_tournaments_starts_at", "starts_at"),
        Index(
            "ix_tournaments_registration_window",
            "registration_opens_at",
            "registration_closes_at",
        ),
        Index("ix_tournaments_game_status", "game_name", "status"),
    )


# ROUNDS
class TournamentRoundStatus(str, Enum):
    DRAFT = "draft"
    READY = "ready"
    LIVE = "live"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class TournamentRoundType(str, Enum):
    ROUND_1 = "round_1"
    ROUND_2 = "round_2"
    QUARTER_FINAL = "quarter_final"
    SEMI_FINAL = "semi_final"
    FINAL = "final"


class TournamentRound(Base):
    __tablename__ = "tournament_round"

    id = Column(Integer, primary_key=True)
    tournament_id = Column(
        Integer,
        ForeignKey("tournaments.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    round_number = Column(Integer, nullable=False)
    round_type = Column(String(30), nullable=False)
    status = Column(
        String(30), nullable=False, default=TournamentRoundStatus.DRAFT.value
    )
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    tournament = relationship("Tournament", back_populates="rounds")
    matches = relationship(
        "TournamentMatch", back_populates="round", cascade="all, delete-orphan"
    )

    __table_args__ = (
        UniqueConstraint(
            "tournament_id", "round_number", name="uq_tournament_round_number"
        ),
        Index("ix_tournament_round_tournament_status", "tournament_id", "status"),
    )


class TournamentMatchStatus(str, Enum):
    UPCOMING = "upcoming"
    LIVE = "live"
    COMPLETED = "completed"
    POSTPONED = "postponed"
    WALKOVER = "walkover"
    CANCELLED = "cancelled"


class TeamReadinessStatus(str, Enum):
    NOT_READY = "not_ready"
    READY = "ready"


class TournamentMatch(Base):
    __tablename__ = "tournament_match"

    id = Column(Integer, primary_key=True)
    round_id = Column(
        Integer,
        ForeignKey("tournament_round.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    match_number = Column(Integer, nullable=False)
    team_a_id = Column(
        Integer, ForeignKey("teams.id", ondelete="RESTRICT"), nullable=True
    )
    team_b_id = Column(
        Integer, ForeignKey("teams.id", ondelete="RESTRICT"), nullable=True
    )
    winner_team_id = Column(
        Integer, ForeignKey("teams.id", ondelete="RESTRICT"), nullable=True
    )
    status = Column(
        String(30), nullable=False, default=TournamentMatchStatus.UPCOMING.value
    )
    team_a_readiness = Column(
        String(30), nullable=False, default=TeamReadinessStatus.NOT_READY.value
    )
    team_b_readiness = Column(
        String(30), nullable=False, default=TeamReadinessStatus.NOT_READY.value
    )
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    round = relationship("TournamentRound", back_populates="matches")
    team_a = relationship("Team", foreign_keys=[team_a_id])
    team_b = relationship("Team", foreign_keys=[team_b_id])
    winner_team = relationship("Team", foreign_keys=[winner_team_id])
    games = relationship(
        "TournamentMatchGame", back_populates="match", cascade="all, delete-orphan"
    )
    result = relationship(
        "TournamentMatchResult",
        back_populates="match",
        uselist=False,
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        UniqueConstraint("round_id", "match_number", name="uq_round_match_number"),
        Index("ix_tournament_match_round_status", "round_id", "status"),
        Index("ix_tournament_match_team_a", "team_a_id"),
        Index("ix_tournament_match_team_b", "team_b_id"),
    )


class TournamentMatchGameStatus(str, Enum):
    UPCOMING = "upcoming"
    LIVE = "live"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class TournamentMatchGame(Base):
    __tablename__ = "tournament_match_game"

    id = Column(Integer, primary_key=True)
    match_id = Column(
        Integer,
        ForeignKey("tournament_match.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    game_number = Column(Integer, nullable=False)
    status = Column(
        String(30), nullable=False, default=TournamentMatchGameStatus.UPCOMING.value
    )
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    match = relationship("TournamentMatch", back_populates="games")
    evidence = relationship(
        "TournamentGameEvidence",
        back_populates="match_game",
        cascade="all, delete-orphan",
    )
    result = relationship(
        "TournamentGameResult",
        back_populates="match_game",
        uselist=False,
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        UniqueConstraint("match_id", "game_number", name="uq_match_game_number"),
    )


class TournamentEvidenceStatus(str, Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"
    SUBMITTED = "submitted"


class TournamentGameEvidence(Base):
    __tablename__ = "tournament_game_evidence"

    id = Column(Integer, primary_key=True)
    match_game_id = Column(
        Integer,
        ForeignKey("tournament_match_game.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    screenshot_url = Column(Text, nullable=False)
    screenshot_public_id = Column(String(255), nullable=False)
    submitted_by = Column(
        Integer, ForeignKey("players.id", ondelete="RESTRICT"), nullable=False
    )
    status = Column(
        String(30), nullable=False, default=TournamentEvidenceStatus.PENDING.value
    )
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    verified_at = Column(DateTime(timezone=True), nullable=True)

    match_game = relationship("TournamentMatchGame", back_populates="evidence")
    submitted_player = relationship("Player", foreign_keys=[submitted_by])

    __table_args__ = (
        Index("ix_tournament_game_evidence_game_status", "match_game_id", "status"),
    )


class TournamentGameResult(Base):
    __tablename__ = "tournament_game_results"

    id = Column(Integer, primary_key=True)
    match_game_id = Column(
        Integer,
        ForeignKey("tournament_match_game.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    winner_team_id = Column(
        Integer, ForeignKey("teams.id", ondelete="RESTRICT"), nullable=False
    )
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    verified_at = Column(DateTime(timezone=True), nullable=True)

    match_game = relationship("TournamentMatchGame", back_populates="result")
    winner_team = relationship("Team", foreign_keys=[winner_team_id])


class TournamentMatchResultType(str, Enum):
    NORMAL = "normal"
    WALKOVER = "walkover"


class TournamentMatchResult(Base):
    __tablename__ = "tournament_match_result"

    id = Column(Integer, primary_key=True)
    match_id = Column(
        Integer,
        ForeignKey("tournament_match.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    winner_team_id = Column(
        Integer, ForeignKey("teams.id", ondelete="RESTRICT"), nullable=True
    )
    result_type = Column(String(30), nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    verified_at = Column(DateTime(timezone=True), nullable=True)

    match = relationship("TournamentMatch", back_populates="result")
    winner_team = relationship("Team", foreign_keys=[winner_team_id])
