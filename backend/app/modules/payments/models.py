from enum import Enum

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.db.base_class import Base

# ============================================================
# ENUMS
# ============================================================


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


class PaymentMethod(str, Enum):
    WALLET = "wallet"
    RAZORPAY = "razorpay"


class PaymentGateway(str, Enum):
    RAZORPAY = "razorpay"
    INTERNAL_WALLET = "internal_wallet"


class PaymentAttemptStatus(str, Enum):
    CREATED = "created"
    PROCESSING = "processing"
    SUCCESS = "success"
    FAILED = "failed"


# PAYMENT


class Payment(Base):
    __tablename__ = "payments"

    id = Column(
        Integer,
        primary_key=True,
    )

    contribution_id = Column(
        Integer,
        ForeignKey(
            "team_tournament_contribution.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        unique=True,
        index=True,
    )

    player_id = Column(
        Integer,
        ForeignKey(
            "players.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    team_id = Column(
        Integer,
        ForeignKey(
            "teams.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    tournament_id = Column(
        Integer,
        ForeignKey(
            "tournaments.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    registration_id = Column(
        Integer,
        ForeignKey(
            "team_tournament_registration.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    payment_reference = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    # Python Enum, DB stores VARCHAR
    payment_type = Column(
        String(50),
        nullable=False,
        index=True,
    )

    # Python Enum, DB stores VARCHAR
    status = Column(
        String(30),
        nullable=False,
        default=PaymentStatus.PENDING.value,
        index=True,
    )

    amount = Column(
        Numeric(10, 2),
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

    # RELATIONSHIPS

    player = relationship("Player")

    team = relationship("Team")

    tournament = relationship("Tournament")

    registration = relationship("TeamTournamentRegistration")

    contribution = relationship("TeamTournamentContribution")

    attempts = relationship(
        "PaymentAttempt",
        back_populates="payment",
        cascade="all, delete-orphan",
        order_by="PaymentAttempt.attempt_number",
    )


# ============================================================
# PAYMENT ATTEMPT
# ============================================================

class PaymentAttempt(Base):
    __tablename__ = "payment_attempts"

    id = Column(
        Integer,
        primary_key=True,
    )

    payment_id = Column(
        Integer,
        ForeignKey(
            "payments.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    attempt_number = Column(
        Integer,
        nullable=False,
    )

    idempotency_key = Column(
        String(100),
        nullable=False,
        index=True,
    )

    # Python Enum, DB stores VARCHAR
    status = Column(
        String(30),
        nullable=False,
        index=True,
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

    amount = Column(
        Numeric(10, 2),
        nullable=False,
    )

    # Python Enum, DB stores VARCHAR
    payment_method = Column(
        String(30),
        nullable=True,
    )

    # Python Enum, DB stores VARCHAR
    gateway = Column(
        String(30),
        nullable=True,
    )

    gateway_order_id = Column(
        String(255),
        nullable=True,
        index=True,
    )

    gateway_payment_id = Column(
        String(255),
        nullable=True,
        index=True,
    )

    failure_code = Column(
        String(100),
        nullable=True,
    )

    failure_reason = Column(
        Text,
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

    # ========================================================
    # RELATIONSHIPS
    # ========================================================

    payment = relationship(
        "Payment",
        back_populates="attempts",
    )

    # CONSTRAINTS

    __table_args__ = (
        UniqueConstraint(
            "payment_id",
            "idempotency_key",
            name="uq_payment_attempt_payment_idempotency",
        ),
        UniqueConstraint(
            "payment_id",
            "attempt_number",
            name="uq_payment_attempt_number",
        ),
    )
