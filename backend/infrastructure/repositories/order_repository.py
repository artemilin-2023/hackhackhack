from typing import Sequence, Union, List, Optional, Dict, Any

from sqlmodel import Session, select
from domain.order import Order
from infrastructure.database import get_session


class OrderRepository:

    def __init__(self, session: Session):
        self._session = session

    def create_order(self, order: Order) -> Order:
        self._session.add(order)
        self._session.commit()
        self._session.refresh(order)
        return order

    def update_order(self, order: Order, update_dict: Dict[str, Any]) -> Order:
        for key, value in update_dict.items():
            setattr(order, key, value)
        self._session.add(order)
        self._session.commit()
        self._session.refresh(order)
        return order

    def get_orders_by_user(self, user_id: int, page: int = 1, page_size: int = 10) -> List[Order]:
        statement = select(Order).where(Order.buyer_id == user_id).offset((page - 1) * page_size).limit(page_size)
        return self._session.exec(statement).all()

    def get_by_id(self, order_id: int) -> Optional[Order]:
        return self._session.get(Order, order_id)

    def count_orders_by_user(self, user_id: int) -> int:
        statement = select(Order).where(Order.buyer_id == user_id)
        return len(self._session.exec(statement).all())

    def delete(self, order: Order):
        self._session.delete(order)
        self._session.commit()
