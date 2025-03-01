from datetime import date
from enum import Enum
from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel

class LotStatus(str, Enum):
    CONFIRMED = "Подтвержден"
    SOLD = "Продан"
    INACTIVE = "Неактивен"

class OilType(str, Enum):
    AI_92 = "АИ-92"
    AI_95 = "АИ-95"
    AI_92_ECTO = "АИ-92 Экто"
    AI_95_ECTO = "АИ-95 Экто" 
    DT = "ДТ"
    
class Lot(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    lot_expiration_date: date = Field(index=True)
    ksss_nb_code: int = Field(index=True)
    ksss_fuel_code: int = Field(index=True)
    initial_weight: int
    available_weight: int
    status: LotStatus = Field(default=LotStatus.CONFIRMED)
    total_price: float
    price_per_ton: float
    oil_type: OilType = Field(index=True)

    oil_pump_id: Optional[int] = Field(default=None, foreign_key="oilpump.id")
    oil_pump: Optional["OilPump"] = Relationship(back_populates="lots")


class OilPump(SQLModel, table=True):
    __tablename__ = "oilpump"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    region: str = Field(index=True)    
    
    lots: List[Lot] = Relationship(back_populates="oil_pump")
    