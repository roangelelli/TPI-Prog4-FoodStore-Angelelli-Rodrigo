import { useEffect, useState } from "react";

// devuelve el valor recien despues de que dejo de cambiar
export function useDebounce<T>(valor: T, demora = 400): T {
  const [resultado, setResultado] = useState(valor);

  useEffect(() => {
    const timer = setTimeout(() => setResultado(valor), demora);
    return () => clearTimeout(timer);
  }, [valor, demora]);

  return resultado;
}
