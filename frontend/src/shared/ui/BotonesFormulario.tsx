import Button from "./Button";

interface BotonesFormularioProps {
  guardando: boolean;
  deshabilitado: boolean;
  onCancelar: () => void;
}

export default function BotonesFormulario({ guardando, deshabilitado, onCancelar }: BotonesFormularioProps) {
  return (
    <div className="mt-6 flex justify-end gap-2">
      <Button variant="secondary" onClick={onCancelar} disabled={guardando}>
        Cancelar
      </Button>
      <Button type="submit" disabled={guardando || deshabilitado}>
        {guardando ? "Guardando..." : "Guardar"}
      </Button>
    </div>
  );
}
