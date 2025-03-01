from fastapi import HTTPException
from starlette import status
from starlette.requests import Request
import math

from application.services.user_services import UserService
from domain.user import Role
from infrastructure.repositories.order_repository import OrderRepository
from domain.order import Order, OrderStatus
from api.models.order_models import OrderCreate, OrderUpdateStatus, PaginatedOrders
from api.models.lot_models import Pagination


class OrderService:
    pass
    # def __init__(self, order_repository: OrderRepository, user_service: UserService):
    #     self._order_repository = order_repository
    #     self._user_service = user_service

    # def create_order(self, order_create: OrderCreate, request: Request):
    #     user = self._user_service.get_current_user(request)
    #     if user.role != Role.customer:
    #         raise HTTPException(status_code=403, detail="You are not a customer")
        
    #     total_price = order_create.quantity * order_create.price_per_unit
    #     order = Order(
    #         customer_id=user.id,
    #         seller_id=order_create.seller_id,
    #         lot_id=order_create.lot_id,
    #         quantity=order_create.quantity,
    #         price_per_unit=order_create.price_per_unit,
    #         total_price=total_price,
    #         status=OrderStatus.pending
    #     )
    #     return self._order_repository.create_order(order)

    # def get_all_orders_by_user(self, request: Request, page_number: int = 1, page_size: int = 10) -> PaginatedOrders:
    #     user = self._user_service.get_current_user(request)
    #     orders = self._order_repository.get_orders_by_user(user.id, page_number, page_size)
    #     total_orders = self._order_repository.count_orders_by_user(user.id)
    #     total_pages = math.ceil(total_orders / page_size)
    #     has_next = page_number < total_pages
    #     has_prev = page_number > 1
        
    #     pagination = Pagination(
    #         total_pages=total_pages,
    #         current_page=page_number,
    #         has_next=has_next,
    #         has_prev=has_prev,
    #     )
    #     return PaginatedOrders(orders=orders, pagination=pagination)

    # def update_order_status(self, order_id: int, order_update: OrderUpdateStatus, request: Request):
    #     user = self._user_service.get_current_user(request)
    #     order = self._order_repository.get_by_id(order_id)
        
    #     if not order:
    #         raise HTTPException(
    #             status_code=status.HTTP_404_NOT_FOUND,
    #             detail="This order was not found"
    #         )

    #     if user.role == Role.customer and order.customer_id != user.id:
    #         raise HTTPException(
    #             status_code=status.HTTP_403_FORBIDDEN,
    #             detail="You can only update your own orders"
    #         )

    #     if user.role == Role.seller and order.seller_id != user.id:
    #         raise HTTPException(
    #             status_code=status.HTTP_403_FORBIDDEN, 
    #             detail="You can only update orders where you are the seller"
    #         )

    #     if order.status == OrderStatus.cancelled:
    #         raise HTTPException(
    #             status_code=status.HTTP_400_BAD_REQUEST,
    #             detail="Cannot update cancelled order"
    #         )

    #     if user.role == Role.customer and order_update.status not in [OrderStatus.cancelled]:
    #         raise HTTPException(
    #             status_code=status.HTTP_403_FORBIDDEN,
    #             detail="Customer can only cancel order"
    #         )

    #     if user.role == Role.seller and order_update.status not in [OrderStatus.accepted, OrderStatus.rejected]:
    #         raise HTTPException(
    #             status_code=status.HTTP_403_FORBIDDEN,
    #             detail="Seller can only accept or reject order"
    #         )

    #     return self._order_repository.update_order(order, {"status": order_update.status})

    # def delete_order(self, order_id: int, request: Request):
    #     user = self._user_service.get_current_user(request)
    #     order = self._order_repository.get_by_id(order_id)

    #     if order.customer_id == user.id and order.status != OrderStatus.pending:
    #         raise HTTPException(
    #             status_code=status.HTTP_403_FORBIDDEN,
    #             detail="You can cancel an order only if it is still pending."
    #         )

    #     if order.seller_id != user.id and user.role != Role.admin:
    #         raise HTTPException(
    #             status_code=status.HTTP_403_FORBIDDEN,
    #             detail="You can cancel an order only if you are the seller of that order."
    #         )

    #     self._order_repository.delete(order)
