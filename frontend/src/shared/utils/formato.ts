const moneda = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });

export const formatearPrecio = (valor: number): string => moneda.format(valor);

// el backend manda la fecha en utc sin zona, se le agrega la Z para convertirla bien
export const formatearFecha = (iso: string): string => {
  const conZona = /(Z|[+-]\d\d:?\d\d)$/.test(iso) ? iso : `${iso}Z`;
  return new Date(conZona).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });
};
