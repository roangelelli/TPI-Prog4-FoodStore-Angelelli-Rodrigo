# se importan todos los modelos juntos para que SQLModel resuelva las relaciones
from app.modules.categorias import models as _categorias  # noqa: F401
from app.modules.pedidos import models as _pedidos  # noqa: F401
from app.modules.productos import models as _productos  # noqa: F401
from app.modules.usuarios import models as _usuarios  # noqa: F401
