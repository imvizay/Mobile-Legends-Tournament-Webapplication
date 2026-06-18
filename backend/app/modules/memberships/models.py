from app.core.db.base_class import Base
from ..auth.models import Player
from sqlalchemy.orm import relationship
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    Text,
    ForeignKey,
    DateTime,
    DECIMAL
)

from datetime import datetime,UTC


MEMBERSHIP_PERKS = {
    "basic":[
        "Create 1 team",
        "Join tournaments",
        "Basic player profile",
        "Tournament history",
        '0% Discount on entry fees'
    ],

    "silver": [
        "Everything in Basic",
        "Unlimited teams",
        "Silver badge",
        "Priority support",
        "Advanced match statistics",
        "Team performance analytics",
    ],

    "gold": [
        "Everything in Silver",
        "Gold badge",
        "Early tournament access",
        "Exclusive premium tournaments",
        "Detailed performance insights",
        "Custom profile banner",
        "VIP support",
    ]
} 



class MembershipPlan(Base):

    __tablename__ = "membership_plans"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(50),unique=True,nullable=False)

    price = Column(DECIMAL,nullable=False,default=0)

    duration_days = Column(Integer,default=45)

    perks = Column(Text,nullable=False)

    is_active = Column(Boolean,default=True)

    memberships = relationship("PlayerMembership",back_populates="plan")




class PlayerMembership(Base):
    __tablename__ = "player_memberships"

    id = Column(Integer, primary_key=True)

    player_id = Column(Integer,ForeignKey("players.id", ondelete="CASCADE"),nullable=False)

    plan_id = Column(Integer,ForeignKey("membership_plans.id"),nullable=False)

    start_date = Column(DateTime,default=datetime.now(UTC))

    end_date = Column(DateTime,nullable=True)

    is_active = Column(Boolean,default=True)

    player = relationship("Player",back_populates="membership")

    plan = relationship("MembershipPlan",back_populates="memberships")