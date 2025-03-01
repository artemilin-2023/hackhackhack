import math
from typing import Optional

from starlette.exceptions import HTTPException
from starlette import status

from application.services.user_services import UserService
from domain.lot import Lot, LotStatus
from infrastructure.repositories.lot_repository import LotRepository
from api.requests.lot_models import (
    LotCreate, 
    LotUpdate, 
    PaginatedLots, 
    Pagination,
    LotFilter
)


class LotService:
    def __init__(self, lot_repository: LotRepository, user_service: UserService):
        self._repository = lot_repository

    def create_lot(self, lot_data: LotCreate) -> Lot:
        lot = Lot(**lot_data.model_dump())
        return self._repository.create(lot)

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

    def get_active_lots(self) -> list[Lot]:
        return self._repository.get_active_lots()
