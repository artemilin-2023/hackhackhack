from datetime import date
from typing import List, Optional
from pydantic import BaseModel
from api.models.pagination import Pagination
from domain.lot import LotStatus, OilType
from api.models.oil_pump_models import OilPumpRead

class LotBase(BaseModel):
    lot_expiration_date: date
    ksss_nb_code: int
    ksss_fuel_code: int
    initial_weight: int
    available_weight: int
    total_price: float
    price_per_ton: float
    oil_type: OilType
    oil_pump: OilPumpRead

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

class PaginatedLots(BaseModel):
    items: List[LotRead]
    pagination: Pagination

class PublicLotFilter(BaseModel):
    oil_type: Optional[OilType] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    region: Optional[str] = None
    oil_pump_name: Optional[str] = None
    search: Optional[str] = None
    available_weight_min: Optional[int] = None

class LotFilter(PublicLotFilter):
    status: Optional[LotStatus] = None
    