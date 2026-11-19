import type { UsuarioAuth } from "@/features/auth/types/auth.types";

/** Texto del rol para mostrar en el Navbar. */
export const etiquetaRol = (user: UsuarioAuth): string =>
  user.roles.length === 0 ? "sin rol" : user.roles.join(", ");
