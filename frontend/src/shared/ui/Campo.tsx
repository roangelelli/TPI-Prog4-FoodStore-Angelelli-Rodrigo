import type { ReactNode } from "react";

interface CampoProps {
  id: string;
  etiqueta: string;
  errores: ReadonlyArray<unknown>;
  children: ReactNode;
}

// etiqueta + input + mensajes de error de un campo de TanStack Form
export default function Campo({ id, etiqueta, errores, children }: CampoProps) {
  // onChange y onBlur pueden repetir el mensaje, se muestra una vez
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
