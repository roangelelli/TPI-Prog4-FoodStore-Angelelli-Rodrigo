import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Acceso denegado</h1>
      <p className="mt-2 text-sm text-secondary">No tenés permisos para ver esta página.</p>
      <Link to="/" className="mt-6 inline-block font-medium text-brand hover:underline">
        Volver al inicio
      </Link>
    </div>
  );
}
