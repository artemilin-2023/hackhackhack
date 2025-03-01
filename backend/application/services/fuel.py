from enum import Enum
from typing import Optional
from sqlmodel import SQLModel, Field

class FuelType(str, Enum):
    GASOLINE = "gasoline"
    DIESEL = "diesel"
    JET_FUEL = "jet_fuel"
    CRUDE_OIL = "crude_oil"

class Fuel(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    fuel_type: FuelType
    description: Optional[str] = None

    class Config:
        use_enum_values = True