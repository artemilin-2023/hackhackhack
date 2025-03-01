import math
from typing import Union

from starlette.exceptions import HTTPException
from starlette.requests import Request

from application.services.user_services import UserService
from domain.lot import Lot
from infrastructure.repositories.lot_repository import LotRepository
from api.requests.lot_models import LotCreate, LotUpdate, PaginatedLots, Pagination


class LotService:
    def __init__(self, lot_repository: LotRepository, user_service: UserService):
        self._lot_repository = lot_repository
        self._user_service = user_service

    def create_lot(self, lot_create: LotCreate, request: Request):
        user = self._user_service.get_current_user(request)
        lot = Lot(**lot_create.dict(), seller_id=user.id)
        return self._lot_repository.create_lot(lot)

    def get_all_lots(self, page_number: int = 1, page_size: int = 10) -> PaginatedLots:
        lots = self._lot_repository.get_all_lots(page_number, page_size)
        total_lots = self._lot_repository.count_lots()
        total_pages = math.ceil(total_lots / page_size)
        has_next = page_number < total_pages
        has_prev = page_number > 1
        pagination = Pagination(
            total_pages=total_pages,
            current_page=page_number,
            has_next=has_next,
            has_prev=has_prev,
        )
        return PaginatedLots(lots=lots, pagination=pagination)

    def get_lot_by_id(self, lot_id: int) -> Lot:
        lot = self._lot_repository.get_lot_by_id(lot_id)
        if not lot:
            raise HTTPException(
                status_code=404,
                detail="This lot is not found"
            )
        return lot

    def update_lot(self, lot_id: int, lot_update: LotUpdate) -> Lot:
        lot = self._lot_repository.get_lot_by_id(lot_id)
        if not lot:
            raise HTTPException(
                status_code=404,
                detail="This lot is not found"
            )
        return self._lot_repository.update_lot(lot, lot_update.dict(exclude_unset=True))

    def delete_lot(self, lot_id: int):
        lot = self._lot_repository.get_lot_by_id(lot_id)
        if not lot:
            raise HTTPException(
                status_code=404,
                detail="This lot is not found"
            )
        self._lot_repository.delete_lot(lot)
