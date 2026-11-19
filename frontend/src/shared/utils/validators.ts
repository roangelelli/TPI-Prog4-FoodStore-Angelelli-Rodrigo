// Validadores para los campos de TanStack Form. Cada función recibe el valor del
// campo y devuelve el mensaje de error, o undefined si el valor es válido.

export const requerido =
  (mensaje: string) =>
  ({ value }: { value: string }): string | undefined =>
    value.trim() === "" ? mensaje : undefined;

export const precioValido = ({ value }: { value: number }): string | undefined => {
  if (Number.isNaN(value)) return "Ingresá un precio válido";
  if (value < 0) return "El precio no puede ser negativo";
  return undefined;
};

const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emailValido = ({ value }: { value: string }): string | undefined => {
  if (value.trim() === "") return "El email es obligatorio";
  return FORMATO_EMAIL.test(value.trim()) ? undefined : "Ingresá un email válido";
};

/** Misma regla que el backend (RN-09): entre 8 y 72 caracteres. */
export const passwordValida = ({ value }: { value: string }): string | undefined => {
  if (value === "") return "La contraseña es obligatoria";
  if (value.length < 8) return "La contraseña debe tener al menos 8 caracteres";
  if (value.length > 72) return "La contraseña no puede superar los 72 caracteres";
  return undefined;
};
