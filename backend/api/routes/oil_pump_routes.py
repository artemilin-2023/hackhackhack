from typing import List, Optional
from fastapi import APIRouter, Query
from starlette import status

from api.models.oil_pump_models import (
    OilPumpCreate,
    OilPumpRead,
    OilPumpUpdate,
    PaginatedOilPumps
)
from dependencies import OilPumpServiceDep

router = APIRouter(
    prefix="/oil-pumps",
    tags=["oil pumps"]
)

@router.post("/", response_model=OilPumpRead, status_code=status.HTTP_201_CREATED)
async def create_oil_pump(
    pump_data: OilPumpCreate,
    service: OilPumpServiceDep
) -> OilPumpRead:
    return service.create_oil_pump(pump_data)

@router.get("/", response_model=PaginatedOilPumps)
async def get_oil_pumps(
    service: OilPumpServiceDep,
    page: int = Query(1, ge=1, description="Номер страницы"),
    size: int = Query(10, ge=1, le=100, description="Размер страницы"),
    sort_by: str = Query("id", description="Поле для сортировки"),
    sort_desc: bool = Query(False, description="Сортировка по убыванию")
) -> PaginatedOilPumps:
    return service.get_oil_pumps(
        page=page,
        size=size,
        sort_by=sort_by,
        sort_desc=sort_desc
    )


@router.get("/names", response_model=List[str])
async def get_unique_names(
    service: OilPumpServiceDep
) -> List[str]:
    return service.get_all_unique_names()

@router.get("/{pump_id}", response_model=OilPumpRead)
async def get_oil_pump(
    pump_id: int,
    service: OilPumpServiceDep
) -> OilPumpRead:
    return service.get_oil_pump_by_id(pump_id)

@router.patch("/{pump_id}", response_model=OilPumpRead)
async def update_oil_pump(
    pump_id: int,
    pump_data: OilPumpUpdate,
    service: OilPumpServiceDep
) -> OilPumpRead:
    return service.update_oil_pump(pump_id, pump_data)

@router.delete("/{pump_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_oil_pump(
    pump_id: int,
    service: OilPumpServiceDep
):
    service.delete_oil_pump(pump_id) 
