from pydantic import BaseModel, EmailStr

from domain.user import PublicRole, Role


class CreateUserRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: PublicRole


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    role: Role
