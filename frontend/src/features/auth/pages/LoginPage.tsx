import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "@/features/auth/components/AuthLayout";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLoginForm } from "@/features/auth/hooks/useLoginForm";
import { handleApiError, obtenerDetalle } from "@/shared/api/handleApiError";
import Button from "@/shared/components/ui/Button";
import Campo, { claseInput } from "@/shared/components/ui/Campo";
import { emailValido, requerido } from "@/shared/utils/validators";

export default function LoginPage() {
  const { user, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  // Pantalla que pidió el usuario antes de que ProtectedRoute lo mandara al login.
  const desde = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
  const registrado = (location.state as { registrado?: boolean } | null)?.registrado === true;
  const [error, setError] = useState<string | null>(null);

  const form = useLoginForm(async ({ email, password }) => {
    setError(null);
    try {
      await login(email, password);
      navigate(desde ?? "/categories", { replace: true }); // vuelve a la pantalla que pidió
    } catch (e) {
      // Con credenciales incorrectas el backend responde 401 con su mensaje: se muestra
      // aquí, sin recargar la página.
      setError(obtenerDetalle(e) ?? handleApiError(e));
    }
  });

  // Con una sesión activa no tiene sentido ver el formulario.
  if (user) return <Navigate to={desde ?? "/categories"} replace />;

  return (
    <AuthLayout titulo="Iniciar sesión">
      {registrado && (
        <p role="status" className="mt-4 rounded-md bg-success/10 px-3 py-2 text-sm text-success">
          Cuenta creada. Iniciá sesión con tu email y tu contraseña.
        </p>
      )}

      <form
        noValidate
        className="mt-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.Field name="email" validators={{ onChange: emailValido, onBlur: emailValido }}>
          {(field) => (
            <Campo id="email" etiqueta="Email" errores={field.state.meta.errors}>
              <input
                id="email"
                type="email"
                autoComplete="username"
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
          name="password"
          validators={{
            onChange: requerido("La contraseña es obligatoria"),
            onBlur: requerido("La contraseña es obligatoria"),
          }}
        >
          {(field) => (
            <Campo id="password" etiqueta="Contraseña" errores={field.state.meta.errors}>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
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
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <p className="mt-4 text-center text-sm text-secondary">
        ¿No tenés cuenta?{" "}
        <Link to="/register" className="font-medium text-brand hover:underline">
          Registrate
        </Link>
      </p>
    </AuthLayout>
  );
}
