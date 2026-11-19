import { api } from "./api";

/**
 * Funciones de acceso a un recurso REST del backend, hechas con la instancia de Axios.
 * Se usan como queryFn y mutationFn de TanStack Query.
 *
 * T es el tipo del recurso y TForm, los datos que envía el formulario.
 */
export function crearServicioCrud<T, TForm>(recurso: string) {
  const base = `/${recurso}/`;

  return {
    getAll: async (): Promise<T[]> => (await api.get<T[]>(base)).data,
    create: async (datos: TForm): Promise<T> => (await api.post<T>(base, datos)).data,
    update: async (id: number, datos: TForm): Promise<T> =>
      (await api.put<T>(`${base}${id}`, datos)).data,
    remove: async (id: number): Promise<void> => {
      await api.delete(`${base}${id}`);
    },
  };
}
