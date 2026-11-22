import { Link, useNavigate } from "react-router-dom";
import EstadoVacio from "@/shared/components/EstadoVacio";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import Input from "@/shared/ui/Input";
import { formatearPrecio } from "@/shared/utils/formato";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

export default function CarritoPage() {
  const navigate = useNavigate();
  const usuario = useAuthStore((state) => state.usuario);
  const { items, quitar, cambiarCantidad, vaciar, total } = useCartStore();

  if (items.length === 0) {
    return (
      <EstadoVacio
        titulo="Tu carrito está vacío"
        descripcion="Sumá productos desde el catálogo."
        accion={
          <Link to="/">
            <Button>Ir al catálogo</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">Carrito</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.producto_id} className="flex flex-wrap items-center gap-4 !p-4">
            {item.imagen_url && (
              <img src={item.imagen_url} alt={item.nombre} className="h-16 w-16 rounded-lg object-cover" />
            )}
            <div className="min-w-40 flex-1">
              <p className="font-semibold text-slate-900 dark:text-slate-100">{item.nombre}</p>
              <p className="text-sm text-secondary">{formatearPrecio(item.precio_unitario)} c/u</p>
            </div>
            <Input
              aria-label={`Cantidad de ${item.nombre}`}
              type="number"
              min={1}
              max={item.stock}
              value={item.cantidad}
              onChange={(e) => cambiarCantidad(item.producto_id, Number(e.target.value) || 1)}
              className="!mt-0 w-20"
            />
            <span className="w-28 text-right font-semibold text-slate-900 dark:text-slate-100">
              {formatearPrecio(item.precio_unitario * item.cantidad)}
            </span>
            <Button variant="danger" onClick={() => quitar(item.producto_id)}>
              Quitar
            </Button>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <Button variant="outline" onClick={vaciar}>
          Vaciar carrito
        </Button>
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-slate-900 dark:text-slate-100">Total: {formatearPrecio(total())}</span>
          <Button onClick={() => navigate(usuario ? "/checkout" : "/login", { state: { from: { pathname: "/checkout" } } })}>
            {usuario ? "Continuar" : "Iniciar sesión para comprar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
