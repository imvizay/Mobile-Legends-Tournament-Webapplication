from app.core.db.base_class import Base
from ..auth.models import Player
from sqlalchemy.orm import relationship

class GameProfile(Base):

    user_id  = relationship("Player",back_populates='game_profile')
    