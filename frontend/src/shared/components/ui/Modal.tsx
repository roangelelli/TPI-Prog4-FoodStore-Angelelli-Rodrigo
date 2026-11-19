import { useEffect } from "react";
import type { ReactNode } from "react";

interface ModalProps {
  /** Estado booleano que controla la página con useState. */
  abierto: boolean;
  titulo: string;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ abierto, titulo, onClose, children }: ModalProps) {
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
        className="w-full max-w-sm rounded-xl bg-white dark:bg-slate-800 p-6 shadow-xl"
      >
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{titulo}</h2>
        {children}
      </div>
    </div>
  );
}
