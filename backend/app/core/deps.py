from typing import Annotated

from fastapi import Cookie, Depends, HTTPException, status

from app.core.database import session_factory
from app.core.security import decode_access_token
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

COOKIE_NAME = "access_token"


def get_current_user(access_token: Annotated[str | None, Cookie()] = None) -> UserPublic:
    sin_sesion = HTTPException(status.HTTP_401_UNAUTHORIZED, "No autenticado")
    if not access_token:
        raise sin_sesion
    payload = decode_access_token(access_token)
    if payload is None or not payload.get("sub"):
        raise sin_sesion
    with UsuarioUnitOfWork(session_factory) as uow:
        usuario = uow.usuarios.get_by_username(payload["sub"])
        if usuario is None:
            raise sin_sesion
        return UserPublic.model_validate(usuario)


def get_current_active_user(user: Annotated[UserPublic, Depends(get_current_user)]) -> UserPublic:
    if user.disabled:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Cuenta de usuario desactivada")
    return user


def require_role(roles: list[str]):
    def checker(user: Annotated[UserPublic, Depends(get_current_active_user)]) -> UserPublic:
        if user.role not in roles:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "No tenés permisos para esta acción")
        return user

    return checker
