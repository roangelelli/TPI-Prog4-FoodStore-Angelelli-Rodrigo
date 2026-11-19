from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings

# sqlite necesita este argumento para usarse con varios hilos
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)


def create_all_tables() -> None:
    SQLModel.metadata.create_all(engine)


def session_factory() -> Session:
    # una sesion nueva cada vez que un UoW abre su with
    return Session(engine)
