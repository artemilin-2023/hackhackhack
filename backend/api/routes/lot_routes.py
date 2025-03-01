from typing import Optional

from fastapi import APIRouter, HTTPException, Form
from starlette import status
from starlette.requests import Request
from starlette.responses import JSONResponse

from dependencies import LotServiceDep

from api.requests.lot_models import LotCreate, LotRead, PaginatedLots, LotUpdate

router = APIRouter(
    tags=["lots"],
    prefix="/lots"
)


@router.post("/", response_model=LotRead)
async def create_lot(service: LotServiceDep, r: Request,
                     title: str = Form(),
                     description: str = Form(),
                     price: float = Form()):
    request = LotCreate(title=title, description=description, price=price)
    return service.create_lot(request, r)


@router.get("/", response_model=PaginatedLots)
async def get_many_lots(service: LotServiceDep, page_number: int = 1, page_size: int = 10):
    if page_number < 1 or page_size > 100:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Page number must be great then 1 and page size must be lowest then 100.")

    return service.get_all_lots(page_number, page_size)


@router.get("/{id}", response_model=LotRead)
async def get_by_id(id: int, service: LotServiceDep):
    return service.get_lot_by_id(id)


@router.delete("/{id}")
async def delete(id: int, service: LotServiceDep):
    return service.delete_lot(id)


@router.patch("/{id}")
async def update(id: int, service: LotServiceDep,
                 title: Optional[str] = Form(None),
                 description: Optional[str] = Form(None),
                 price: Optional[float] = Form(None)):
    request = LotUpdate(title=title, description=description, price=price)
    return service.update_lot(id, request)
