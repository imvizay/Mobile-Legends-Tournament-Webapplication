from enum import Enum
from uuid import uuid4

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    DateTime,
    Enum as SQLEnum,
    ForeignKey,
    Index,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.db.base import Base


class TeamVisibility(str, Enum):
    PUBLIC = "public"
    PRIVATE = "private"
    INVITE_ONLY = "invite_only"


class TeamStatus(str, Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    BANNED = "banned"
    DISBANDED = "disbanded"
    ARCHIVED = "archived"


class TeamRole(str, Enum):
    CAPTAIN = "captain"
    CO_LEADER = "co_leader"
    PLAYER = "player"
    SUBSTITUTE = "substitute"


class TeamMemberStatus(str, Enum):
    ACTIVE = "active"
    LEFT = "left"
    REMOVED = "removed"
    BANNED = "banned"


class TeamMember(Base):

    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True)
    team_id = Column(
        Integer, ForeignKey("teams.id", ondelete="CASCADE"), nullable=False, index=True
    )
    player_id = Column(
        Integer,
        ForeignKey("players.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    role = Column(SQLEnum(TeamRole), nullable=False, default=TeamRole.PLAYER)
    status = Column(
        SQLEnum(TeamMemberStatus), nullable=False, default=TeamMemberStatus.ACTIVE
    )

    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    left_at = Column(DateTime(timezone=True), nullable=True)
    is_locked = Column(Boolean, default=False, nullable=False)
    locked_until = Column(DateTime(timezone=True), nullable=True)

    team = relationship("Team", back_populates="members")
    player = relationship("Player", back_populates="teams")

    __table_args__ = (
        Index("idx_team_player", "team_id", "player_id"),
        Index("idx_team_role", "team_id", "role"),
    )


class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(60), nullable=False, unique=True, index=True)
    tag = Column(String(10), nullable=False, unique=False, index=False)

    logo_public_id = Column(String(255), nullable=True)
    logo_url = Column(Text, nullable=True)

    banner_public_id = Column(String(255), nullable=True)
    banner_url = Column(Text, nullable=True)

    description = Column(
        Text,
        nullable=True,
    )
    country = Column(String(50), nullable=False, index=True, default="india")
    region = Column(String(50), nullable=True)
    city = Column(String(60), nullable=True)
    visibility = Column(
        SQLEnum(TeamVisibility), default=TeamVisibility.PUBLIC, nullable=False
    )
    max_members = Column(Integer, default=7, nullable=False)
    status = Column(
        SQLEnum(TeamStatus), default=TeamStatus.ACTIVE, nullable=False, index=True
    )
    is_verified = Column(Boolean, default=False, nullable=False)

    # Ownership
    captain_id = Column(
        Integer,
        ForeignKey("players.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    created_by = Column(
        Integer, ForeignKey("players.id", ondelete="RESTRICT"), nullable=False
    )

    # Moderation
    ban_reason = Column(Text, nullable=True)
    banned_at = Column(DateTime(timezone=True), nullable=True)
    banned_by = Column(
        Integer, ForeignKey("players.id", ondelete="SET NULL"), nullable=True
    )

    # Audit
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships

    captain = relationship("Player", foreign_keys=[captain_id])
    creator = relationship("Player", foreign_keys=[created_by])
    moderator = relationship("Player", foreign_keys=[banned_by])

    members = relationship(
        "TeamMember", back_populates="team", cascade="all, delete-orphan"
    )

    # tournaments = relationship(TournamentRegistration,back_populates="team")

    __table_args__ = (
        Index("idx_team_status_visibility", "status", "visibility"),
        Index("idx_team_region_status", "country", "region", "status"),
    )


from sqlalchemy import Numeric


# SEND REQ TO JOIN A TEAM
class TeamJoinRequestStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"
    EXPIRED = "expired"


class TeamJoinRequest(Base):

    __tablename__ = "join_request"

    id = Column(Integer, primary_key=True)
    team_id = Column(
        Integer, ForeignKey("teams.id", ondelete="CASCADE"), nullable=False
    )
    player_id = Column(
        Integer, ForeignKey("players.id", ondelete="CASCADE"), nullable=False
    )
    status = Column(
        SQLEnum(TeamJoinRequestStatus),
        default=TeamJoinRequestStatus.PENDING,
        nullable=False,
    )
    message = Column(Text, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("team_id", "player_id", name="uq_team_player_request"),
    )


# TOURNAMENT


class TournamentRegistrationStatus(str, Enum):
    PENDING = "pending"
    UNDER_REVIEW = "under_review"
    PAYMENT_PENDING = "payment_pending"
    APPROVED = "approved"
    FAILED = "failed"
    CANCELLED = "cancelled"
    DISQUALIFIED = "disqualified"


class TeamTournamentRegistration(Base):
    __tablename__ = "team_tournament_registration"

    id = Column(Integer, primary_key=True)

    tournament_id = Column(
        Integer,
        ForeignKey("tournaments.id", ondelete="CASCADE"),
        nullable=False,
    )

    team_id = Column(
        Integer,
        ForeignKey("teams.id", ondelete="CASCADE"),
        nullable=False,
    )

    captain_id = Column(
        Integer,
        ForeignKey("players.id", ondelete="CASCADE"),
        nullable=False,
    )

    status = Column(
        SQLEnum(TournamentRegistrationStatus),
        default=TournamentRegistrationStatus.PENDING,
        nullable=False,
    )

    applied_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    approved_at = Column(DateTime(timezone=True), nullable=True)
    cancelled_at = Column(DateTime(timezone=True), nullable=True)
    failed_at = Column(DateTime(timezone=True), nullable=True)

    failure_reason = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    tournament = relationship("Tournament", back_populates="team_registrations")
    roster = relationship(
        "TournamentRoster",
        back_populates="registration",
        uselist=False,
        cascade="all, delete-orphan",
    )


# Roster
class TournamentRosterStatus(str, Enum):
    SELECTING = "selecting"
    CONFIRMED = "confirmed"  # soft lock by captain can be updated by admin only if request by captain
    LOCKED = "locked"  # final lock by admin


class TournamentRoster(Base):
    __tablename__ = "tournament_roster"

    id = Column(Integer, primary_key=True)

    team_id = Column(
        Integer,
        ForeignKey(
            "teams.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )
    tournament_id = Column(
        Integer, ForeignKey("tournaments.id", ondelete="CASCADE"), nullable=False
    )
    registration_id = Column(
        Integer,
        ForeignKey(
            "team_tournament_registration.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        unique=True,
    )

    status = Column(
        SQLEnum(TournamentRosterStatus),
        default=TournamentRosterStatus.SELECTING,
        nullable=False,
    )

    confirmed_at = Column(
        DateTime(timezone=True), nullable=True
    )  # datetime when captain confirm the roster

    locked_at = Column(
        DateTime(timezone=True), nullable=True
    )  # admin locks it when team confirms the roster

    locked_by = Column(
        Integer,
        ForeignKey("players.id", ondelete="SET NULL"),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    registration = relationship(
        "TeamTournamentRegistration",
        back_populates="roster",
    )

    players = relationship(
        "TournamentRosterPlayer",
        back_populates="roster",
        cascade="all, delete-orphan",
    )

    locked_by_player = relationship(
        "Player",
        foreign_keys=[locked_by],
    )

    @property
    def selected_roster_count(self):
        return sum(
            1
            for player in self.players
            if player.status == TournamentRosterPlayerStatus.SELECTED
        )


class TournamentRosterPlayerStatus(str, Enum):
    SELECTED = "selected"
    REMOVED = "removed"
    
    SUBSTITUTE = "substitute"


class TournamentReadiness(str, Enum):
    NOT_READY = "not_ready"
    READY = "ready"


class TournamentRosterPlayer(Base):

    __tablename__ = "tournament_roster_player"

    id = Column(Integer, primary_key=True)

    roster_id = Column(
        Integer,
        ForeignKey(
            "tournament_roster.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    player_id = Column(
        Integer,
        ForeignKey(
            "players.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    status = Column(
        SQLEnum(TournamentRosterPlayerStatus),
        default=TournamentRosterPlayerStatus.SELECTED,
        nullable=False,
    )

    tournament_readiness = Column(
        SQLEnum(TournamentReadiness),
        default=TournamentReadiness.NOT_READY,
        nullable=False,
    )

    roster = relationship(
        "TournamentRoster",
        back_populates="players",
    )

    player = relationship(
        "Player",
    )

    contribution = relationship(
        "TeamTournamentContribution",
        back_populates="roster_player",
        uselist=False,
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        UniqueConstraint(
            "roster_id",
            "player_id",
            name="uq_roster_player",
        ),
    )


class TeamTournamentContributionStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"


class TeamTournamentContribution(Base):

    __tablename__ = "team_tournament_contribution"

    id = Column(Integer, primary_key=True)

    roster_player_id = Column(
        Integer,
        ForeignKey(
            "tournament_roster_player.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        unique=True,
        index=True,
    )

    amount = Column(
        Numeric(10, 2),
        nullable=False,
    )

    status = Column(
        SQLEnum(TeamTournamentContributionStatus),
        default=TeamTournamentContributionStatus.PENDING,
        nullable=False,
    )

    paid_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    roster_player = relationship(
        "TournamentRosterPlayer",
        back_populates="contribution",
    )
