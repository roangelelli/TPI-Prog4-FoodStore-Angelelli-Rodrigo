import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <Outlet />
      </main>
      <footer className="py-6 text-center text-xs text-secondary">Food Store · TPI Programación 4 · UTN TUPAD</footer>
    </div>
  );
}
