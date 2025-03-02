import asyncio
from typing import List, Optional
from fastapi import APIRouter, Query, Request
from starlette import status
from datetime import date
from common.logger import log
from api.models.order_models import (
    OrdersCreate,
    PaginatedOrders,
    OrderFilter
)
from dependencies import OrderServiceDep
from domain.order import OrderStatus
from domain.lot import Lot

router = APIRouter(
    prefix="/api/orders",
    tags=["orders"]
)

@router.post("/", response_model=List[Lot], status_code=status.HTTP_201_CREATED)
async def create_order(
    request: Request,
    order_data: OrdersCreate,
    order_service: OrderServiceDep,
):
    data = order_service.create_order(request, order_data)
    return data

@router.get("/my", response_model=PaginatedOrders)
async def get_orders(
    request: Request,
    order_service: OrderServiceDep,
    page: int = Query(1, ge=1, description="Номер страницы"),
    size: int = Query(10, ge=1, le=100, description="Размер страницы"),
    sort_by: str = Query("id", description="Поле для сортировки"),
    sort_desc: bool = Query(False, description="Сортировка по убыванию"),
    status: Optional[OrderStatus] = Query(None, description="Фильтр по статусу"),
    min_volume: Optional[float] = Query(None, description="Минимальный объем"),
    max_volume: Optional[float] = Query(None, description="Максимальный объем"),
    start_date: Optional[date] = Query(None, description="Начальная дата"),
    end_date: Optional[date] = Query(None, description="Конечная дата"),
    delivery_type: Optional[str] = Query(None, description="Тип доставки"),
):    
    filters = OrderFilter(
        status=status,
        min_volume=min_volume,
        max_volume=max_volume,
        start_date=start_date,
        end_date=end_date,
        delivery_type=delivery_type
    )
    
    return order_service.get_lots_by_user(
        request=request,
        page=page,
        size=size,
        filters=filters,
        sort_by=sort_by,
        sort_desc=sort_desc,
    )

