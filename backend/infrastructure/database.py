import os

from sqlmodel import create_engine, Session, SQLModel
from common.logger import log

DATABASE_CONNECTION_STRING = os.getenv("DATABASE_CONNECTION_STRING")
log.info("Connection string is %s", DATABASE_CONNECTION_STRING)

engine = create_engine(DATABASE_CONNECTION_STRING, echo=True)


def on_start_up():
    SQLModel.metadata.create_all(engine)


def get_session() -> Session:
    with Session(engine) as session:
        yield session


def get_static_session() -> Session:
    with Session(engine) as session:
        return session
