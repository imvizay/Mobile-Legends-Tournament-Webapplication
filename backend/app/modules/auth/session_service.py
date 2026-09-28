from datetime import UTC, datetime, timedelta
from uuid import uuid4

from .models import Player, PlayerSession
from .session_repository import SessionRepository
from .token_service import TokenService
from app.core.exceptions import exceptions


class SessionService:

    def __init__(self,token_service: TokenService,repository:SessionRepository):
        self.token_service = token_service
        self.repository = repository

    # pvt helper function

    def _validate_refresh_session(
        self,
        refresh_token: str
    ) -> tuple[PlayerSession, dict]:

        if not refresh_token:
            raise exceptions.InvalidTokenException()

        payload = self.token_service.decode_token(refresh_token)

        self.token_service.verify_token_type(payload,"refresh")

        session = self.repository.get_session_by_id(payload["session_id"])

        if session is None:
            raise exceptions.InvalidSessionException()

        if session.is_revoked:
            raise exceptions.RevokedTokenException()

        if session.refresh_jti != payload["jti"]:
            raise exceptions.InvalidTokenException()

        return session, payload


    def create_login_session(
            self,
            player:Player
        ):

        refresh_jti = str(uuid4())
        expires_at = (
            datetime.now(UTC) + timedelta(days=self.token_service.REFRESH_TOKEN_EXPIRE_DAYS)
        )

        session = self.repository.create_session(
            player_id=player.id,
            refresh_jti=refresh_jti,
            expires_at=expires_at
        )

        access_token = self.token_service.create_access_token(
            player.id
        )

        refresh_token = self.token_service.create_refresh_token(
            player.id,
            session.id,
            refresh_jti
        )

        return {
            "access": access_token,
            "refresh": refresh_token,
        }

    def refresh_session(
            self,
            refresh_token:str
        ):

        _,payload = self._validate_refresh_session(refresh_token)
        
        # new access token
        new_access = self.token_service.create_access_token(int(payload["sub"]))

        return{
            "access":new_access
        }
        

    def rotate_refresh_token():
        ...

    def revoke_session(self,refresh_token:str):

        session,_ = self._validate_refresh_session(refresh_token)

        self.repository.revoke_session(
            session,
            reason="logout"
        )
        
        # logget out successfully via router response

    def revoke_all_sessions():
        ...

    def cleanup_expired_sessions():
        ...
