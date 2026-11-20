import { useEffect } from "react";
import { AppRouter } from "@/routes/AppRouter";
import Toast from "@/shared/components/Toast";
import { useAuthStore } from "@/store/authStore";

export default function App() {
  const checkSession = useAuthStore((state) => state.checkSession);

  // unica llamada en useEffect: confirmar la sesion al montar
  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  return (
    <>
      <AppRouter />
      <Toast />
    </>
  );
}
