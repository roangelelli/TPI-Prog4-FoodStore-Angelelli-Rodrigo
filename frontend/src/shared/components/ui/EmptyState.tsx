import type { ReactNode } from "react";

interface EmptyStateProps {
  titulo: string;
  descripcion?: string;
  accion?: ReactNode;
}

/** Estado vacío: explica por qué no hay datos y sugiere una acción. */
export default function EmptyState({ titulo, descripcion, accion }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-10 text-center">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{titulo}</h2>
      {descripcion && <p className="mt-1 text-sm text-secondary">{descripcion}</p>}
      {accion && <div className="mt-4 flex justify-center">{accion}</div>}
    </div>
  );
}
