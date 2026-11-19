import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthLayout from "@/features/auth/components/AuthLayout";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRegisterForm } from "@/features/auth/hooks/useRegisterForm";
import { handleApiError, obtenerDetalle } from "@/shared/api/handleApiError";
import Button from "@/shared/components/ui/Button";
import Campo, { claseInput } from "@/shared/components/ui/Campo";
import { emailValido, passwordValida, requerido } from "@/shared/utils/validators";

export default function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const form = useRegisterForm(async (datos) => {
    setError(null);
    try {
      await register(datos);
      // Al completar el registro se redirige al login.
      navigate("/login", { replace: true, state: { registrado: true } });
    } catch (e) {
      // 409: el email ya existe (mensaje del backend). 422: datos inválidos.
      setError(obtenerDetalle(e) ?? handleApiError(e));
    }
  });

  if (user) return <Navigate to="/categories" replace />;

  return (
    <AuthLayout titulo="Crear cuenta">
      <form
        noValidate
        className="mt-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.Field
          name="nombre"
          validators={{
            onChange: requerido("El nombre es obligatorio"),
            onBlur: requerido("El nombre es obligatorio"),
          }}
        >
          {(field) => (
            <Campo id="nombre" etiqueta="Nombre" errores={field.state.meta.errors}>
              <input
                id="nombre"
                autoFocus
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={claseInput}
              />
            </Campo>
          )}
        </form.Field>

        <form.Field
          name="apellido"
          validators={{
            onChange: requerido("El apellido es obligatorio"),
            onBlur: requerido("El apellido es obligatorio"),
          }}
        >
          {(field) => (
            <Campo id="apellido" etiqueta="Apellido" errores={field.state.meta.errors}>
              <input
                id="apellido"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={claseInput}
              />
            </Campo>
          )}
        </form.Field>

        <form.Field name="email" validators={{ onChange: emailValido, onBlur: emailValido }}>
          {(field) => (
            <Campo id="email" etiqueta="Email" errores={field.state.meta.errors}>
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={claseInput}
              />
            </Campo>
          )}
        </form.Field>

        <form.Field name="celular">
          {(field) => (
            <Campo id="celular" etiqueta="Celular (opcional)" errores={field.state.meta.errors}>
              <input
                id="celular"
                type="tel"
                maxLength={20}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={claseInput}
              />
            </Campo>
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{ onChange: passwordValida, onBlur: passwordValida }}
        >
          {(field) => (
            <Campo
              id="password"
              etiqueta="Contraseña (mínimo 8 caracteres)"
              errores={field.state.meta.errors}
            >
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={claseInput}
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
              {isSubmitting ? "Creando cuenta..." : "Registrarme"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <p className="mt-4 text-center text-sm text-secondary">
        ¿Ya tenés cuenta?{" "}
        <Link to="/login" className="font-medium text-brand hover:underline">
          Iniciá sesión
        </Link>
      </p>
    </AuthLayout>
  );
}
