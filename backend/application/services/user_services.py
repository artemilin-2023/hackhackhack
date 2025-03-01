from typing import List

from fastapi import Depends, HTTPException
from starlette.requests import Request
from starlette.responses import Response

from api.requests.auth_request import AuthRequest
from api.requests.create_user import CreateUserRequest
from application.services.auth_service import AuthService
from domain.user import User, Role
from infrastructure.auth.jwt_manager import get_password_hash
from infrastructure.repositories.user_repositry import UserRepository


class UserService:
    def __init__(self, repository: UserRepository, auth_service: AuthService):
        self._repository = repository
        self._auth_service = auth_service

    def register_user(self, user_data: CreateUserRequest, response: Response) -> User:
        existing_user = self._repository.get_by_email(user_data.email)
        if existing_user:
            raise ValueError(f"User with email {user_data.email} already exists")

        user = User(
            name=user_data.name,
            email=user_data.email,
            password=get_password_hash(user_data.password),
            role=user_data.role
        )

        user = self._repository.add(user)
        token = self._auth_service.create_token(user)
        self._auth_service.set_token_to_cookie(token, response)
        return user

    def login(self, auth_request: AuthRequest, response: Response):
        user = self._auth_service.get_authenticated_user(auth_request.email, auth_request.password)
        token = self._auth_service.create_token(user)
        self._auth_service.set_token_to_cookie(token, response)

    def get_current_user(self, request: Request) -> User:
        token = self._auth_service.get_token(request)
        user_id = self._auth_service.get_id(token)
        return self._repository.get_by_id(user_id)

    def role_required(self, required_roles: List[Role], request: Request):
        user = self.get_current_user(request)
        if user.role not in required_roles:
            raise HTTPException(status_code=403, detail="Permission denied")
        return user
