from typing import Optional, List, Dict, Any, Tuple
from sqlmodel import Session, select, desc, asc
from domain.lot import OilPump

class OilPumpRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, oil_pump: OilPump) -> OilPump:
        self.session.add(oil_pump)
        self.session.commit()
        self.session.refresh(oil_pump)
        return oil_pump

    def get_by_id(self, pump_id: int) -> Optional[OilPump]:
        return self.session.get(OilPump, pump_id)
    
    def get_by_name_and_region(self, name: str, region: str) -> Optional[OilPump]:
        return self.session.exec(select(OilPump).where(OilPump.name == name, OilPump.region == region)).first()

    def get_many(
        self,
        page: int = 1,
        size: int = 10,
        sort_by: str = "id",
        sort_desc: bool = False
    ) -> Tuple[List[OilPump], int]:
        query = select(OilPump)

        sort_column = getattr(OilPump, sort_by, OilPump.id)
        query = query.order_by(desc(sort_column) if sort_desc else asc(sort_column))

        total_count = self.session.exec(select(OilPump)).all().__len__()

        query = query.offset((page - 1) * size).limit(size)
        
        pumps = self.session.exec(query).all()
        return pumps, total_count

    def update(self, pump_id: int, pump_data: Dict[str, Any]) -> Optional[OilPump]:
        pump = self.get_by_id(pump_id)
        if not pump:
            return None

        for key, value in pump_data.items():
            if hasattr(pump, key) and value is not None:
                setattr(pump, key, value)

        self.session.add(pump)
        self.session.commit()
        self.session.refresh(pump)
        return pump

    def delete(self, pump_id: int) -> bool:
        pump = self.get_by_id(pump_id)
        if not pump:
            return False

        self.session.delete(pump)
        self.session.commit()
        return True 