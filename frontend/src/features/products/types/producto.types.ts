export interface CategoriaDelProducto {
  id: number;
  nombre: string;
  es_principal: boolean;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_base: number;
  imagenes_url: string[];
  disponible: boolean;
  categorias: CategoriaDelProducto[];
}

/** Campos del producto que recibe el backend (POST y PUT). */
export type ProductoDatos = Pick<Producto, "nombre" | "descripcion" | "precio_base" | "disponible">;

/** Datos del formulario: los del producto más las categorías elegidas (ProductoCategoria). */
export interface ProductoFormData extends ProductoDatos {
  categorias_ids: number[];
  categoria_principal_id: number | null;
}
