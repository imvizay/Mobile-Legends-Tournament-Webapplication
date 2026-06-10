from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    field_validator,
    model_validator
)


# Req schema
class AuthCreateRequest(BaseModel):
    email : EmailStr
    password:str 
    confirm_password:str
    provider: str = Field(default="email")
    
    @model_validator(mode='after')
    def validate_password(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match.")
        
        return self
    




# Res schema
from datetime import datetime

class RegistrationResponse(BaseModel):
    status: str
    message: str
    expires_at: datetime | None = None
    email_sent_at:datetime | None = None

    
