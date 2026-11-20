import Button from "./Button";
import Modal from "./Modal";

interface ConfirmModalProps {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  cargando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ConfirmModal({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = "Confirmar",
  cargando = false,
  onConfirmar,
  onCancelar,
}: ConfirmModalProps) {
  return (
    <Modal abierto={abierto} titulo={titulo} onClose={onCancelar}>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{mensaje}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancelar} disabled={cargando}>
          Volver
        </Button>
        <Button variant="danger" onClick={onConfirmar} disabled={cargando}>
          {cargando ? "Procesando..." : textoConfirmar}
        </Button>
      </div>
    </Modal>
  );
}
