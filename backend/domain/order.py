from enum import Enum
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime


class OrderStatus(str, Enum):
    pending = "pending"
    confirmed = "confirmed"
    canceled = "canceled"
    completed = "completed"


class Order(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    customer_id: int = Field(foreign_key="user.id")
    seller_id: int = Field(foreign_key="user.id")
    lot_id: int = Field(foreign_key="lot.id")
    quantity: float
    price_per_unit: float
    total_price: float
    status: OrderStatus = Field(default=OrderStatus.pending)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
