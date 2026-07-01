from enum import Enum
from uuid import uuid4

from sqlalchemy import (Column,Integer,String,Text,Boolean,DateTime,
    Enum as SQLEnum,
    ForeignKey,
    Index,
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


class Team(Base):
    __tablename__ = "teams"
  
    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(60),nullable=False,unique=True,index=True,)
    tag = Column(String(10),nullable=False,unique=True,index=True,)
    slug = Column(String(80),nullable=False,unique=True,index=True,)

    logo_url = Column(Text, nullable=True)
    banner_url = Column(Text, nullable=True)

    description = Column(Text,nullable=True,)
    country = Column(String(50),nullable=False,index=True,default="ndia")
    region = Column(String(50),nullable=False,index=True,)
    city = Column(String(60),nullable=True,)
    visibility = Column(SQLEnum(TeamVisibility),default=TeamVisibility.PUBLIC,nullable=False)
    max_members = Column(Integer,default=7,nullable=False,)
    status = Column(SQLEnum(TeamStatus),default=TeamStatus.ACTIVE,nullable=False,index=True,)
    is_verified = Column(Boolean,default=False,nullable=False,)

    # Ownership    
    captain_id = Column(Integer,ForeignKey("players.id", ondelete="RESTRICT"),nullable=False,index=True,)
    created_by = Column(Integer,ForeignKey("players.id", ondelete="RESTRICT"),nullable=False,)

    # Moderation
    ban_reason = Column(Text,nullable=True,)
    banned_at = Column(DateTime(timezone=True),nullable=True,)
    banned_by = Column(Integer,ForeignKey("players.id", ondelete="SET NULL"),nullable=True,)

    # Audit
    created_at = Column(DateTime(timezone=True),server_default=func.now(),nullable=False,)
    updated_at = Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now(),nullable=False,)
    deleted_at = Column(DateTime(timezone=True),nullable=True,)

    # Relationships
    
    captain = relationship("Player",foreign_keys=[captain_id],)
    creator = relationship("Player",foreign_keys=[created_by],)
    moderator = relationship("Player",foreign_keys=[banned_by],)

    members = relationship("TeamMember",back_populates="team",cascade="all, delete-orphan",)
    wallet = relationship("TeamWallet",back_populates="team",uselist=False,)
    tournaments = relationship("TournamentRegistration",back_populates="team",)

    __table_args__ = (
        Index("idx_team_status_visibility", "status", "visibility"),
        Index("idx_team_region_status", "country", "region", "status"),
    )



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
    team_id = Column(Integer,ForeignKey("teams.id", ondelete="CASCADE"),nullable=False,index=True,)
    player_id = Column(Integer,ForeignKey("players.id", ondelete="CASCADE"),nullable=False,index=True,)

    role = Column(SQLEnum(TeamRole),nullable=False,default=TeamRole.PLAYER,)
    status = Column(SQLEnum(TeamMemberStatus),nullable=False,default=TeamMemberStatus.ACTIVE,)
    jersey_number = Column(Integer,nullable=True,)

    joined_at = Column(DateTime(timezone=True),server_default=func.now(),)
    left_at = Column(DateTime(timezone=True),nullable=True,)
    is_locked = Column(Boolean,default=False,nullable=False,)
    locked_until = Column(DateTime(timezone=True),nullable=True,)

    team = relationship("Team",back_populates="members",)
    player = relationship("Player",back_populates="teams",)

    __table_args__ = (
        Index("idx_team_player","team_id","player_id",),
        Index("idx_team_role","team_id","role",),
    )
    


class WalletStatus(str, Enum):
    ACTIVE = "active"
    FROZEN = "frozen"
    CLOSED = "closed"

from sqlalchemy import Numeric


class TeamWallet(Base):

    __tablename__ = "team_wallets"

    id = Column(Integer, primary_key=True)
    team_id = Column(Integer,ForeignKey("teams.id", ondelete="CASCADE"),unique=True,nullable=False,)

    balance = Column(Numeric(12, 2),nullable=False,default=0,)
    total_deposit = Column(Numeric(12, 2),nullable=False,default=0,)
    total_withdraw = Column(Numeric(12, 2),nullable=False,default=0,)

    status = Column(SQLEnum(WalletStatus),nullable=False,default=WalletStatus.ACTIVE,)

    created_at = Column(DateTime(timezone=True),server_default=func.now(),)
    updated_at = Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now(),)

    team = relationship("Team",back_populates="wallet",)