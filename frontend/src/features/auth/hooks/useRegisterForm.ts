import { useForm } from "@tanstack/react-form";
import type { RegisterData } from "@/features/auth/types/auth.types";

const REGISTRO_VACIO: RegisterData = { nombre: "", apellido: "", email: "", celular: "", password: "" };

/** Formulario de registro (TanStack Form). */
export function useRegisterForm(onSubmit: (datos: RegisterData) => Promise<void>) {
  return useForm({
    defaultValues: REGISTRO_VACIO,
    onSubmit: async ({ value }) =>
      onSubmit({
        nombre: value.nombre.trim(),
        apellido: value.apellido.trim(),
        email: value.email.trim(),
        celular: value.celular.trim(),
        password: value.password,
      }),
  });
}

export type RegisterFormApi = ReturnType<typeof useRegisterForm>;
