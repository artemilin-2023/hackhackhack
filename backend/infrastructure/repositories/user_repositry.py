from typing import Union

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session

from common.logger import log
from domain.user import User


class UserRepository:
    def __init__(self, session: Session):
        self._session = session

    def get_by_email(self, email: str) -> User:
        user = self._session.query(User).filter_by(email=email).first()
        return user

    def get_by_id(self, id: int) -> User:
        user = self._session.query(User).filter_by(id=id).first()
        if not user:
            raise HTTPException(
                status_code=404,
                detail="This user is not found"
            )
        return user

    def add(self, user: User) -> User:
        try:
            self._session.add(user)
            self._session.commit()
            self._session.refresh(user)
            return user
        except IntegrityError as ex:
            log.error("Failed to create user with params \'%s\', rollback transaction....", user)
            self._session.rollback()
            log.error("Rollback success")
            raise ex
