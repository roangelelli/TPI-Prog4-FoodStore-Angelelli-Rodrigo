import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { handleApiError } from "@/shared/api/handleApiError";
import Button from "@/shared/ui/Button";
import Campo from "@/shared/ui/Campo";
import Card from "@/shared/ui/Card";
import Input from "@/shared/ui/Input";
import { requerido } from "@/shared/utils/validators";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const usuario = useAuthStore((state) => state.usuario);
  const login = useAuthStore((state) => state.login);
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // pantalla que pidio el usuario antes de que lo mandaran al login
  const desde = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
  const registrado = (location.state as { registrado?: boolean } | null)?.registrado === true;

  const form = useForm({
    defaultValues: { username: "", password: "" },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        await login(value.username.trim(), value.password);
        const rol = useAuthStore.getState().usuario?.role;
        navigate(desde ?? (rol === "admin" ? "/admin/resumen" : "/"), { replace: true });
      } catch (e) {
        setError(handleApiError(e));
      }
    },
  });

  if (usuario) return <Navigate to={desde ?? "/"} replace />;

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">Iniciar sesión</h1>
      {registrado && (
        <p role="status" className="mb-4 rounded-md bg-success/10 px-3 py-2 text-sm text-success">
          Cuenta creada. Iniciá sesión con tu usuario y contraseña.
        </p>
      )}
      <Card>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <form.Field name="username" validators={{ onChange: requerido("El usuario es obligatorio") }}>
            {(field) => (
              <Campo id="username" etiqueta="Usuario" errores={field.state.meta.errors}>
                <Input
                  id="username"
                  autoComplete="username"
                  autoFocus
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Campo>
            )}
          </form.Field>

          <form.Field name="password" validators={{ onChange: requerido("La contraseña es obligatoria") }}>
            {(field) => (
              <Campo id="password" etiqueta="Contraseña" errores={field.state.meta.errors}>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
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
                {isSubmitting ? "Ingresando..." : "Ingresar"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </Card>
      <p className="mt-4 text-center text-sm text-secondary">
        ¿No tenés cuenta?{" "}
        <Link to="/register" className="font-medium text-brand hover:underline">
          Registrate
        </Link>
      </p>
    </div>
  );
}
