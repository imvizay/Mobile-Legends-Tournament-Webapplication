from enum import Enum
from app.core.db.base_class import Base
from sqlalchemy import (
    Column,
    Integer,
    String,
    Numeric,
    Text,
    DateTime,
    ForeignKey,
    Enum as SQLEnum,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class PaymentStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"
    CANCELLED = "cancelled"
    UNKNOWN = "unknown"


class PaymentType(str, Enum):
    TOURNAMENT_CONTRIBUTION = "tournament_contribution"
    WALLET_TOPUP = "wallet_topup"
    WITHDRAWAL = "withdrawal"
    REFUND = "refund"
    REWARD = "reward"
    CLAIM = "claim"
    BONUS = "bonus"
    

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True)

    idempotency_key = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    payment_reference = Column(
        String(100),
        unique=True,
        nullable=True,
        index=True,
    )

    payment_type = Column(
        SQLEnum(PaymentType),
        nullable=False,
    )

    status = Column(
        SQLEnum(PaymentStatus),
        default=PaymentStatus.PENDING,
        nullable=False,
    )

    amount = Column(
        Numeric(10, 2),
        nullable=False,
    )

    player_id = Column(
        Integer,
        ForeignKey(
            "players.id",
            ondelete="SET NULL",
        ),
        nullable=True,
    )

    team_id = Column(
        Integer,
        ForeignKey(
            "teams.id",
            ondelete="SET NULL",
        ),
        nullable=True,
    )

    tournament_id = Column(
        Integer,
        ForeignKey(
            "tournaments.id",
            ondelete="SET NULL",
        ),
        nullable=True,
    )

    registration_id = Column(
        Integer,
        ForeignKey(
            "team_tournament_registration.id",
            ondelete="SET NULL",
        ),
        nullable=True,
    )

    contribution_id = Column(
        Integer,
        ForeignKey(
            "team_tournament_contribution.id",
            ondelete="SET NULL",
        ),
        nullable=True,
    )

    failed_attempts = Column(
        Integer,
        default=0,
        nullable=False,
    )

    max_attempts = Column(
        Integer,
        default=5,
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

    player = relationship("Player")
    team = relationship("Team")
    tournament = relationship("Tournament")
    registration = relationship("TeamTournamentRegistration")
    contribution = relationship("TeamTournamentContribution")

    attempts = relationship(
        "PaymentAttempt",
        back_populates="payment",
        cascade="all, delete-orphan",
    )


class PaymentAttemptStatus(str, Enum):
    CREATED = "created"
    PROCESSING = "processing"
    SUCCESS = "success"
    FAILED = "failed"


class PaymentAttempt(Base):
    __tablename__ = "payment_attempts"

    id = Column(Integer, primary_key=True)

    payment_id = Column(
        Integer,
        ForeignKey(
            "payments.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    attempt_number = Column(
        Integer,
        nullable=False,
    )

    status = Column(
        SQLEnum(PaymentAttemptStatus),
        nullable=False,
    )

    amount = Column(
        Numeric(10, 2),
        nullable=False,
    )

    gateway = Column(
        String(50),
        nullable=True,
    )

    gateway_order_id = Column(
        String(255),
        nullable=True,
    )

    gateway_payment_id = Column(
        String(255),
        nullable=True,
    )

    payment_method = Column(
        String(50),
        nullable=True,
    )

    failure_code = Column(
        String(100),
        nullable=True,
    )

    failure_reason = Column(
        Text,
        nullable=True,
    )

    attempted_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    completed_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    payment = relationship(
        "Payment",
        back_populates="attempts",
    )



class PlayerPaymentSecurity(Base):
    __tablename__ = "player_payment_security"

    id = Column(Integer, primary_key=True)

    player_id = Column(
        Integer,
        ForeignKey("players.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )

    consecutive_failures = Column(
        Integer,
        default=0,
        nullable=False,
    )

    lock_count = Column(
        Integer,
        default=0,
        nullable=False,
    )

    locked_until = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    last_failed_at = Column(
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

    player = relationship("Player")