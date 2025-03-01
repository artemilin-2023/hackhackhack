from fastapi import APIRouter, HTTPException
from starlette.requests import Request
from starlette.responses import Response, JSONResponse

from api.models.auth_request import AuthRequest
from api.models.user_models import CreateUserRequest, UserResponse
from dependencies import UserServiceDep, AuthServiceDep

router = APIRouter(
    tags=["account"]
)


@router.post("/register", response_model=UserResponse)
async def register(request: CreateUserRequest, service: UserServiceDep, response: Response):
    try:
        user = service.register_user(request, response)
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
async def login(request: AuthRequest, service: UserServiceDep, response: Response):
    service.login(request, response)
    return JSONResponse(content={"message": "ok"}, status_code=200, headers=response.headers)


@router.get("/logout")
async def logout(service: AuthServiceDep, response: Response):
    service.remove_token(response)
    return JSONResponse(content={"message": "ok"}, status_code=200, headers=response.headers)


@router.get("/me", response_model=UserResponse)
async def me(service: UserServiceDep, request: Request):
    return service.get_current_user(request)
