from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.database import session_factory
from app.core.deps import require_role
from app.modules.categorias.service import CategoriaNoEncontrada
from app.modules.productos.schemas import (
    ProductoCreate,
    ProductoRead,
    ProductosPaginados,
    ProductoStockUpdate,
    ProductoUpdate,
)
from app.modules.productos.service import ProductoNoEncontrado, ProductoService
from app.modules.productos.unit_of_work import ProductoUnitOfWork

router = APIRouter(prefix="/productos", tags=["productos"])

SoloAdmin = [Depends(require_role(["admin"]))]


def get_producto_service() -> ProductoService:
    return ProductoService(ProductoUnitOfWork(session_factory))


def _producto_no_encontrado() -> HTTPException:
    return HTTPException(status.HTTP_404_NOT_FOUND, "Producto no encontrado")


def _categoria_no_encontrada() -> HTTPException:
    return HTTPException(status.HTTP_404_NOT_FOUND, "Categoría no encontrada")


@router.get("", response_model=ProductosPaginados)
def listar_productos(
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    search: str | None = None,
    categoria_id: int | None = None,
    disponible: bool | None = None,
    service: ProductoService = Depends(get_producto_service),
):
    return service.listar(search, categoria_id, disponible, skip, limit)


@router.get("/{producto_id}", response_model=ProductoRead)
def obtener_producto(producto_id: int, service: ProductoService = Depends(get_producto_service)):
    try:
        return service.obtener(producto_id)
    except ProductoNoEncontrado:
        raise _producto_no_encontrado()


@router.post("", response_model=ProductoRead, status_code=status.HTTP_201_CREATED, dependencies=SoloAdmin)
def crear_producto(datos: ProductoCreate, service: ProductoService = Depends(get_producto_service)):
    try:
        return service.crear(datos)
    except CategoriaNoEncontrada:
        raise _categoria_no_encontrada()


@router.put("/{producto_id}", response_model=ProductoRead, dependencies=SoloAdmin)
def actualizar_producto(
    producto_id: int, datos: ProductoUpdate, service: ProductoService = Depends(get_producto_service)
):
    try:
        return service.actualizar(producto_id, datos)
    except ProductoNoEncontrado:
        raise _producto_no_encontrado()
    except CategoriaNoEncontrada:
        raise _categoria_no_encontrada()


@router.patch("/{producto_id}/stock", response_model=ProductoRead, dependencies=SoloAdmin)
def cambiar_stock(
    producto_id: int, datos: ProductoStockUpdate, service: ProductoService = Depends(get_producto_service)
):
    try:
        return service.cambiar_stock(producto_id, datos)
    except ProductoNoEncontrado:
        raise _producto_no_encontrado()


@router.delete("/{producto_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=SoloAdmin)
def eliminar_producto(producto_id: int, service: ProductoService = Depends(get_producto_service)):
    try:
        service.eliminar(producto_id)
    except ProductoNoEncontrado:
        raise _producto_no_encontrado()
