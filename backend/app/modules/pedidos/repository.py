from datetime import datetime

from sqlalchemy.orm import selectinload
from sqlmodel import Session, col, func, select

from app.core.base_repository import BaseRepository
from app.modules.pedidos.models import DetallePedido, Pedido


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session):
        super().__init__(session, Pedido)

    def _listar(
        self, usuario_id: int | None, estado: str | None, skip: int, limit: int
    ) -> tuple[list[Pedido], int]:
        consulta = select(Pedido)
        if usuario_id is not None:
            consulta = consulta.where(Pedido.usuario_id == usuario_id)
        if estado:
            consulta = consulta.where(Pedido.estado == estado)
        total = self.session.exec(select(func.count()).select_from(consulta.subquery())).one()
        items = self.session.exec(
            consulta.options(selectinload(Pedido.items))  # type: ignore[arg-type]
            .order_by(col(Pedido.id).desc())
            .offset(skip)
            .limit(limit)
        ).all()
        return list(items), total

    def list_by_usuario(self, usuario_id: int, estado: str | None, skip: int, limit: int):
        return self._listar(usuario_id, estado, skip, limit)

    def list_all(self, estado: str | None, skip: int, limit: int):
        return self._listar(None, estado, skip, limit)

    def count_by_estado(self, estado: str) -> int:
        consulta = select(func.count()).select_from(Pedido).where(Pedido.estado == estado)
        return self.session.exec(consulta).one()

    def count_desde(self, fecha: datetime) -> int:
        consulta = select(func.count()).select_from(Pedido).where(Pedido.created_at >= fecha)
        return self.session.exec(consulta).one()

    def sumar_total_por_estado(self, estado: str) -> float:
        consulta = select(func.coalesce(func.sum(Pedido.total), 0)).where(Pedido.estado == estado)
        return float(self.session.exec(consulta).one())


class DetallePedidoRepository(BaseRepository[DetallePedido]):
    def __init__(self, session: Session):
        super().__init__(session, DetallePedido)
