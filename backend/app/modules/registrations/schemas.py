from pydantic import BaseModel

class TeamRegistrationFailedRequestSchema(BaseModel):
    reason:str
    