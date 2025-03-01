from fastapi import Depends
from sqlalchemy.orm import Session

from api.database import get_db
from api.services.order_service import OrderService


def get_order_service(db: Session = Depends(get_db)) -> OrderService:
    return OrderService(db) 