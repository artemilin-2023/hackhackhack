import os
from datetime import datetime, timedelta, timezone
from typing import Annotated, Any

import jwt
from dotenv import load_dotenv
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from jwt import InvalidTokenError
from passlib.context import CryptContext
from starlette import status

load_dotenv()

HASH = os.getenv("JWT_VARY_SECRET_HASH_IN_PUBLIC_REPO")
ALGORITHM = os.getenv("JWT_ALGORITHM")
TOKEN_EXPIRE_HOURS = timedelta(hours=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_HOURS", 24)))


crypto_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return crypto_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return crypto_context.hash(password)


def create_access_token(data: dict[str, Any]):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + TOKEN_EXPIRE_HOURS
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, HASH, algorithm=ALGORITHM)
    return encoded_jwt


def get_from_payload(token: str, key: str) -> Any:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials"
    )

    try:
        payload = jwt.decode(token, HASH, algorithms=[ALGORITHM])
        data = payload.get(key)
        if data is None:
            raise credentials_exception
        return data
    except InvalidTokenError:
        raise credentials_exception
