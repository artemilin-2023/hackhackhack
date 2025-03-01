from enum import Enum

from sqlmodel import Field, SQLModel


class PublicRole(str, Enum):
    customer = "customer"


class Role(str, Enum):
    customer = PublicRole.customer.value
    admin = "admin"


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field()
    email: str = Field(index=True)
    password: str = Field()
    role: Role = Field(default=Role.customer)
