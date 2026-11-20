// cada validador devuelve el mensaje de error o undefined si esta bien

export const requerido =
  (mensaje: string) =>
  ({ value }: { value: string }): string | undefined =>
    value.trim() === "" ? mensaje : undefined;

export const largoEntre =
  (min: number, max: number, mensaje: string) =>
  ({ value }: { value: string }): string | undefined => {
    const largo = value.trim().length;
    return largo < min || largo > max ? mensaje : undefined;
  };

export const numeroMinimo =
  (min: number, mensaje: string) =>
  ({ value }: { value: number }): string | undefined =>
    Number.isNaN(value) || value < min ? mensaje : undefined;

const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emailValido = ({ value }: { value: string }): string | undefined => {
  if (value.trim() === "") return "El email es obligatorio";
  return FORMATO_EMAIL.test(value.trim()) ? undefined : "Ingresá un email válido";
};

// el backend pide entre 8 y 72 caracteres
export const passwordValida = ({ value }: { value: string }): string | undefined => {
  if (value === "") return "La contraseña es obligatoria";
  if (value.length < 8) return "La contraseña debe tener al menos 8 caracteres";
  if (value.length > 72) return "La contraseña no puede superar los 72 caracteres";
  return undefined;
};
