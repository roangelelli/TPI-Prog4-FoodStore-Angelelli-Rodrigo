# Frontend – Food Store (Unidad 10: arquitectura por features y rutas protegidas)

Refactor del frontend de la Unidad 9 (React 19 + TypeScript + Vite + Tailwind). Se reorganizó `src/`
por dominio (feature), se protegen las rutas por sesión y por rol, cada feature tiene su custom hook
de datos y se agregó estado global de interfaz (tema y notificaciones) con Zustand.

## Ejecución

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

El backend de la Unidad 9 debe estar corriendo en http://localhost:8000 (se reutiliza sin cambios en
la autenticación, los roles `user` y `admin` ni la cookie HttpOnly). Para otra dirección, crear un
`.env` con `VITE_API_URL=http://host:puerto/api/v1`. Otros comandos: `pnpm build` y `pnpm lint`.

Usuarios de prueba (los carga `python seed.py` del backend):
`admin@foodstore.com / Admin1234!` (admin) y `cliente@foodstore.com / Cliente1234!` (user).

> La feature de ingredientes consume `GET/POST/PUT/DELETE /api/v1/ingredientes/`, igual que la de la
> Unidad 8. Si el backend que se usa no expone ese recurso, la pantalla `/ingredients` muestra el error
> del servidor y el resto de la aplicación sigue funcionando.

## Estructura de features

```
src/
├── features/
│   ├── auth/            Sesión, roles y administración de usuarios
│   │   ├── components/  AuthLayout (contenedor de login y registro)
│   │   ├── hooks/       useAuth, useUsuarios, useLoginForm, useRegisterForm
│   │   ├── services/    authService, usuarioService (llamadas Axios)
│   │   ├── store/       authStore.ts  (Zustand, SIN persist)
│   │   ├── types/       auth.types.ts (Role, UsuarioAuth, ...)
│   │   ├── utils/       roles.ts
│   │   ├── pages/       LoginPage, RegisterPage, AdminUsersPage
│   │   └── index.ts     barrel
│   ├── categories/      components, hooks (useCategories, useCategoriaForm), services, types, pages, index.ts
│   ├── products/        components, hooks (useProducts, useProductoForm), services, types, utils, pages, index.ts
│   └── ingredients/     components, hooks (useIngredients, useIngredienteForm), services, types, pages, index.ts
├── shared/              Lo que usan varias features
│   ├── components/      Navbar, ThemeToggle, Toast, UnauthorizedPage y ui/ (botón, tabla, modal, estados)
│   ├── api/             api.ts (Axios con withCredentials), setupInterceptors.ts, handleApiError.ts, crud.ts
│   └── utils/           validators.ts
├── store/               themeStore.ts y notificationStore.ts (estado global de interfaz)
├── routes/              AppRouter.tsx y ProtectedRoute.tsx
├── App.tsx              solo checkAuth() al iniciar y monta <AppRouter /> y <Toast />
└── main.tsx             providers, interceptores y alias de tema
```

### Reglas que sigue el código

- **Barrels:** cada feature expone su API pública en `index.ts` con exportaciones con nombre. Una feature
  solo importa de otra a través de su barrel (por ejemplo `import { useAuthStore } from "@/features/auth"`
  o `import { useCategories } from "@/features/categories"`), nunca de sus subcarpetas.
- **Shared:** lo que usan varias features vive en `shared/` o `store/`.
- **Alias `@/`:** apunta a `src/`; está declarado en `vite.config.ts` (`resolve.alias`) y en
  `tsconfig.app.json` (`paths`). Los imports entre carpetas lo usan.
- **Hooks por feature:** `useCategories`, `useProducts`, `useIngredients` y `useUsuarios` encapsulan
  `useQuery` y `useMutation` (TanStack Query) y las llamadas a la API; invalidan el listado y avisan con
  una notificación. `useAuth` encapsula inicio y cierre de sesión y la lectura del store. Las páginas no
  llaman a Axios ni a TanStack Query.
- **`App.tsx`** no tiene lógica de negocio.

## Rutas y protección

| Ruta | Página | Acceso |
|---|---|---|
| `/login`, `/register`, `/unauthorized` | Login, registro y acceso denegado | públicas |
| `/categories`, `/products`, `/ingredients` | Listados (crear, editar y eliminar solo para `admin`) | usuario autenticado |
| `/admin/users` | Usuarios con Activar / Desactivar | solo `admin` |

`ProtectedRoute` es una ruta padre sin `path`; las rutas protegidas son sus hijas y se muestran con
`<Outlet />`:

| Estado | Resultado |
|---|---|
| Verificando la sesión (`GET /auth/me`) | indicador de carga, sin redirigir |
| Sin sesión | `/login` (guarda la pantalla pedida y vuelve a ella después del login) |
| Sesión pero rol no permitido | `/unauthorized` |
| Sesión y rol permitido | la página pedida |

La protección de rutas ordena la navegación; la seguridad real la aplica el backend, que valida la
cookie y el rol en cada petición (401 y 403).

### 401 y 403 (`shared/api/setupInterceptors.ts`)

- **401** (sesión vencida, salvo en `/auth/token` y `/auth/me`): limpia la sesión del store y
  `ProtectedRoute` lleva al login. No se recarga la página.
- **403** (sesión válida sin permisos): muestra una notificación de acceso denegado; no cierra la sesión
  ni redirige al login.

## Estado global (Zustand)

- `store/themeStore.ts`: `darkMode` y `toggleTheme`, con `persist` (`name: "theme-storage"`). El botón del
  Navbar alterna el tema. El store aplica la clase `dark` en `<html>` y Tailwind la usa con
  `@custom-variant dark` (`index.css`).
- `store/notificationStore.ts`: `message`, `show`, `showNotification` y `hideNotification`. `Toast` se monta
  una vez en `App.tsx` y se oculta a los 3 segundos. Los hooks de las features lo usan para avisar altas,
  ediciones, bajas y errores.
- `features/auth/store/authStore.ts`: `user`, `status` (`checking` | `authenticated` | `unauthenticated`),
  `checkAuth`, `login`, `logout` y `hasRole`. **No usa `persist`**: el token viaja en la cookie HttpOnly y
  el usuario se recupera con `/auth/me` al iniciar. Solo se persisten preferencias de interfaz.
