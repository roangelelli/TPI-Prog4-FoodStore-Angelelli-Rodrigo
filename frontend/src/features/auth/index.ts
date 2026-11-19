// API pública de la feature auth: otras partes de la aplicación importan solo de acá.
export { useAuthStore } from "./store/authStore";
export { useAuth } from "./hooks/useAuth";
export { etiquetaRol } from "./utils/roles";
export { default as LoginPage } from "./pages/LoginPage";
export { default as RegisterPage } from "./pages/RegisterPage";
export { default as AdminUsersPage } from "./pages/AdminUsersPage";
export type { Role, UsuarioAuth } from "./types/auth.types";
