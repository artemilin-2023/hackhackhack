# from typing import List
# from fastapi import APIRouter, Depends
# from starlette.requests import Request

# from api.requests.order_models import OrderCreate, OrderRead, OrderUpdate, PaginatedOrders
# from application.services.order_service import OrderService
# from dependencies import get_order_service

# router = APIRouter(
#     tags=["orders"],
#     prefix="/orders"
# )


# @router.post("/", response_model=OrderRead)
# async def create_order(
#     order: OrderCreate, request: Request,
#     order_service: OrderService = Depends(get_order_service)
# ):
#     return order_service.create_order(order, request)


# @router.get("/{order_id}", response_model=OrderRead)
# async def get_order(
#     order_id: int,
#     order_service: OrderService = Depends(get_order_service)
# ):
#     return order_service.get_order(order_id)


# @router.get("/", response_model=PaginatedOrders)
# async def get_all_orders(
#     page: int = 1,
#     page_size: int = 10,
#     order_service: OrderService = Depends(get_order_service)
# ):
#     return order_service.get_all_orders(page, page_size)


# @router.get("/my")
# async def get_my_orders(
#     request: Request,
#     order_service: OrderService = Depends(get_order_service)
# ):
#     return order_service.get_orders_by_user(request)


# @router.patch("/{order_id}", response_model=OrderRead)
# async def update_order_status(
#     order_id: int,
#     order_update: OrderUpdate,
#     order_service: OrderService = Depends(get_order_service)
# ):
#     return order_service.update_order_status(order_id, order_update)


# @router.delete("/{order_id}", response_model=OrderRead)
# async def delete_order(
#     order_id: int,
#     request: Request,
#     order_service: OrderService = Depends(get_order_service)
# ):
#     return order_service.delete_order(order_id, request)
