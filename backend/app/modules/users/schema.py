from pydantic import BaseModel,ConfigDict
from datetime import datetime

class UsersList(BaseModel):
    id: int

    email: str
    provider: str

    verified: bool
    is_membership_active: bool
    is_banned: bool
    role: str
    created_at: datetime
    
    mlbb_id : str | None = None
    mlbb_server : str | None = None
    
    model_config = ConfigDict(from_attributes=True)


class AdminUsersResponse(BaseModel):
    success: bool
    message: str
    data: list[UsersList] 
