from sqlalchemy import func
from sqlmodel import Session, select
from domain.lot import Lot


class LotRepository:
    def __init__(self, session: Session):
        self._session = session

    def create_lot(self, lot: Lot):
        self._session.add(lot)
        self._session.commit()
        self._session.refresh(lot)
        return lot

    def get_all_lots(self, page_number: int = 1, page_size: int = 10):
        statement = select(Lot).offset((page_number - 1) * page_size).limit(page_size)
        return self._session.exec(statement).all()

    def get_lot_by_id(self, lot_id: int):
        return self._session.query(Lot).filter_by(id=lot_id).first()

    def update_lot(self, lot: Lot, lot_data):
        for key, value in lot_data.items():
            setattr(lot, key, value)
        self._session.add(lot)
        self._session.commit()
        self._session.refresh(lot)
        return lot

    def delete_lot(self, lot: Lot):
        self._session.delete(lot)
        self._session.commit()

    def count_lots(self):
        return self._session.exec(
            select(func.count(Lot.id))
        ).one()
