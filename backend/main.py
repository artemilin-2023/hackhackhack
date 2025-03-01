from contextlib import asynccontextmanager
import re

import uvicorn

from fastapi import FastAPI, HTTPException
from starlette import status
from starlette.requests import Request
from starlette.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from api.routes import user_routes, lot_routes
from dependencies import get_static_uibanskie_pythonskie_dependence_injection_user_service
from domain.user import Role
from infrastructure.database import on_start_up

@asynccontextmanager
async def lifespan(app: FastAPI):
    on_start_up()
    yield

app = FastAPI(lifespan=lifespan)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_routes.router)
app.include_router(lot_routes.router)

restricted_routes = {
    # любой маршрут, начинающийся с /lots
    r"^\/lots.*$": {
        "methods": ["POST", "DELETE", "PATCH"],
        "required_roles": [Role.seller, Role.admin]
    },
    # любой маршрут, кроме /login, /register, /docs, требует наличия авторизации.
    r"^(?!\/(?:login|register|docs|openapi.json)$).*$": {
        "methods": ["POST", "DELETE", "GET", "PATCH", "PUT"],
        "required_roles": [Role.seller, Role.admin, Role.customer]
    }
}

# боже храни шарпы, слава майкрософт и его DI контейнерам
app.state._user_service = get_static_uibanskie_pythonskie_dependence_injection_user_service()

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
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={'detail': "internal server error"}
        )

    return await call_next(request)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

