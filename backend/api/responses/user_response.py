from pydantic import BaseModel, EmailStr

from domain.user import Role


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    role: Role
