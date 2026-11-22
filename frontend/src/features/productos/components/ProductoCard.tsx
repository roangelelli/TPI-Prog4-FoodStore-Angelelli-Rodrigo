import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import { formatearPrecio } from "@/shared/utils/formato";
import type { Producto } from "../types/producto.types";

interface ProductoCardProps {
  producto: Producto;
  enCarrito: number;
  onAgregar: (producto: Producto) => void;
}

export default function ProductoCard({ producto, enCarrito, onAgregar }: ProductoCardProps) {
  const sinStock = !producto.disponible || producto.stock === 0;
  const tope = enCarrito >= producto.stock;

  return (
    <Card className="flex flex-col overflow-hidden !p-0 transition hover:-translate-y-0.5 hover:shadow-md">
      {producto.imagen_url ? (
        <img src={producto.imagen_url} alt={producto.nombre} className="h-40 w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-40 items-center justify-center bg-slate-100 text-sm text-secondary dark:bg-slate-700">
          Sin imagen
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-brand">{producto.categoria.nombre}</span>
        <h3 className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{producto.nombre}</h3>
        {producto.descripcion && <p className="mt-1 line-clamp-2 text-sm text-secondary">{producto.descripcion}</p>}
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {formatearPrecio(producto.precio_base)}
          </span>
          {sinStock ? (
            <span className="text-xs font-semibold text-error">Sin stock</span>
          ) : (
            <span className="text-xs text-secondary">Stock: {producto.stock}</span>
          )}
        </div>
        <Button className="mt-3" disabled={sinStock || tope} onClick={() => onAgregar(producto)}>
          {tope && !sinStock ? "Máximo en el carrito" : "Agregar al carrito"}
        </Button>
      </div>
    </Card>
  );
}
