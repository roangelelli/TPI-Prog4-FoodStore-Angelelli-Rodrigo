import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { handleApiError } from "@/shared/api/handleApiError";
import Button from "@/shared/ui/Button";
import Campo from "@/shared/ui/Campo";
import Card from "@/shared/ui/Card";
import Input from "@/shared/ui/Input";
import Logo from "@/shared/ui/Logo";
import { emailValido, largoEntre, passwordValida, requerido } from "@/shared/utils/validators";
import { useAuthStore } from "@/store/authStore";
import { requestRegister } from "../api/auth";

export default function RegisterPage() {
  const usuario = useAuthStore((state) => state.usuario);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { username: "", full_name: "", email: "", password: "", confirmar: "" },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        await requestRegister({
          username: value.username.trim(),
          full_name: value.full_name.trim(),
          email: value.email.trim(),
          password: value.password,
        });
        navigate("/login", { replace: true, state: { registrado: true } });
      } catch (e) {
        setError(handleApiError(e));
      }
    },
  });

  if (usuario) return <Navigate to="/" replace />;

  return (
    <div className="mx-auto max-w-sm pt-4">
      <div className="mb-6 text-center">
        <div className="flex justify-center">
          <Logo size={48} />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">Crear cuenta</h1>
        <p className="mt-1 text-sm text-secondary">Registrate para empezar a pedir</p>
      </div>
      <Card>
        <form
          className="-mt-4"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <form.Field
            name="username"
            validators={{ onChange: largoEntre(3, 50, "El usuario debe tener entre 3 y 50 caracteres") }}
          >
            {(field) => (
              <Campo id="username" etiqueta="Usuario" errores={field.state.meta.errors}>
                <Input
                  id="username"
                  autoComplete="username"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Campo>
            )}
          </form.Field>

          <form.Field name="full_name" validators={{ onChange: requerido("El nombre es obligatorio") }}>
            {(field) => (
              <Campo id="full_name" etiqueta="Nombre completo" errores={field.state.meta.errors}>
                <Input
                  id="full_name"
                  autoComplete="name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Campo>
            )}
          </form.Field>

          <form.Field name="email" validators={{ onChange: emailValido }}>
            {(field) => (
              <Campo id="email" etiqueta="Email" errores={field.state.meta.errors}>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Campo>
            )}
          </form.Field>

          <form.Field name="password" validators={{ onChange: passwordValida }}>
            {(field) => (
              <Campo id="password" etiqueta="Contraseña" errores={field.state.meta.errors}>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Campo>
            )}
          </form.Field>

          <form.Field
            name="confirmar"
            validators={{
              onChangeListenTo: ["password"],
              onChange: ({ value, fieldApi }) =>
                value !== fieldApi.form.getFieldValue("password") ? "Las contraseñas no coinciden" : undefined,
            }}
          >
            {(field) => (
              <Campo id="confirmar" etiqueta="Repetir contraseña" errores={field.state.meta.errors}>
                <Input
                  id="confirmar"
                  type="password"
                  autoComplete="new-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Campo>
            )}
          </form.Field>

          {error && (
            <p role="alert" className="mt-4 rounded-md bg-error/10 px-3 py-2 text-sm text-error">
              {error}
            </p>
          )}

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" className="mt-6 w-full" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "Creando..." : "Registrarme"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </Card>
      <p className="mt-4 text-center text-sm text-secondary">
        ¿Ya tenés cuenta?{" "}
        <Link to="/login" className="font-medium text-brand hover:underline">
          Iniciá sesión
        </Link>
      </p>
    </div>
  );
}
