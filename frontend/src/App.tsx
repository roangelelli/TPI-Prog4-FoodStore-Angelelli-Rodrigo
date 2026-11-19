import { useEffect } from "react";
import { useAuthStore } from "@/features/auth";
import { AppRouter } from "@/routes/AppRouter";
import Toast from "@/shared/components/Toast";

// App solo compone la aplicación: confirma la sesión al iniciar y monta el router y el Toast.
function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    void checkAuth(); // GET /auth/me con la cookie
  }, [checkAuth]);

  return (
    <>
      <AppRouter />
      <Toast />
    </>
  );
}

export default App;
