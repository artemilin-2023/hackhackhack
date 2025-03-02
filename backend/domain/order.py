from enum import Enum
from sqlmodel import SQLModel, Field
from datetime import date
from typing import Optional


class OrderStatus(str, Enum):
    PENDING = "Ожидание"
    COMPLETED = "Выполнен"
    CANCELED = "Отменен"

class DeliveryType(str, Enum):
    DELIVERY = "Доставка"
    SELF_PICKUP = "Самовывоз"


class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    order_date: date = Field(default_factory=date.today)
    lot_id: int = Field(foreign_key="lot.id")
    volume: float
    delivery_type: DeliveryType = Field(default=DeliveryType.DELIVERY)
    customer_id: int = Field(foreign_key="user.id")
    status: OrderStatus = Field(default=OrderStatus.PENDING)