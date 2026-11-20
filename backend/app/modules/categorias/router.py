from fastapi import APIRouter, Depends, HTTPException, status

from app.core.database import session_factory
from app.core.deps import require_role
from app.modules.categorias.schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate
from app.modules.categorias.service import CategoriaNoEncontrada, CategoriaService, NombreDuplicado
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork

router = APIRouter(prefix="/categorias", tags=["categorias"])

SoloAdmin = [Depends(require_role(["admin"]))]


def get_categoria_service() -> CategoriaService:
    return CategoriaService(CategoriaUnitOfWork(session_factory))


def _no_encontrada() -> HTTPException:
    return HTTPException(status.HTTP_404_NOT_FOUND, "Categoría no encontrada")


def _duplicada() -> HTTPException:
    return HTTPException(status.HTTP_409_CONFLICT, "Ya existe una categoría con ese nombre")


@router.get("", response_model=list[CategoriaRead])
def listar_categorias(service: CategoriaService = Depends(get_categoria_service)):
    return service.listar()


@router.get("/{categoria_id}", response_model=CategoriaRead)
def obtener_categoria(categoria_id: int, service: CategoriaService = Depends(get_categoria_service)):
    try:
        return service.obtener(categoria_id)
    except CategoriaNoEncontrada:
        raise _no_encontrada()


@router.post("", response_model=CategoriaRead, status_code=status.HTTP_201_CREATED, dependencies=SoloAdmin)
def crear_categoria(datos: CategoriaCreate, service: CategoriaService = Depends(get_categoria_service)):
    try:
        return service.crear(datos)
    except NombreDuplicado:
        raise _duplicada()


@router.put("/{categoria_id}", response_model=CategoriaRead, dependencies=SoloAdmin)
def actualizar_categoria(
    categoria_id: int, datos: CategoriaUpdate, service: CategoriaService = Depends(get_categoria_service)
):
    try:
        return service.actualizar(categoria_id, datos)
    except CategoriaNoEncontrada:
        raise _no_encontrada()
    except NombreDuplicado:
        raise _duplicada()


@router.delete("/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=SoloAdmin)
def eliminar_categoria(categoria_id: int, service: CategoriaService = Depends(get_categoria_service)):
    try:
        service.eliminar(categoria_id)
    except CategoriaNoEncontrada:
        raise _no_encontrada()
