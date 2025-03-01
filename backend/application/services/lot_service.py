import csv
from datetime import datetime
from io import StringIO
import math

from typing import Optional

from fastapi import UploadFile
from starlette.exceptions import HTTPException
from starlette import status

from api.models.oil_pump_models import OilPumpCreate
from application.services.oil_pump_service import OilPumpService
from domain.lot import Lot, LotStatus, OilType
from infrastructure.repositories.lot_repository import LotRepository
from api.models.lot_models import (
    LotCreate, 
    LotUpdate, 
    PaginatedLots, 
    Pagination,
    LotFilter,
    PublicLotFilter
)


class LotService:
    def __init__(self, lot_repository: LotRepository, oil_pump_service: OilPumpService):
        self._repository = lot_repository
        self._oil_pump_service = oil_pump_service

    def create_lot(self, lot_data: LotCreate) -> Lot:
        oil_pump = self._oil_pump_service.get_oil_pump_by_id(lot_data.oil_pump.id)
        if not oil_pump:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Oil pump with id {lot_data.oil_pump.id} not found"
            )

        lot = Lot(
            lot_expiration_date=lot_data.lot_expiration_date,
            ksss_nb_code=lot_data.ksss_nb_code,
            ksss_fuel_code=lot_data.ksss_fuel_code,
            initial_weight=lot_data.initial_weight,
            available_weight=lot_data.available_weight,
            total_price=lot_data.total_price,
            price_per_ton=lot_data.price_per_ton,
            oil_type=lot_data.oil_type,
            oil_pump=oil_pump,
            status=LotStatus.CONFIRMED
        )

        return self._repository.create(lot)
    
    async def upload_from_csv(self, file: UploadFile):
        if not file.filename.endswith('.csv'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be a CSV"
            )

        content = await file.read()
        csv_content = StringIO(content.decode('utf-8'))
        csv_reader = csv.DictReader(csv_content)

        return self._upload_from_csv(csv_reader)

    def _upload_from_csv(self, csv_reader: csv.DictReader):
        created_lots = []
        errors = []

        for row_idx, row in enumerate(csv_reader, start=1):
            try:
                oil_pump = self._oil_pump_service.get_oil_pump_by_name_and_region(row['oil_pump_name'], row['oil_pump_region'])
                if not oil_pump:
                    oil_pump = self._oil_pump_service.create_oil_pump(OilPumpCreate(
                        name=row['oil_pump_name'],
                        region=row['oil_pump_region']
                    ))
                    
                lot_data = LotCreate(
                    lot_expiration_date=datetime.strptime(row['lot_expiration_date'], '%Y-%m-%d').date(),
                    ksss_nb_code=int(row['ksss_nb_code']),
                    ksss_fuel_code=int(row['ksss_fuel_code']),
                    initial_weight=int(row['initial_weight']),
                    available_weight=int(row['initial_weight']),
                    total_price=float(row['price_per_ton']) * float(row['initial_weight']),
                    price_per_ton=float(row['price_per_ton']),
                    oil_type=OilType(row['oil_type']),
                    oil_pump=oil_pump
                )
                
                created_lot = self.create_lot(lot_data)
                created_lots.append(created_lot)
            except Exception as e:
                errors.append(f"Error in row {row_idx}: {str(e)}")

        if errors:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"errors": errors, "created_lots": len(created_lots)}
            )

        return {"message": f"Successfully created {len(created_lots)} lots"}

    def get_lots(
        self,
        page: int = 1,
        size: int = 10,
        filters: Optional[LotFilter] = None,
        sort_by: str = "id",
        sort_desc: bool = False
    ) -> PaginatedLots:
        filters_dict = filters.model_dump(exclude_none=True) if filters else None
        lots, total_count = self._repository.get_many(
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

        return PaginatedLots(
            items=lots,
            pagination=pagination
        )

    def get_lot_by_id(self, lot_id: int) -> Lot:
        lot = self._repository.get_by_id(lot_id)
        if not lot:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Lot with id {lot_id} not found"
            )
        return lot

    def update_lot(self, lot_id: int, lot_data: LotUpdate) -> Lot:
        lot = self.get_lot_by_id(lot_id)

        if lot.status == LotStatus.SOLD:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot update sold lot"
            )

        updated_lot = self._repository.update(
            lot_id, 
            lot_data.model_dump(exclude_unset=True)
        )
        return updated_lot

    def delete_lot(self, lot_id: int) -> None:
        self._repository.delete(lot_id)

    
    def get_active_lots(
        self,
        page: int = 1,
        size: int = 10,
        sort_by: str = "id",
        sort_desc: bool = False,
        filters: PublicLotFilter = None
    ) -> PaginatedLots:
        filters_dict = filters.model_dump(exclude_none=True) if filters else None
        filters_dict["status"] = LotStatus.CONFIRMED

        lots, total_count = self._repository.get_many(
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

        return PaginatedLots(
            items=lots,
            pagination=pagination
        )

    def update_expired_lots(self) -> dict:
        updated_count = self._repository.update_expired_lots()
        return {
            "message": f"Updated {updated_count} expired lots to INACTIVE status",
            "updated_count": updated_count
        }
