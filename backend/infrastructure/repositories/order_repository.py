from typing import Optional, List, Dict, Any, Tuple
from sqlalchemy import func
from sqlmodel import Session, select, desc, asc
from domain.order import Order


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

    def get_many_lots_by_customer(
        self,
        customer_id: int,
        page: int = 1,
        size: int = 10,
        filters: Optional[Dict[str, Any]] = None,
        sort_by: str = "id",
        sort_desc: bool = False,
    ) -> Tuple[List[Order], int]:
        query = select(Order).where(Order.customer_id == customer_id)

        if filters:
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
            if "status" in filters:
                query = query.where(Order.status == filters["status"])
            if "customer_id" in filters:
                query = query.where(Order.customer_id == filters["customer_id"])

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
