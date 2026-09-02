from sqlalchemy import Column, String, Boolean, Integer, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, UTC
from sqlalchemy import ForeignKey,UniqueConstraint

# Base model
from app.core.db.base_class import Base

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, nullable=False)

    # Account
    username = Column(String(50), nullable=True)
    email = Column(String(255), nullable=False, unique=True)
    password = Column(String, nullable=False)
    provider = Column(String(30), nullable=False)
    provider_id = Column(String, nullable=True)

    # MLBB Profile
    mlbb_id = Column(String(50), nullable=True)
    mlbb_server = Column(String(20), nullable=True)
    mlbb_level = Column(Integer, nullable=True)

    # Profile Image
    profile_url = Column(String, nullable=True)
    profile_public_id = Column(String, nullable=True)

    # Platform Status
    verified = Column(Boolean, default=False, nullable=False)
    is_membership_active = Column(Boolean, default=False, nullable=False)
    is_banned = Column(Boolean, default=False, nullable=False)
    role = Column(String(30), default="player", nullable=False)

    # Timestamps
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )

    # Relationships
    teams = relationship(
        "TeamMember",
        back_populates="player",
        cascade="all, delete-orphan",
    )

    sessions = relationship(
        "PlayerSession",
        back_populates="player",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        UniqueConstraint(
            "mlbb_id",
            "mlbb_server",
            name="uq_player_mlbb_id_server",
        ),
    )


class PendingRegistration(Base):

    __tablename__ = "pending_registration"

    id = Column(Integer, primary_key=True)  # auto generated

    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    role = Column(String, default="player")

    verification_token = Column(String, nullable=False, unique=True)
    token_expire_at = Column(DateTime(timezone=True), nullable=True)

    email_sent = Column(String, default="PENDING")
    email_sent_at = Column(DateTime(timezone=True), nullable=True)

    last_resent_at = Column(DateTime(timezone=True), nullable=True)
    resent_count = Column(Integer, default=0)
    last_error = Column(String, nullable=True, default="N/A")

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))


# TOKEN RELETED MODELS


class PlayerSession(Base):

    __tablename__ = "player_sessions"

    id = Column(Integer, primary_key=True)
    player_id = Column(
        Integer, ForeignKey("players.id", ondelete="CASCADE"), nullable=False
    )
    refresh_jti = Column(String, unique=True, nullable=False, index=True)

    is_revoked = Column(Boolean, default=False)

    expires_at = Column(DateTime(timezone=True), nullable=False)
    last_used_at = Column(DateTime(timezone=True), nullable=True)
    revoked_at = Column(DateTime(timezone=True), nullable=True)
    revoke_reason = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))

    player = relationship("Player", back_populates="sessions")
