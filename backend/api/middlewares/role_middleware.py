from typing import Dict, List

from fastapi import FastAPI
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from dependencies import UserServiceDep
from domain.user import Role


class RoleMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: FastAPI, restricted_routes: Dict[str, List[Role]], user_service=UserServiceDep):
        super().__init__(app)
        self.restricted_routes = restricted_routes
        self.user_service = user_service

    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        if path in self.restricted_routes:
            required_roles = self.restricted_routes[path]
            self.user_service.role_required(required_roles, request)

        response = await call_next(request)
        return response
