from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.database import session_factory
from app.core.deps import get_current_active_user, require_role
from app.modules.pedidos.schemas import (
    CambioEstado,
    EstadoPedido,
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)
from app.modules.pedidos.service import (
    PedidoAjeno,
    PedidoNoEncontrado,
    PedidoService,
    ProductoNoDisponible,
    ProductoRepetido,
    StockInsuficiente,
    TransicionInvalida,
)
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork
from app.modules.productos.service import ProductoNoEncontrado
from app.modules.usuarios.schemas import UserPublic

router = APIRouter(prefix="/pedidos", tags=["pedidos"])

Sesion = Annotated[UserPublic, Depends(get_current_active_user)]
AdminUser = Annotated[UserPublic, Depends(require_role(["admin"]))]


def get_pedido_service() -> PedidoService:
    return PedidoService(PedidoUnitOfWork(session_factory))


def _http(status_code: int, detail: str) -> HTTPException:
    return HTTPException(status_code, detail)


@router.post("", response_model=PedidoRead, status_code=status.HTTP_201_CREATED)
def crear_pedido(datos: PedidoCreate, user: Sesion, service: PedidoService = Depends(get_pedido_service)):
    try:
        return service.crear(datos, user.id)
    except ProductoNoEncontrado:
        raise _http(status.HTTP_404_NOT_FOUND, "Producto no encontrado")
    except ProductoRepetido:
        raise _http(status.HTTP_400_BAD_REQUEST, "Hay productos repetidos en el pedido")
    except ProductoNoDisponible:
        raise _http(status.HTTP_400_BAD_REQUEST, "Hay un producto no disponible")
    except StockInsuficiente:
        raise _http(status.HTTP_400_BAD_REQUEST, "Stock insuficiente")


@router.get("", response_model=PedidosPaginados)
def listar_pedidos(
    user: Sesion,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    estado: EstadoPedido | None = None,
    service: PedidoService = Depends(get_pedido_service),
):
    return service.listar(user.id, user.role == "admin", estado, skip, limit)


# /resumen va antes de /{pedido_id} para que no lo tome como id
@router.get("/resumen", response_model=ResumenPedidos)
def resumen_pedidos(_admin: AdminUser, service: PedidoService = Depends(get_pedido_service)):
    return service.resumen()


@router.get("/{pedido_id}", response_model=PedidoRead)
def obtener_pedido(pedido_id: int, user: Sesion, service: PedidoService = Depends(get_pedido_service)):
    try:
        return service.obtener(pedido_id, user.id, user.role == "admin")
    except PedidoNoEncontrado:
        raise _http(status.HTTP_404_NOT_FOUND, "Pedido no encontrado")
    except PedidoAjeno:
        raise _http(status.HTTP_403_FORBIDDEN, "El pedido es de otro usuario")


@router.patch("/{pedido_id}/estado", response_model=PedidoRead)
def cambiar_estado(
    pedido_id: int,
    datos: CambioEstado,
    _admin: AdminUser,
    service: PedidoService = Depends(get_pedido_service),
):
    try:
        return service.actualizar_estado(pedido_id, datos.estado)
    except PedidoNoEncontrado:
        raise _http(status.HTTP_404_NOT_FOUND, "Pedido no encontrado")
    except TransicionInvalida:
        raise _http(status.HTTP_400_BAD_REQUEST, "Transición de estado inválida")


@router.patch("/{pedido_id}/cancelar", response_model=PedidoRead)
def cancelar_pedido(pedido_id: int, user: Sesion, service: PedidoService = Depends(get_pedido_service)):
    try:
        return service.cancelar(pedido_id, user.id)
    except PedidoNoEncontrado:
        raise _http(status.HTTP_404_NOT_FOUND, "Pedido no encontrado")
    except PedidoAjeno:
        raise _http(status.HTTP_403_FORBIDDEN, "El pedido es de otro usuario")
    except TransicionInvalida:
        raise _http(status.HTTP_400_BAD_REQUEST, "Solo se puede cancelar un pedido en PENDIENTE")
