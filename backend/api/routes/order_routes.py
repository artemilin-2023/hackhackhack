from typing import List
from fastapi import APIRouter

from api.requests.order_models import OrderCreate, OrderRead, OrderUpdate
from dependencies import OrderServiceDep

router = APIRouter(
    tags=["orders"],
    prefix="/orders"
)


@router.post("/", response_model=OrderRead)
async def create_order(
    order: OrderCreate,
    order_service: OrderServiceDep
):
    return order_service.create_order(order)


@router.get("/{order_id}", response_model=OrderRead)
async def get_order(
    order_id: int,
    order_service: OrderServiceDep
):
    return order_service.get_order(order_id)


@router.get("/", response_model=List[OrderRead])
async def list_orders(
    order_service: OrderServiceDep,
    skip: int = 0,
    limit: int = 100
):
    return order_service.list_orders(skip=skip, limit=limit)


@router.put("/{order_id}", response_model=OrderRead)
async def update_order(
    order_id: int,
    order: OrderUpdate,
    order_service: OrderServiceDep
):
    return order_service.update_order(order_id, order)


@router.delete("/{order_id}", response_model=OrderRead)
async def delete_order(
    order_id: int,
    order_service: OrderServiceDep
):
    return order_service.delete_order(order_id)
