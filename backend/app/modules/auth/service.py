from passlib.context import CryptContext
from .repository import AuthRepository
from .models import Player
from .schema import AuthCreateRequest

password_context = CryptContext(
    schemes=['bcrypt'],
    deprecated="auto"
)

class AuthService:

    # construcutor run whenever an object is created and assign db so every method could access db
    def __init__(self,repository:AuthRepository):
        self.repository = repository

    def register(self,payload:AuthCreateRequest):

        print("PASSWORD:", payload.password)
        print("TYPE:", type(payload.password))
        print("LEN:", len(payload.password))
        print("REPR:", repr(payload.password))

        existing_user = self.repository.get_by_email(payload.email)

        if(existing_user):
            raise Exception("email already exist.")
        
        

        hashed_password = password_context.hash(payload.password)
        # hashed_password = "dummy_hash"
        print("HASED PASSWORD",hashed_password)

        player = Player(
            email=payload.email,
            password=hashed_password[:72],
            provider=payload.provider
        )

        created_player = self.repository.create_user(player)

        return created_player
        