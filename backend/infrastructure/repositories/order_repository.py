from typing import Optional, List, Dict, Any, Tuple
from sqlalchemy import func
from sqlmodel import Session, select, desc, asc, or_
from domain.order import Order, OrderStatus
from domain.lot import Lot
from domain.user import User
from datetime import date


class OrderRepository:

    def __init__(self, session: Session):
        self._session = session

    def create(self, order: Order) -> Order:
        self._session.add(order)
        self._session.commit()
        self._session.refresh(order)
        return order

    def get_by_id(self, order_id: int) -> Optional[Order]:
        return self._session.get(Order, order_id)

    def get_many(
        self,
        page: int = 1,
        size: int = 10,
        filters: Optional[Dict[str, Any]] = None,
        sort_by: str = "id",
        sort_desc: bool = False
    ) -> Tuple[List[Order], int]:
        query = select(Order)

        if filters:
            if "search" in filters and filters["search"]:
                search_term = filters["search"]
                search_pattern = f"%{search_term}%"
                query = query.join(Lot).join(User).where(
                    or_(
                        User.name.ilike(search_pattern),
                        User.email.ilike(search_pattern),
                        Order.delivery_type.ilike(search_pattern)
                    )
                )
            if "lot_id" in filters:
                query = query.where(Order.lot_id == filters["lot_id"])
            if "min_volume" in filters:
                query = query.where(Order.volume >= filters["min_volume"])
            if "max_volume" in filters:
                query = query.where(Order.volume <= filters["max_volume"])
            if "start_date" in filters:
                query = query.where(Order.order_date >= filters["start_date"])
            if "end_date" in filters:
                query = query.where(Order.order_date <= filters["end_date"])
            if "delivery_type" in filters:
                query = query.where(Order.delivery_type == filters["delivery_type"])

        total_count = len(self._session.exec(query).all())

        sort_column = getattr(Order, sort_by, Order.id)
        query = query.order_by(desc(sort_column) if sort_desc else asc(sort_column))

        query = query.offset((page - 1) * size).limit(size)
        
        orders = self._session.exec(query).all()
        return orders, total_count

    def update(self, order_id: int, order_data: Dict[str, Any]) -> Optional[Order]:
        order = self.get_by_id(order_id)
        if not order:
            return None

        for key, value in order_data.items():
            if hasattr(order, key) and value is not None:
                setattr(order, key, value)

        self._session.add(order)
        self._session.commit()
        self._session.refresh(order)
        return order

    def delete(self, order_id: int) -> bool:
        order = self.get_by_id(order_id)
        if not order:
            return False

        self._session.delete(order)
        self._session.commit()
        return True

    def get_by_status(self, status: OrderStatus) -> List[Order]:
        query = select(Order).where(Order.status == status)
        return self._session.exec(query).all()

    def get_by_customer(self, customer_id: int) -> List[Order]:
        query = select(Order).where(Order.customer_id == customer_id)
        return self._session.exec(query).all()

    def get_by_lot(self, lot_id: int) -> List[Order]:
        query = select(Order).where(Order.lot_id == lot_id)
        return self._session.exec(query).all()

    def count_orders(self) -> int:
        return self._session.exec(
            select(func.count(Order.id))
        ).one()

    def get_orders_by_date_range(self, start_date: date, end_date: date) -> List[Order]:
        query = select(Order).where(
            Order.order_date >= start_date,
            Order.order_date <= end_date
        )
        return self._session.exec(query).all()

    def get_pending_orders(self) -> List[Order]:
        return self.get_by_status(OrderStatus.PENDING)

    def complete_order(self, order_id: int) -> Optional[Order]:
        order = self.get_by_id(order_id)
        if not order or order.status != OrderStatus.PENDING:
            return None

        lot = self._session.get(Lot, order.lot_id)
        if not lot:
            return None

        if lot.available_weight < order.volume:
            return None
        
        lot.available_weight -= order.volume
        
        if lot.available_weight <= 0:
            lot.status = "SOLD"
        
        order.status = OrderStatus.COMPLETED
        
        self._session.add(lot)
        self._session.add(order)
        self._session.commit()
        self._session.refresh(order)
        
        return order

    def cancel_order(self, order_id: int) -> Optional[Order]:
        order = self.get_by_id(order_id)
        if not order or order.status != OrderStatus.PENDING:
            return None

        order.status = OrderStatus.CANCELED
        self._session.add(order)
        self._session.commit()
        self._session.refresh(order)
        
        return order
