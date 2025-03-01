from typing import Annotated

from fastapi import Depends

from application.services.auth_service import AuthService
from application.services.lot_service import LotService
from application.services.order_service import OrderService
from application.services.user_services import UserService
from infrastructure.database import get_session, get_static_session
from infrastructure.repositories.lot_repository import LotRepository
from infrastructure.repositories.order_repository import OrderRepository
from infrastructure.repositories.user_repositry import UserRepository


def get_user_repository(session=Depends(get_session)) -> UserRepository:
    return UserRepository(session)


def get_auth_service(repository=Depends(get_user_repository)) -> AuthService:
    return AuthService(repository)


def get_user_service(repository=Depends(get_user_repository), auth_service=Depends(get_auth_service)) -> UserService:
    return UserService(repository, auth_service)


def get_lot_repository(session=Depends(get_session)):
    return LotRepository(session)


def get_lot_service(repository=Depends(get_lot_repository), user_service=Depends(get_user_service)):
    return LotService(repository, user_service)


def get_order_repositories(session=Depends(get_session)):
    return OrderRepository(session)


def get_order_service(repository=Depends(get_order_repositories), user_service=Depends(get_user_service)):
    return OrderService(repository, user_service)


def get_static_uibanskie_pythonskie_dependence_injection_user_service():
    session = get_static_session()
    rep = get_user_repository(session)
    auth = get_auth_service(rep)
    return UserService(rep, auth)


AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]
UserServiceDep = Annotated[UserService, Depends(get_user_service)]
LotServiceDep = Annotated[LotService, Depends(get_lot_service)]
OrderServiceDep = Annotated[OrderService, Depends(get_order_service)]
