from datetime import date
from typing import List, Optional
from pydantic import BaseModel, Field

from domain.lot import LotStatus, OilType


class LotBase(BaseModel):
    lot_expiration_date: date
    ksss_nb_code: int
    ksss_fuel_code: int
    initial_weight: int
    available_weight: int
    total_price: float
    price_per_ton: float
    oil_type: OilType
    oil_pump_id: int


class LotCreate(LotBase):
    pass


class LotUpdate(BaseModel):
    lot_expiration_date: Optional[date] = None
    available_weight: Optional[int] = None
    status: Optional[LotStatus] = None
    total_price: Optional[float] = None
    price_per_ton: Optional[float] = None


class LotRead(LotBase):
    id: int
    status: LotStatus
    
    class Config:
        from_attributes = True


class Pagination(BaseModel):
    total_pages: int
    current_page: int
    has_next: bool
    has_prev: bool
    total_items: int
    page_size: int


class PaginatedLots(BaseModel):
    items: List[LotRead]
    pagination: Pagination


class LotFilter(BaseModel):
    status: Optional[LotStatus] = None
    oil_type: Optional[OilType] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    region: Optional[str] = None
    available_weight_min: Optional[int] = None
