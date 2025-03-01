from typing import Optional, List, Dict, Any
from sqlalchemy import func
from sqlmodel import Session, select, desc, asc
from domain.lot import Lot, LotStatus, OilPump, OilType


class LotRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, lot: Lot) -> Lot:
        self.session.add(lot)
        self.session.commit()
        self.session.refresh(lot)
        return lot

    def get_by_id(self, lot_id: int) -> Optional[Lot]:
        return self.session.get(Lot, lot_id)

    def get_many(
        self,
        page: int = 1,
        size: int = 10,
        filters: Optional[Dict[str, Any]] = None,
        sort_by: str = "id",
        sort_desc: bool = False
    ) -> tuple[List[Lot], int]:
        query = select(Lot)

        # Применяем фильтры
        if filters:
            if "status" in filters:
                query = query.where(Lot.status == filters["status"])
            if "oil_type" in filters:
                query = query.where(Lot.oil_type == filters["oil_type"])
            if "min_price" in filters:
                query = query.where(Lot.price_per_ton >= filters["min_price"])
            if "max_price" in filters:
                query = query.where(Lot.price_per_ton <= filters["max_price"])
            if "region" in filters:
                query = query.join(OilPump).where(OilPump.region == filters["region"])
            if "available_weight_min" in filters:
                query = query.where(Lot.available_weight >= filters["available_weight_min"])

        sort_column = getattr(Lot, sort_by, Lot.id)
        query = query.order_by(desc(sort_column) if sort_desc else asc(sort_column))

        total_count = self.session.exec(select(Lot)).all().__len__()

        query = query.offset((page - 1) * size).limit(size)

        lots = self.session.exec(query).all()
        return lots, total_count

    def update(self, lot_id: int, lot_data: Dict[str, Any]) -> Optional[Lot]:
        lot = self.get_by_id(lot_id)
        if not lot:
            return None

        for key, value in lot_data.items():
            if hasattr(lot, key) and value is not None:
                setattr(lot, key, value)

        self.session.add(lot)
        self.session.commit()
        self.session.refresh(lot)
        return lot

    def delete(self, lot_id: int) -> bool:
        lot = self.get_by_id(lot_id)
        if not lot:
            return False

        self.session.delete(lot)
        self.session.commit()
        return True

    def get_by_status(self, status: LotStatus) -> List[Lot]:
        query = select(Lot).where(Lot.status == status)
        return self.session.exec(query).all()

    def get_by_oil_type(self, oil_type: OilType) -> List[Lot]:
        query = select(Lot).where(Lot.oil_type == oil_type)
        return self.session.exec(query).all()

    def get_active_lots(self) -> List[Lot]:
        query = select(Lot).where(Lot.status != LotStatus.SOLD)\
                          .where(Lot.status != LotStatus.INACTIVE)
        return self.session.exec(query).all()

    def get_all_lots(self, page_number: int = 1, page_size: int = 10):
        statement = select(Lot).offset((page_number - 1) * page_size).limit(page_size)
        return self.session.exec(statement).all()

    def update_lot(self, lot: Lot, lot_data):
        for key, value in lot_data.items():
            setattr(lot, key, value)
        self.session.add(lot)
        self.session.commit()
        self.session.refresh(lot)
        return lot

    def delete_lot(self, lot: Lot):
        self.session.delete(lot)
        self.session.commit()

    def count_lots(self):
        return self.session.exec(
            select(func.count(Lot.id))
        ).one()
