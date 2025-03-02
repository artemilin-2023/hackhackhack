from contextlib import asynccontextmanager
import re
import os
from typing import List

import uvicorn
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException
from starlette import status
from starlette.requests import Request
from starlette.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from api.routes import user_routes, lot_routes, oil_pump_routes, order_routes
from dependencies import get_static_user_service
from domain.user import Role
from infrastructure.database import on_start_up
from common.logger import log
from infrastructure.background_tasks import lot_expiration_checker
from dependencies import get__static_ftp_client_scheduler

# =============================
# Отказ от ответственности
# =============================
#
# Я не пайтон разработчик и никогда им не был, 
# про ограничения на стек я узнал за день до хакатона,
# поэтому некоторые вещи могут быть сделаны не так, как положено.
#
# =============================

load_dotenv()

def get_cors_origins() -> List[str]:
    origins_str = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:5173")
    return [origin.strip() for origin in origins_str.split(",")]

@asynccontextmanager
async def lifespan(app: FastAPI):
    on_start_up()
    
    ftp_client_scheduler = get__static_ftp_client_scheduler()
    await lot_expiration_checker.start()
    await ftp_client_scheduler.start()
    yield
    
    await ftp_client_scheduler.stop()
    await lot_expiration_checker.stop()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=os.getenv("CORS_ALLOW_CREDENTIALS", "true") == "true",
    allow_methods=os.getenv("CORS_ALLOW_METHODS", "*"),
    allow_headers=os.getenv("CORS_ALLOW_HEADERS", "*"),
)

app.include_router(user_routes.router)
app.include_router(lot_routes.router)
app.include_router(oil_pump_routes.router)
app.include_router(order_routes.router)

restricted_routes = {
    # любой маршрут, начинающийся с /lots, кроме /lots/active
    r"^\/api\/lots(\/(?!active$)(\d+)?)?$": {
        "methods": ["POST", "DELETE", "PATCH", "GET"],
        "required_roles": [Role.admin]
    },
    r"^\/api\/oil-pumps.*$": {
        "methods": ["POST", "DELETE", "PATCH"],
        "required_roles": [Role.admin]
    },
    # любой маршрут, кроме /login, /register, /docs, требует наличия авторизации.
    r"^(?!\/api(?:login|register|docs|openapi.json)$).*$": {
        "methods": ["POST", "DELETE", "GET", "PATCH", "PUT"],
        "required_roles": [Role.admin, Role.customer]
    }
}

# боже храни шарпы, слава майкрософт и его DI контейнерам
app.state._user_service = get_static_user_service()

@app.middleware("http")
async def role_middleware(request: Request, call_next):
    try:
        path = request.url.path
        method = request.method
        for pattern in restricted_routes.keys():
            if re.match(pattern, path) and method in restricted_routes[pattern]["methods"]:
                required_roles = restricted_routes[pattern]["required_roles"]
                app.state._user_service.role_required(required_roles, request)
                break
    except HTTPException as ex:
        return JSONResponse(
            status_code=ex.status_code,
            content={'detail': ex.detail}
        )
    except Exception as ex:
        log.error(f"Error in role middleware: {ex}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={'detail': "internal server error"}
        )

    return await call_next(request)


# for debugging
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
