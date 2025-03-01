from typing import List
from pydantic import BaseModel
from datetime import datetime

from domain.order import Order, OrderStatus
from api.models.lot_models import Pagination


class OrderCreate(BaseModel):
    seller_id: int
    lot_id: int
    quantity: float
    price_per_unit: float


class OrderUpdateStatus(BaseModel):
    status: OrderStatus

class OrderRead(BaseModel):
    id: int
    customer_id: int
    seller_id: int
    lot_id: int
    quantity: float
    price_per_unit: float
    total_price: float
    status: OrderStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class PaginatedOrders(BaseModel):
    orders: List[Order]
    pagination: Pagination
