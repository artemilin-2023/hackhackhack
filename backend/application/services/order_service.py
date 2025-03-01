from fastapi import HTTPException
from starlette import status
from starlette.requests import Request

from application.services.user_services import UserService
from domain.user import Role
from infrastructure.repositories.order_repository import OrderRepository
from domain.order import Order, OrderStatus
from api.requests.order_models import OrderCreate, OrderUpdate


class OrderService:

    def __init__(self, order_repository: OrderRepository, user_service: UserService):
        self._order_repository = order_repository
        self._user_service = user_service

    def create_order(self, order_create: OrderCreate):
        total_price = order_create.quantity * order_create.price_per_unit
        order = Order(
            buyer_id=order_create.buyer_id,
            seller_id=order_create.seller_id,
            lot_id=order_create.lot_id,
            quantity=order_create.quantity,
            price_per_unit=order_create.price_per_unit,
            total_price=total_price,
            status=OrderStatus.pending
        )
        return self._order_repository.create_order(order)

    def update_order_status(self, order_id: int, order_update: OrderUpdate):
        order = self._order_repository.get_by_id(order_id)
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="This order was not found"
            )

        return self._order_repository.update_order(order, order_update.dict(exclude_unset=True))

    def get_orders_by_user(self, request: Request):
        user = self._user_service.get_current_user(request)
        return self._order_repository.get_orders_by_user(user.id)

    def delete_order(self, order_id: int, request: Request):
        user = self._user_service.get_current_user(request)
        order = self._order_repository.get_by_id(order_id)

        if order.customer_id == user.id and order.status != OrderStatus.pending:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can cancel an order only if it is still pending."
            )

        if order.seller_id != user.id and user.role != Role.admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can cancel an order only if you are the seller of that order."
            )

        self._order_repository.delete(order)
