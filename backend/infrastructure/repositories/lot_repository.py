from typing import Optional, List, Dict, Any, Tuple
from sqlalchemy import Tuple, func, or_
from sqlmodel import Session, select, desc, asc, or_
from domain.lot import Lot, LotStatus, OilPump, OilType
from datetime import date


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
    ):
        query = select(Lot)

        if filters:
            if "search" in filters and filters["search"]:
                search_term = filters["search"]
                search_pattern = f"%{search_term}%"
                
                query = query.join(OilPump).where(
                    or_(
                        OilPump.region.ilike(search_pattern),
                        OilPump.name.ilike(search_pattern),
                        Lot.oil_type.in_([ot for ot in OilType if search_term.lower() in ot.value.lower()]),
                        Lot.ksss_fuel_code == search_term,
                        Lot.ksss_nb_code == search_term
                    )
                )
            if "status" in filters:
                query = query.where(Lot.status == filters["status"])
            if "oil_type" in filters:
                query = query.where(Lot.oil_type == filters["oil_type"])
            if "min_price" in filters:
                query = query.where(Lot.price_per_ton >= filters["min_price"])
            if "max_price" in filters:
                query = query.where(Lot.price_per_ton <= filters["max_price"])
            if "region" in filters:
                query = query.join(OilPump, isouter=True).where(OilPump.region == filters["region"])
            if "oil_pump_name" in filters:
                query = query.join(OilPump, isouter=True).where(OilPump.name == filters["oil_pump_name"])
            if "available_weight_min" in filters:
                query = query.where(Lot.available_weight >= filters["available_weight_min"])

        total_count = len(self.session.exec(query).all())

        sort_column = getattr(Lot, sort_by, Lot.id)
        query = query.order_by(desc(sort_column) if sort_desc else asc(sort_column))

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

    def update_expired_lots(self) -> int:
        today = date.today()
        
        query = select(Lot).where(
            Lot.status == LotStatus.CONFIRMED,
            Lot.lot_expiration_date < today
        )
        
        expired_lots = self.session.exec(query).all()
        
        for lot in expired_lots:
            lot.status = LotStatus.INACTIVE
            self.session.add(lot)
        
        self.session.commit()
        return len(expired_lots)
