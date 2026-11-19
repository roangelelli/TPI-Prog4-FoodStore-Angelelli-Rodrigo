import { useEffect } from "react";
import { useNotificationStore } from "@/store/notificationStore";

/** Aviso global. Se monta una sola vez, en App.tsx, y se oculta solo a los 3 segundos. */
export default function Toast() {
  const message = useNotificationStore((state) => state.message);
  const show = useNotificationStore((state) => state.show);
  const hideNotification = useNotificationStore((state) => state.hideNotification);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(hideNotification, 3000);
    // Un mensaje nuevo reinicia el tiempo (message está entre las dependencias).
    return () => clearTimeout(timer);
  }, [show, message, hideNotification]);

  if (!show) return null;
  return (
    <div
      role="status"
      className="fixed bottom-4 right-4 z-20 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white shadow-lg dark:bg-slate-200 dark:text-slate-900"
    >
      {message}
    </div>
  );
}
