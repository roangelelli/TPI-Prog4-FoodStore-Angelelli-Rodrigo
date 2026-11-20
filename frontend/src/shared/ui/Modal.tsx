import { useEffect } from "react";
import type { ReactNode } from "react";

interface ModalProps {
  abierto: boolean;
  titulo: string;
  onClose: () => void;
  children: ReactNode;
  ancho?: string;
}

export default function Modal({ abierto, titulo, onClose, children, ancho = "max-w-md" }: ModalProps) {
  useEffect(() => {
    if (!abierto) return;
    const alPresionar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") onClose();
    };
    window.addEventListener("keydown", alPresionar);
    return () => window.removeEventListener("keydown", alPresionar);
  }, [abierto, onClose]);

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className={`max-h-[90vh] w-full overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800 ${ancho}`}
      >
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{titulo}</h2>
        {children}
      </div>
    </div>
  );
}
