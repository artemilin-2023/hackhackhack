from typing import Union

from pydantic import BaseModel, EmailStr

from domain.user import PublicRole


class CreateUserRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: PublicRole
