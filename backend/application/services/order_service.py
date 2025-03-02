from fastapi import HTTPException
from starlette import status
from starlette.requests import Request
import math
from typing import Optional
from datetime import date

from application.services.user_services import UserService
from domain.user import Role
from infrastructure.repositories.order_repository import OrderRepository
from domain.order import Order, OrderStatus
from api.models.order_models import OrdersCreate, PaginatedOrders
from api.models.lot_models import Pagination
from domain.lot import Lot, LotStatus
from infrastructure.repositories.lot_repository import LotRepository
from api.models.order_models import OrderFilter


class OrderService:
    def __init__(self, order_repository: OrderRepository, lot_repository: LotRepository, user_service: UserService):
        self._order_repository = order_repository
        self._lot_repository = lot_repository
        self._user_service = user_service
    
    def create_order(self, request: Request, order_data: OrdersCreate):
        lots_in_order = []
        
        for order in order_data.orders:
            lot = self._lot_repository.get_by_id(order.lot_id)
            if not lot:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Lot with id {order.lot_id} not found"
                )

            if lot.status != LotStatus.CONFIRMED:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cannot create order for non-active lot"
                )

            if lot.available_weight < order.volume:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Requested volume exceeds available weight. Available: {lot.available_weight}"
                )

            user = self._user_service.get_current_user(request)
            order = Order(
                order_date=date.today(),
                lot_id=lot.id,
                volume=order.volume,
                delivery_type=order.delivery_type,
                customer_id=user.id,
                status=OrderStatus.PENDING
            )

            if lot.available_weight < order.volume:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Not enough available weight in the lot"
                )

            lot.available_weight -= order.volume
            lot = self._lot_repository.update(lot.id, {"available_weight": lot.available_weight})

            if lot.available_weight == 0:
                lot = self._lot_repository.update(lot.id, {"status": LotStatus.SOLD})
            
            lots_in_order.append(lot.model_dump())
            self._order_repository.create(order)

        if not lots_in_order:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No lots in order"
            )
        
        return lots_in_order

        

    def get_lots_by_user(
        self,
        request: Request,
        page: int = 1,
        size: int = 10,
        filters: Optional[OrderFilter] = None,
        sort_by: str = "id",
        sort_desc: bool = False,
    ):
        filters_dict = filters.model_dump(exclude_none=True) if filters else {}
        
        user = self._user_service.get_current_user(request)
        if user.role != Role.admin:
            filters_dict["customer_id"] = user.id
        
        lots, total_count = self._order_repository.get_many_lots_by_customer(
            customer_id=user.id,
            page=page,
            size=size,
            filters=filters_dict,
            sort_by=sort_by,
            sort_desc=sort_desc
        )

        total_pages = math.ceil(total_count / size)
        has_next = page < total_pages
        has_prev = page > 1

        pagination = Pagination(
            total_pages=total_pages,
            current_page=page,
            has_next=has_next,
            has_prev=has_prev,
            total_items=total_count,
            page_size=size
        )

        return PaginatedOrders(
            items=lots,
            pagination=pagination
        )

    def get_order_by_id(self, order_id: int) -> Order:
        order = self._order_repository.get_by_id(order_id)
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Order with id {order_id} not found"
            )

        user = self._user_service.get_current_user()
        if user.role != Role.ADMIN and order.customer_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access this order"
            )

        return order
