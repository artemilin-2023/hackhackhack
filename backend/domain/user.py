from enum import Enum

from sqlmodel import Field, SQLModel


class PublicRole(str, Enum):
    customer = "customer"
    seller = "seller"


# Крч питон не поддерживает наследование от Enum, поэтому говнокодим. (сейчас бы на шарпах писать, а не вот это вот все)
class Role(str, Enum):
    customer = PublicRole.customer.value
    seller = PublicRole.seller.value
    admin = "admin"


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field()
    email: str = Field(index=True)
    password: str = Field()
    role: Role = Field(default=Role.customer)
