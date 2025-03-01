from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class OrderCreate(BaseModel):
    buyer_id: int
    seller_id: int
    lot_id: int
    quantity: float
    price_per_unit: float


class OrderUpdate(BaseModel):
    status: Optional[str]
    quantity: Optional[str]
    price_per_unit: Optional[str]
    status: Optional[str]


class OrderRead(BaseModel):
    id: int
    buyer_id: int
    seller_id: int
    lot_id: int
    quantity: float
    price_per_unit: float
    total_price: float
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
