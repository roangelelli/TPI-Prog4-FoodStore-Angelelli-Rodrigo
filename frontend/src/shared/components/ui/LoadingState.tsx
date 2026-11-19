interface LoadingStateProps {
  mensaje?: string;
  filas?: number;
}

/** Estado de carga: skeleton con la forma aproximada de una tabla. */
export default function LoadingState({ mensaje = "Cargando...", filas = 4 }: LoadingStateProps) {
  return (
    <div role="status" aria-busy="true" className="space-y-3">
      <p className="text-sm text-secondary">{mensaje}</p>
      {Array.from({ length: filas }, (_, indice) => (
        <div key={indice} className="h-12 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
      ))}
    </div>
  );
}
