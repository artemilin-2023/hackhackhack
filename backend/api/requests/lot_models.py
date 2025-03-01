from typing import Optional, List
from pydantic import BaseModel

from domain.lot import Lot


class LotCreate(BaseModel):
    title: str
    description: str
    price: float


class LotUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None


class LotRead(BaseModel):
    id: int
    title: str
    description: str
    price: float
    seller_id: int

    class Config:
        orm_mode = True


class Pagination(BaseModel):
    total_pages: int
    current_page: int
    has_next: bool
    has_prev: bool


class PaginatedLots(BaseModel):
    lots: List[Lot]
    pagination: Pagination
