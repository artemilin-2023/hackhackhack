from fastapi import HTTPException
from starlette import status
from starlette.requests import Request
from starlette.responses import Response

from domain.user import User
from infrastructure.auth.jwt_manager import verify_password, create_access_token, get_from_payload
from infrastructure.repositories.user_repositry import UserRepository


class AuthService:

    _token_key: str = "token"

    def __init__(self, repository: UserRepository):
        self._repository = repository

    def set_token_to_cookie(self, token: str, response: Response):
        response.set_cookie(key=self._token_key, value=f"Bearer {token}", httponly=True)
        print(response)

    def remove_token(self, response: Response):
        response.delete_cookie(key=self._token_key)

    def get_token(self, request: Request) -> str:
        token = request.cookies.get(self._token_key)
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unauthorized"
            )
        return token.split(" ")[1]  # format 'Bearer {tkn}', got only tkn

    def get_id(self, token: str) -> int:
        id = get_from_payload(token, "id")
        if type(id) is not int:
            raise Exception(f"Expected id int; Got {type(id)}")
        return id


    def create_token(self, user: User) -> str:
        return create_access_token(
            data={"id": user.id}
        )

    def get_authenticated_user(self, email: str, password: str) -> User:
        user = self._repository.get_by_email(email)

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User with this email is not found"
            )

        if not verify_password(password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Wrong password",
            )

        return user

