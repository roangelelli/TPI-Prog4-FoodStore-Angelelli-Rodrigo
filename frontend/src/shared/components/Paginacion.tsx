import Button from "@/shared/ui/Button";

interface PaginacionProps {
  pagina: number; // arranca en 0
  total: number;
  limite: number;
  onCambiar: (pagina: number) => void;
}

export default function Paginacion({ pagina, total, limite, onCambiar }: PaginacionProps) {
  const paginas = Math.max(Math.ceil(total / limite), 1);
  return (
    <div className="mt-6 flex items-center justify-between text-sm text-secondary">
      <span>
        Página {pagina + 1} de {paginas}
      </span>
      <div className="flex gap-2">
        <Button variant="outline" disabled={pagina === 0} onClick={() => onCambiar(pagina - 1)}>
          Anterior
        </Button>
        <Button variant="outline" disabled={pagina + 1 >= paginas} onClick={() => onCambiar(pagina + 1)}>
          Siguiente
        </Button>
      </div>
    </div>
  );
}
