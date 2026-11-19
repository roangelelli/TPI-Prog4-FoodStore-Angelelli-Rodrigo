import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AdminUsersPage, LoginPage, RegisterPage } from "@/features/auth";
import { CategoriesPage } from "@/features/categories";
import { IngredientesPage } from "@/features/ingredients";
import { ProductsPage } from "@/features/products";
import Navbar from "@/shared/components/Navbar";
import UnauthorizedPage from "@/shared/components/UnauthorizedPage";
import { ProtectedRoute } from "./ProtectedRoute";

/** Declara todas las rutas, agrupadas por nivel de acceso. */
export function AppRouter() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <Routes>
          {/* Rutas públicas: no pasan por ProtectedRoute */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Cualquier usuario autenticado */}
          <Route element={<ProtectedRoute />}>
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/ingredients" element={<IngredientesPage />} />
          </Route>

          {/* Solo administradores */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Route>

          {/* Cualquier ruta no definida: sin sesión, ProtectedRoute lleva al login */}
          <Route path="*" element={<Navigate to="/categories" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
