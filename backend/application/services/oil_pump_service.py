import math
from typing import Optional
from fastapi import HTTPException
from starlette import status

from domain.lot import OilPump
from infrastructure.repositories.oil_pump_repository import OilPumpRepository
from api.models.oil_pump_models import (
    OilPumpCreate,
    OilPumpUpdate,
    PaginatedOilPumps,
    Pagination
)

class OilPumpService:
    def __init__(self, oil_pump_repository: OilPumpRepository):
        self._repository = oil_pump_repository

    def create_oil_pump(self, pump_data: OilPumpCreate) -> OilPump:
        pump = OilPump(**pump_data.model_dump())
        return self._repository.create(pump)

    def get_oil_pumps(
        self,
        page: int = 1,
        size: int = 10,
        sort_by: str = "id",
        sort_desc: bool = False
    ) -> PaginatedOilPumps:
        pumps, total_count = self._repository.get_many(
            page=page,
            size=size,
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

        return PaginatedOilPumps(
            items=pumps,
            pagination=pagination
        )

    def get_oil_pump_by_id(self, pump_id: int) -> OilPump:
        pump = self._repository.get_by_id(pump_id)
        if not pump:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Oil pump with id {pump_id} not found"
            )
        return pump

    def update_oil_pump(self, pump_id: int, pump_data: OilPumpUpdate) -> OilPump:
        updated_pump = self._repository.update(
            pump_id,
            pump_data.model_dump(exclude_unset=True)
        )
        if not updated_pump:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Oil pump with id {pump_id} not found"
            )
        return updated_pump

    def delete_oil_pump(self, pump_id: int) -> None:
        if not self._repository.delete(pump_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Oil pump with id {pump_id} not found"
            ) 