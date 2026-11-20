from sqlmodel import select

from app import modules  # noqa: F401  (carga los modelos)
from app.core.database import create_all_tables, session_factory
from app.core.security import hash_password
from app.modules.categorias.models import Categoria
from app.modules.productos.models import Producto
from app.modules.usuarios.models import Usuario

USUARIOS = [
    ("admin", "Administrador", "admin@foodstore.com", "Admin1234!", "admin"),
    ("cliente", "Cliente de Prueba", "cliente@foodstore.com", "Cliente1234!", "user"),
]

CATEGORIAS = {
    "Hamburguesas": "Hamburguesas caseras",
    "Pizzas": "Pizzas al horno de piedra",
    "Bebidas": "Gaseosas, jugos y agua",
    "Postres": "Dulces para cerrar la comida",
}

# (nombre, categoria, precio, stock, descripcion)
PRODUCTOS = [
    ("Hamburguesa Clasica", "Hamburguesas", 4500, 20, "Carne, lechuga, tomate y cheddar"),
    ("Hamburguesa Doble", "Hamburguesas", 6200, 15, "Doble carne con panceta y cheddar"),
    ("Pizza Muzzarella", "Pizzas", 7000, 12, "Salsa de tomate y muzzarella"),
    ("Pizza Napolitana", "Pizzas", 7800, 10, "Muzzarella, tomate fresco y ajo"),
    ("Gaseosa 500ml", "Bebidas", 1500, 50, "Cola, lima o naranja"),
    ("Agua Mineral 500ml", "Bebidas", 1000, 60, "Con o sin gas"),
    ("Flan con Dulce de Leche", "Postres", 2500, 18, "Flan casero con crema"),
    ("Brownie", "Postres", 2800, 14, "Brownie de chocolate con nueces"),
]


def imagen(nombre: str) -> str:
    return "https://placehold.co/400x300?text=" + nombre.replace(" ", "+")


def seed() -> None:
    create_all_tables()
    with session_factory() as session:
        # cada bloque revisa si ya existe, asi se puede correr muchas veces
        for username, full_name, email, password, role in USUARIOS:
            if not session.exec(select(Usuario).where(Usuario.username == username)).first():
                session.add(
                    Usuario(
                        username=username,
                        full_name=full_name,
                        email=email,
                        hashed_password=hash_password(password),
                        role=role,
                    )
                )

        for nombre, descripcion in CATEGORIAS.items():
            if not session.exec(select(Categoria).where(Categoria.nombre == nombre)).first():
                session.add(Categoria(nombre=nombre, descripcion=descripcion))
        session.commit()

        for nombre, cat_nombre, precio, stock, descripcion in PRODUCTOS:
            if session.exec(select(Producto).where(Producto.nombre == nombre)).first():
                continue
            categoria = session.exec(select(Categoria).where(Categoria.nombre == cat_nombre)).one()
            session.add(
                Producto(
                    categoria_id=categoria.id,
                    nombre=nombre,
                    descripcion=descripcion,
                    precio_base=precio,
                    imagen_url=imagen(nombre),
                    stock=stock,
                )
            )
        session.commit()
    print("Seed listo")


if __name__ == "__main__":
    seed()
