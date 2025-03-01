from typing import Optional
from fastapi import APIRouter, File, Query, UploadFile
from starlette import status

from api.models.lot_models import (
    LotCreate,
    LotRead,
    PaginatedLots,
    LotUpdate,
    LotFilter,
    PublicLotFilter
)
from dependencies import LotServiceDep
from domain.lot import LotStatus, OilType

router = APIRouter(
    prefix="/lots",
    tags=["lots"]
)

@router.post("/update-expired", status_code=status.HTTP_200_OK)
async def update_expired_lots(
    service: LotServiceDep
):
    return service.update_expired_lots()

@router.post("/", response_model=LotRead, status_code=status.HTTP_201_CREATED)
async def create_lot(
    lot_data: LotCreate,
    service: LotServiceDep
) -> LotRead:
    return service.create_lot(lot_data)

@router.post("/upload", status_code=status.HTTP_204_NO_CONTENT)
async def upload_lots(
    service: LotServiceDep,
    file: UploadFile = File(...),
):
    return await service.upload_from_csv(file)

@router.get("/", response_model=PaginatedLots)
async def get_lots(
    service: LotServiceDep,
    search: Optional[str] = Query(None, description="Поиск по названию нефтебазы, региону, типу топлива"),
    page: int = Query(1, ge=1, description="Номер страницы"),
    size: int = Query(10, ge=1, le=100, description="Размер страницы"),
    sort_by: str = Query("id", description="Поле для сортировки"),
    sort_desc: bool = Query(False, description="Сортировка по убыванию"),
    status: Optional[LotStatus] = Query(None, description="Фильтр по статусу"),
    oil_type: Optional[OilType] = Query(None, description="Фильтр по типу топлива"),
    min_price: Optional[float] = Query(None, description="Минимальная цена"),
    max_price: Optional[float] = Query(None, description="Максимальная цена"),
    region: Optional[str] = Query(None, description="Фильтр по региону"),
    oil_pump_name: Optional[str] = Query(None, description="Фильтр по названию нефтебазы"),
    available_weight_min: Optional[int] = Query(None, description="Минимальный доступный вес")
) -> PaginatedLots:
    filters = LotFilter(
        status=status,
        oil_type=oil_type,
        min_price=min_price,
        max_price=max_price,
        region=region,
        oil_pump_name=oil_pump_name,
        available_weight_min=available_weight_min,
        search=search
    )
    
    return service.get_lots(
        page=page,
        size=size,
        filters=filters,
        sort_by=sort_by,
        sort_desc=sort_desc
    )

@router.get("/active", response_model=PaginatedLots)
async def get_active_lots(
    service: LotServiceDep,
    search: Optional[str] = Query(None, description="Поиск по названию нефтебазы, региону, типу топлива"),
    page: int = Query(1, ge=1, description="Номер страницы"),
    size: int = Query(10, ge=1, le=100, description="Размер страницы"),
    sort_by: str = Query("id", description="Поле для сортировки"),
    sort_desc: bool = Query(False, description="Сортировка по убыванию"),
    oil_type: Optional[OilType] = Query(None, description="Фильтр по типу топлива"),
    min_price: Optional[float] = Query(None, description="Минимальная цена"),
    max_price: Optional[float] = Query(None, description="Максимальная цена"),
    region: Optional[str] = Query(None, description="Фильтр по региону"),
    oil_pump_name: Optional[str] = Query(None, description="Фильтр по названию нефтебазы"),
    available_weight_min: Optional[int] = Query(None, description="Минимальный доступный вес")
) -> PaginatedLots:
    filters = PublicLotFilter(
        oil_type=oil_type,
        min_price=min_price,
        max_price=max_price,
        region=region,
        oil_pump_name=oil_pump_name,
        available_weight_min=available_weight_min,
        search=search
    )
    return service.get_active_lots(
        page=page,
        size=size,
        sort_by=sort_by,
        sort_desc=sort_desc,
        filters=filters
    )

@router.get("/{lot_id}", response_model=LotRead)
async def get_lot(
    lot_id: int,
    service: LotServiceDep
) -> LotRead:
    return service.get_lot_by_id(lot_id)

@router.patch("/{lot_id}", response_model=LotRead)
async def update_lot(
    lot_id: int,
    lot_data: LotUpdate,
    service: LotServiceDep
) -> LotRead:
    return service.update_lot(lot_id, lot_data)

@router.delete("/{lot_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_lot(
    lot_id: int,
    service: LotServiceDep
):
    service.delete_lot(lot_id)
