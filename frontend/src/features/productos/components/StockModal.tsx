import { useForm } from "@tanstack/react-form";
import BotonesFormulario from "@/shared/ui/BotonesFormulario";
import Campo from "@/shared/ui/Campo";
import Input from "@/shared/ui/Input";
import Modal from "@/shared/ui/Modal";
import { numeroMinimo } from "@/shared/utils/validators";
import type { Producto, StockFormData } from "../types/producto.types";

interface StockModalProps {
  producto: Producto | null;
  guardando: boolean;
  onGuardar: (datos: StockFormData) => void;
  onClose: () => void;
}

function Formulario({ producto, guardando, onGuardar, onClose }: StockModalProps & { producto: Producto }) {
  const form = useForm({
    defaultValues: { stock: producto.stock, disponible: producto.disponible } satisfies StockFormData,
    onSubmit: ({ value }) => onGuardar(value),
  });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <form.Field name="stock" validators={{ onChange: numeroMinimo(0, "El stock no puede ser negativo") }}>
        {(field) => (
          <Campo id="stock-nuevo" etiqueta="Stock" errores={field.state.meta.errors}>
            <Input
              id="stock-nuevo"
              type="number"
              min={0}
              step={1}
              autoFocus
              value={Number.isNaN(field.state.value) ? "" : field.state.value}
              onChange={(e) => field.handleChange(e.target.valueAsNumber)}
            />
          </Campo>
        )}
      </form.Field>

      <form.Field name="disponible">
        {(field) => (
          <label className="mt-4 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <input
              type="checkbox"
              checked={field.state.value}
              onChange={(e) => field.handleChange(e.target.checked)}
            />
            Disponible para la venta
          </label>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => state.canSubmit}>
        {(canSubmit) => <BotonesFormulario guardando={guardando} deshabilitado={!canSubmit} onCancelar={onClose} />}
      </form.Subscribe>
    </form>
  );
}

export default function StockModal(props: StockModalProps) {
  const { producto } = props;
  return (
    <Modal abierto={producto !== null} titulo={`Stock de ${producto?.nombre ?? ""}`} onClose={props.onClose}>
      {producto && <Formulario key={producto.id} {...props} producto={producto} />}
    </Modal>
  );
}
