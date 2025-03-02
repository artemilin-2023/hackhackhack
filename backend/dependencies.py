from typing import Annotated

from fastapi import Depends

from application.services.auth_service import AuthService
from application.services.lot_service import LotService
from application.services.oil_pump_service import OilPumpService
from application.services.order_service import OrderService
from application.services.user_services import UserService
from application.services.ftp_client_service import FTPClientService
from infrastructure.database import get_session, get_static_session, get_static_session2
from infrastructure.repositories.lot_repository import LotRepository
from infrastructure.repositories.oil_pump_repository import OilPumpRepository
from infrastructure.repositories.order_repository import OrderRepository
from infrastructure.repositories.user_repositry import UserRepository
from infrastructure.ftp_client_scheduler import FTPClientScheduler


def get_user_repository(session=Depends(get_session)) -> UserRepository:
    return UserRepository(session)


def get_auth_service(repository=Depends(get_user_repository)) -> AuthService:
    return AuthService(repository)


def get_user_service(repository=Depends(get_user_repository), auth_service=Depends(get_auth_service)) -> UserService:
    return UserService(repository, auth_service)


def get_lot_repository(session=Depends(get_session)):
    return LotRepository(session)


def get_order_repositories(session=Depends(get_session)):
    return OrderRepository(session)


def get_order_service(repository=Depends(get_order_repositories), user_service=Depends(get_user_service)):
    return OrderService(repository, user_service)


def get_oil_pump_repository(session=Depends(get_session)):
    return OilPumpRepository(session)


def get_oil_pump_service(repository=Depends(get_oil_pump_repository)):
    return OilPumpService(repository)



def get_lot_service(repository=Depends(get_lot_repository), oil_pump_service=Depends(get_oil_pump_service)):
    return LotService(repository, oil_pump_service)

def get_ftp_client_service(lot_service=Depends(get_lot_service)) -> FTPClientService:
    return FTPClientService(lot_service)


def get_static_user_service():
    session = get_static_session()
    rep = get_user_repository(session)
    auth = get_auth_service(rep)
    return UserService(rep, auth)

def get__static_ftp_client_scheduler():
    session = get_static_session()
    lot_rep = get_lot_repository(session)
    oil_rep = get_oil_pump_repository(session)
    pump_service = get_oil_pump_service(oil_rep)
    lot_service = get_lot_service(lot_rep, pump_service)
    ftp_client_service = get_ftp_client_service(lot_service)
    return FTPClientScheduler(ftp_client_service)



AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]
UserServiceDep = Annotated[UserService, Depends(get_user_service)]
LotServiceDep = Annotated[LotService, Depends(get_lot_service)]
OrderServiceDep = Annotated[OrderService, Depends(get_order_service)]
OilPumpServiceDep = Annotated[OilPumpService, Depends(get_oil_pump_service)]
FTPClientServiceDep = Annotated[FTPClientService, Depends(get_ftp_client_service)]