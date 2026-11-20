import { api } from "@/shared/api/axiosInstance";
import type {
  FiltrosProductos,
  Producto,
  ProductoFormData,
  ProductosPaginados,
  StockFormData,
} from "../types/producto.types";

export async function getProductos(filtros: FiltrosProductos): Promise<ProductosPaginados> {
  return (await api.get<ProductosPaginados>("/productos", { params: filtros })).data;
}

// los campos vacios se mandan como null
function armarBody(datos: ProductoFormData) {
  return {
    ...datos,
    descripcion: datos.descripcion.trim() || null,
    imagen_url: datos.imagen_url.trim() || null,
  };
}

export async function createProducto(datos: ProductoFormData): Promise<Producto> {
  return (await api.post<Producto>("/productos", armarBody(datos))).data;
}

export async function updateProducto(id: number, datos: ProductoFormData): Promise<Producto> {
  return (await api.put<Producto>(`/productos/${id}`, armarBody(datos))).data;
}

export async function patchStock(id: number, datos: StockFormData): Promise<Producto> {
  return (await api.patch<Producto>(`/productos/${id}/stock`, datos)).data;
}

export async function deleteProducto(id: number): Promise<void> {
  await api.delete(`/productos/${id}`);
}
