from collections.abc import Callable

from sqlmodel import Session


class UnitOfWork:
    session: Session

    def __init__(self, session_factory: Callable[[], Session]):
        self.session_factory = session_factory

    def _crear_repositorios(self) -> None:
        # cada modulo crea aca sus repositorios con self.session
        pass

    def __enter__(self):
        self.session = self.session_factory()
        self._crear_repositorios()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        try:
            if exc_type:
                self.session.rollback()
            else:
                self.session.commit()
        finally:
            self.session.close()
