from typing import Sequence, Union

from sqlmodel import Session, select
from domain.order import Order


class OrderRepository:

    def __init__(self, session: Session):
        self._session = session

    def create_order(self, order: Order):
        self._session.add(order)
        self._session.commit()
        self._session.refresh(order)
        return order

    def update_order(self, order: Order, order_data: dict):
        for key, value in order_data.items():
            setattr(order, key, value)
        self._session.add(order)
        self._session.commit()
        self._session.refresh(order)
        return order

    def get_orders_by_user(self, user_id: int) -> Sequence[Order]:
        statement = select(Order).where((Order.customer_id == user_id) | (Order.seller_id == user_id))
        return self._session.exec(statement).all()

    def get_by_id(self, id: int) -> Union[Order]:
        return self._session.query(Order).filter_by(id=id).first()

    def delete(self, order: Order):
        self._session.delete(order)
        self._session.commit()
