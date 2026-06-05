from sqlalchemy import Column,String,Boolean,Integer,DateTime
from sqlalchemy.orm import relationship
from datetime import datetime,UTC

# Base model
from app.core.db.base_class import Base

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer,nullable=False,primary_key=True) 
    
    email = Column(String,nullable=False,unique=True)
    password = Column(String,nullable=False)
    provider = Column(String,nullable=False)

    verified = Column(Boolean,default=False)
    is_membership_active = Column(Boolean,default=False)
    is_banned = Column(Boolean,default=False) # temporary banned check

    role = Column(String,default="player")

    created_at = Column(DateTime,default=lambda:datetime.now(UTC))

    
