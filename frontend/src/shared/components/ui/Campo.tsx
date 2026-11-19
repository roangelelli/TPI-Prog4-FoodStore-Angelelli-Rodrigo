import type { ReactNode } from "react";

// Clases compartidas por los inputs de los formularios.
export const claseInput =
  "mt-1 w-full rounded-md border border-slate-300 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

interface CampoProps {
  id: string;
  etiqueta: string;
  /** field.state.meta.errors de TanStack Form: un array, puede haber varios mensajes. */
  errores: ReadonlyArray<unknown>;
  children: ReactNode;
}

/** Etiqueta + input (children) + mensajes de validación de un campo. */
export default function Campo({ id, etiqueta, errores, children }: CampoProps) {
  // onChange y onBlur pueden devolver el mismo mensaje: se muestra una sola vez.
  const mensajes = [...new Set(errores.filter(Boolean).map(String))];
  return (
    <div className="mt-4">
      <label htmlFor={id} className="block text-xs font-medium text-secondary">
        {etiqueta}
      </label>
      {children}
      {mensajes.map((mensaje) => (
        <p key={mensaje} role="alert" className="mt-1 text-xs text-error">
          {mensaje}
        </p>
      ))}
    </div>
  );
}
