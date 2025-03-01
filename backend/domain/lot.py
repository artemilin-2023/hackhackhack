from sqlmodel import Field, SQLModel


class Lot(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field()
    description: str = Field()
    price: float = Field()
    seller_id: int = Field(foreign_key="user.id")
