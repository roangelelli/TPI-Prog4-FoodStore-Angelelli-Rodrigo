import type { ReactNode } from "react";

interface AuthLayoutProps {
  titulo: string;
  children: ReactNode;
}

/** Contenedor común de las pantallas públicas de acceso (login y registro). */
export default function AuthLayout({ titulo, children }: AuthLayoutProps) {
  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{titulo}</h1>
      {children}
    </main>
  );
}
