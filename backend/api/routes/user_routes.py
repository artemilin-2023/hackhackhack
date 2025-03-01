from typing import Sequence

from fastapi import APIRouter, HTTPException, Form
from pydantic import EmailStr
from starlette.requests import Request
from starlette.responses import Response, JSONResponse

from api.requests.auth_request import AuthRequest
from api.requests.create_user import CreateUserRequest
from api.responses.user_response import UserResponse
from dependencies import UserServiceDep, AuthServiceDep
from domain.user import PublicRole

router = APIRouter(
    tags=["account"]
)


@router.post("/register", response_model=UserResponse)
async def register(service: UserServiceDep, response: Response,
                   name: str = Form(),
                   email: EmailStr = Form(),
                   password: str = Form(),
                   role: PublicRole = Form()):
    try:
        request = CreateUserRequest(name=name, email=email, password=password, role=role)
        user = service.register_user(request, response)
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
async def login(service: UserServiceDep, response: Response,
                email: EmailStr = Form(),
                password: str = Form()):
    request = AuthRequest(email=email, password=password)
    service.login(request, response)
    return JSONResponse(content={"message": "ok"}, status_code=200, headers=response.headers)


@router.get("/logout")
async def logout(service: AuthServiceDep, response: Response):
    service.remove_token(response)
    return JSONResponse(content={"message": "ok"}, status_code=200, headers=response.headers)


@router.get("/me", response_model=UserResponse)
async def me(service: UserServiceDep, request: Request):
    return service.get_current_user(request)
