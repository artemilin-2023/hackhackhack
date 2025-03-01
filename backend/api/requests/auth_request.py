from pydantic import BaseModel, EmailStr


class AuthRequest(BaseModel):
    email: EmailStr
    password: str
