import { useState } from "react";
import { useCategorias } from "@/features/categorias/hooks/useCategorias";
import { handleApiError } from "@/shared/api/handleApiError";
import EstadoError from "@/shared/components/EstadoError";
import EstadoVacio from "@/shared/components/EstadoVacio";
import Paginacion from "@/shared/components/Paginacion";
import Skeleton from "@/shared/components/Skeleton";
import { useDebounce } from "@/shared/hooks/useDebounce";
import Input, { claseInput } from "@/shared/ui/Input";
import { useCartStore } from "@/store/cartStore";
import { useNotificationStore } from "@/store/notificationStore";
import ProductoCard from "../components/ProductoCard";
import { useProductos } from "../hooks/useProductos";
import type { Producto } from "../types/producto.types";

const LIMITE = 8;

export default function CatalogoPage() {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | undefined>(undefined);
  const [pagina, setPagina] = useState(0);
  const search = useDebounce(busqueda.trim());

  const items = useCartStore((state) => state.items);
  const agregar = useCartStore((state) => state.agregar);
  const notificar = useNotificationStore((state) => state.showNotification);
  const { categorias } = useCategorias();

  const { data, isPending, isError, error, refetch } = useProductos({
    skip: pagina * LIMITE,
    limit: LIMITE,
    search: search || undefined,
    categoria_id: categoriaId,
  });

  const alAgregar = (p: Producto) => {
    agregar({
      producto_id: p.id,
      nombre: p.nombre,
      precio_unitario: p.precio_base,
      imagen_url: p.imagen_url,
      stock: p.stock,
    });
    notificar(`${p.nombre} agregado al carrito`);
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">Catálogo</h1>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <Input
          aria-label="Buscar productos"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPagina(0);
          }}
          className="!mt-0 sm:max-w-xs"
        />
        <select
          aria-label="Filtrar por categoría"
          className={`${claseInput} !mt-0 sm:max-w-xs`}
          value={categoriaId ?? ""}
          onChange={(e) => {
            setCategoriaId(e.target.value ? Number(e.target.value) : undefined);
            setPagina(0);
          }}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {isError && <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />}

      {isPending && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: LIMITE }, (_, i) => (
            <Skeleton key={i} className="h-72" />
          ))}
        </div>
      )}

      {data && data.items.length === 0 && (
        <EstadoVacio titulo="No encontramos productos" descripcion="Probá con otra búsqueda o categoría." />
      )}

      {data && data.items.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.items.map((p) => (
              <ProductoCard
                key={p.id}
                producto={p}
                enCarrito={items.find((i) => i.producto_id === p.id)?.cantidad ?? 0}
                onAgregar={alAgregar}
              />
            ))}
          </div>
          <Paginacion pagina={pagina} total={data.total} limite={LIMITE} onCambiar={setPagina} />
        </>
      )}
    </div>
  );
}
