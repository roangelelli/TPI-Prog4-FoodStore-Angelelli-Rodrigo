export interface Ingrediente {
  id: number;
  nombre: string;
}

export type IngredienteFormData = Omit<Ingrediente, "id">;
