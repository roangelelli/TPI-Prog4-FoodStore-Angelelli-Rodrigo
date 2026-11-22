# TPI Food Store - Programación 4

Repositorio del TP Integrador de Programación 4 (Tecnicatura Universitaria en Programación a Distancia, UTN).
Alumno: Angelelli, Rodrigo Martín

- Repositorio: https://github.com/roangelelli/TPI-Prog4-FoodStore-Angelelli-Rodrigo
- Video de presentación: https://youtu.be/kaoUHVXj21E

Sistema de pedidos para una tienda de comida. Los clientes arman un carrito y hacen pedidos; el administrador gestiona categorías, productos, usuarios y el estado de los pedidos.

## Tecnologías
- **Backend:** FastAPI, SQLModel, PostgreSQL, JWT en cookie HttpOnly (python-jose + passlib/bcrypt)
- **Frontend:** React 19, TypeScript, Vite, Tailwind 4, TanStack Query / Form / Table, Zustand, Axios, React Router 7

## Estructura
```
backend/   API (módulos: auth, usuarios, categorias, productos, pedidos)
frontend/  Aplicación React (arquitectura por features)
```
Backend en capas: Router → Service → UnitOfWork → Repository → Model.

## Requisitos
- Python 3.11 a 3.13
- PostgreSQL 15 o superior
- Node.js 20.19 o superior y pnpm 9 o superior (`npm i -g pnpm`)

## 1. Base de datos
Crear la base vacía (las tablas las crea la app al arrancar):
```bash
createdb foodstore_db
```

## 2. Backend
```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate          # en Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # completar DATABASE_URL y SECRET_KEY
python -m app.db.seed              # carga el admin, 4 categorías y 8 productos con stock y foto
uvicorn app.main:app --reload
```
- API: http://localhost:8000
- Documentación Swagger: http://localhost:8000/docs

Variables de `backend/.env`:

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL, ej. `postgresql://postgres:tu_password@localhost:5432/foodstore_db` |
| `SECRET_KEY` | Clave para firmar el JWT (mínimo 32 caracteres). Generar con `python -c "import secrets; print(secrets.token_hex(32))"` |
| `ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Duración del token, `30` |
| `FRONTEND_ORIGIN` | Origen permitido por CORS, `http://localhost:5173` |

## 3. Frontend
```bash
cd frontend
pnpm install
cp .env.example .env               # VITE_API_URL=http://localhost:8000/api/v1
pnpm dev
```
App en http://localhost:5173

## Usuarios de prueba (creados por el seed)
| Rol | Usuario | Contraseña |
|---|---|---|
| Administrador | `admin` | `Admin1234!` |
| Cliente | `cliente` | `Cliente1234!` |

Además se puede registrar un cliente nuevo desde `/register`.

## Funcionalidades principales
- Registro, login (por `username`) y logout con cookie HttpOnly; rutas protegidas por rol.
- Catálogo con búsqueda, filtro por categoría y paginación del lado del servidor.
- Carrito persistente y checkout (dirección, forma de pago, notas).
- Pedidos con descuento de stock transaccional, historial de precios y cancelación con devolución de stock.
- Máquina de estados: `PENDIENTE → EN_PREPARACION → ENTREGADO`, con `CANCELADO` desde `PENDIENTE` o `EN_PREPARACION`.
- Panel de administración: resumen, categorías, productos (con stock y disponibilidad), pedidos y usuarios (activar/desactivar).
- Borrado lógico en usuarios, categorías y productos.

## Endpoints (prefijo `/api/v1`)
| Módulo | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/token`, `POST /auth/logout`, `GET /auth/me` |
| Usuarios (admin) | `GET /admin/usuarios`, `POST /admin/usuarios/{id}/activar`, `POST /admin/usuarios/{id}/desactivar` |
| Categorías | `GET /categorias`, `POST`, `PUT /{id}`, `DELETE /{id}` (escrituras: admin) |
| Productos | `GET /productos` (`skip`, `limit`, `search`, `categoria_id`, `disponible`), `GET /{id}`, `POST`, `PUT /{id}`, `PATCH /{id}/stock`, `DELETE /{id}` |
| Pedidos | `POST /pedidos`, `GET /pedidos`, `GET /pedidos/resumen` (admin), `GET /pedidos/{id}`, `PATCH /pedidos/{id}/estado` (admin), `PATCH /pedidos/{id}/cancelar` |

`backend/pruebas.http` tiene requests de ejemplo (extensión REST Client de VS Code).

## Imágenes de los productos
Las fotos de ejemplo están en `frontend/public/productos/` (el seed las referencia como `/productos/<archivo>.jpg`) y las sirve el propio frontend. Se tomaron del repositorio [Foodish](https://github.com/surhud004/Foodish) (licencia MIT; las imágenes provienen de Kaggle y Pixabay). Desde el panel de administración se puede cambiar la URL de cualquier producto.
