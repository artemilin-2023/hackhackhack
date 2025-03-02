import os

from sqlmodel import create_engine, Session, SQLModel
from common.logger import log
from domain.user import User, Role
from passlib.context import CryptContext

DATABASE_CONNECTION_STRING = os.getenv("DATABASE_CONNECTION_STRING")
log.info("Connection string is %s", DATABASE_CONNECTION_STRING)

engine = create_engine(DATABASE_CONNECTION_STRING, echo=True)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_admin_user(session: Session) -> None:
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")

    if not admin_email or not admin_password:
        log.warning("ADMIN_EMAIL or ADMIN_PASSWORD not set, skipping admin user creation")
        return

    existing_admin = session.query(User).filter(
        User.email == admin_email,
        User.role == Role.admin
    ).first()

    if existing_admin:
        log.info("Admin user already exists")
        return

    admin_user = User(
        name="Admin",
        email=admin_email,
        password=pwd_context.hash(admin_password),
        role=Role.admin
    )

    try:
        session.add(admin_user)
        session.commit()
        log.info("Admin user created successfully")
    except Exception as e:
        session.rollback()
        log.error(f"Failed to create admin user: {str(e)}")
        raise

def on_start_up():
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        create_admin_user(session)


def get_session() -> Session:
    with Session(engine) as session:
        yield session


def get_static_session() -> Session:
    with Session(engine) as session:
        return session
