import { useForm } from "@tanstack/react-form";
import type { LoginCredentials } from "@/features/auth/types/auth.types";

const LOGIN_VACIO: LoginCredentials = { email: "", password: "" };

/** Formulario de inicio de sesión (TanStack Form). El envío llama a login del AuthStore. */
export function useLoginForm(onSubmit: (datos: LoginCredentials) => Promise<void>) {
  return useForm({
    defaultValues: LOGIN_VACIO,
    onSubmit: async ({ value }) => onSubmit({ email: value.email.trim(), password: value.password }),
  });
}

export type LoginFormApi = ReturnType<typeof useLoginForm>;
