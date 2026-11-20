from fastapi import HTTPException, status

from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


class UsuarioService:
    def __init__(self, uow: UsuarioUnitOfWork):
        self.uow = uow

    def listar(self) -> list[UserPublic]:
        with self.uow as uow:
            return [UserPublic.model_validate(u) for u in uow.usuarios.get_all()]

    def _cambiar_estado(self, usuario_id: int, disabled: bool, admin_id: int | None = None) -> UserPublic:
        with self.uow as uow:
            usuario = uow.usuarios.get_by_id(usuario_id)
            if usuario is None:
                raise HTTPException(status.HTTP_404_NOT_FOUND, "Usuario no encontrado")
            # el admin no se puede desactivar a si mismo
            if disabled and usuario.id == admin_id:
                raise HTTPException(status.HTTP_400_BAD_REQUEST, "No podés desactivarte a vos mismo")
            usuario.disabled = disabled
            return UserPublic.model_validate(usuario)

    def activar(self, usuario_id: int) -> UserPublic:
        return self._cambiar_estado(usuario_id, False)

    def desactivar(self, usuario_id: int, admin_id: int) -> UserPublic:
        return self._cambiar_estado(usuario_id, True, admin_id)
