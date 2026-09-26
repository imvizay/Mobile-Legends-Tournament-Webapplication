from datetime import UTC, datetime

from sqlalchemy.orm import Session

from .models import PlayerSession


class SessionRepository:

    def __init__(self,db: Session):
        self.db = db
        
    def create_session(
            self,
            player_id:int,
            refresh_jti:str,
            expires_at:datetime
        ) -> PlayerSession:

        session = PlayerSession(
            player_id=player_id,
            refresh_jti=refresh_jti,
            expires_at=expires_at
        )

        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)

        return session
        

    def get_session_by_id(self,session_id:int):
        return (
            self.db.query(PlayerSession)
            .filter(PlayerSession.id == session_id)
            .first()
        )
    

    def get_session_by_jti(self,refresh_jti:str):
        return (
            self.db.query(PlayerSession)
            .filter(PlayerSession.refresh_jti == refresh_jti)
            .first()
        )

    def revoke_session(
            self,
            session: PlayerSession,
            reason:str
        ):
        
        session.is_revoked = True
        session.revoke_reason = reason
        session.revoked_at = datetime.now(UTC)

        self.db.commit()

    def update_refresh_jti(
        self,
        session: PlayerSession,
        new_refresh_jti: str,
        expires_at: datetime
    ):

        session.refresh_jti = new_refresh_jti
        session.expires_at = expires_at
        session.last_used_at = datetime.now(UTC)
    
        self.db.commit()
        self.db.refresh(session)
    
        return session
