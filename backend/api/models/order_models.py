from datetime import date
from typing import List, Optional
from pydantic import BaseModel, Field
from api.models.pagination import Pagination
from domain.order import OrderStatus
from domain.lot import Lot
from domain.order import DeliveryType

class OrderBase(BaseModel):
    lot_id: int = Field(..., gt=0)
    volume: float = Field(..., gt=0)
    delivery_type: DeliveryType

class OrdersCreate(BaseModel):
    orders: List[OrderBase]

class OrderFilter(BaseModel):
    status: Optional[OrderStatus] = None
    min_volume: Optional[float] = None
    max_volume: Optional[float] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    delivery_type: Optional[str] = None

class PaginatedOrders(BaseModel):
    items: List[Lot]
    pagination: Pagination
    