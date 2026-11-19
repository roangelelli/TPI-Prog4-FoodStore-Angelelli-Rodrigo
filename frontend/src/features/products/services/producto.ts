import { api } from "@/shared/api/api";
import { crearServicioCrud } from "@/shared/api/crud";
import type {
  CategoriaDelProducto,
  Producto,
  ProductoDatos,
} from "@/features/products/types/producto.types";

const servicio = crearServicioCrud<Producto, ProductoDatos>("productos");

export const getProductos = servicio.getAll;
export const createProducto = servicio.create;
export const updateProducto = servicio.update;
export const deleteProducto = servicio.remove;

/**
 * Deja las categorías del producto (tabla ProductoCategoria) como las eligió el admin.
 * Primero quita las que sobran, después agrega las nuevas y por último ajusta cuál es la
 * principal. Un producto tiene una sola categoría principal: el backend desmarca la anterior.
 */
export async function sincronizarCategorias(
  productoId: number,
  actuales: CategoriaDelProducto[],
  elegidas: number[],
  principalId: number | null,
): Promise<void> {
  const ruta = `/productos/${productoId}/categorias`;
  const idsActuales = actuales.map((c) => c.id);

  for (const id of idsActuales.filter((id) => !elegidas.includes(id))) {
    await api.delete(`${ruta}/${id}`);
  }
  for (const id of elegidas.filter((id) => !idsActuales.includes(id))) {
    await api.post(ruta, { categoria_id: id, es_principal: id === principalId });
  }
  for (const actual of actuales.filter((c) => elegidas.includes(c.id))) {
    const deberiaSerPrincipal = actual.id === principalId;
    if (actual.es_principal !== deberiaSerPrincipal) {
      await api.put(`${ruta}/${actual.id}`, { es_principal: deberiaSerPrincipal });
    }
  }
}
