from typing import Optional, List
from pydantic import BaseModel, Field

class OilPumpBase(BaseModel):
    name: str = Field(..., min_length=1)
    region: str = Field(..., min_length=1)

class OilPumpCreate(OilPumpBase):
    pass

class OilPumpUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1)
    region: Optional[str] = Field(None, min_length=1)

class OilPumpRead(OilPumpBase):
    id: int

    class Config:
        from_attributes = True

class Pagination(BaseModel):
    total_pages: int
    current_page: int
    has_next: bool
    has_prev: bool
    total_items: int
    page_size: int

class PaginatedOilPumps(BaseModel):
    items: List[OilPumpRead]
    pagination: Pagination 