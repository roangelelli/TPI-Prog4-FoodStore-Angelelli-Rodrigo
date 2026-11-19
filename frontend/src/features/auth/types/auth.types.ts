/** Roles que maneja el backend. */
export type Role = "admin" | "user";

/** Usuario autenticado que guarda el AuthStore. No incluye el token: está en la cookie HttpOnly. */
export interface UsuarioAuth {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  /** Nombres de los roles vigentes del usuario (GET /auth/me). */
  roles: Role[];
}

/** Respuesta del backend en GET /auth/me, POST /auth/register y /admin/usuarios. */
export interface UsuarioRespuesta extends UsuarioAuth {
  celular: string | null;
  activo: boolean;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

/** Datos del formulario de registro (celular opcional: puede quedar vacío). */
export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
  password: string;
}

export interface MensajeRespuesta {
  mensaje: string;
}
