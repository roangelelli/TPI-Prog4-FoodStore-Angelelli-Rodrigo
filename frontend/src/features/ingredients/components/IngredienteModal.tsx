import type { IngredienteFormApi } from "@/features/ingredients/hooks/useIngredienteForm";
import { requerido } from "@/shared/utils/validators";
import BotonesFormulario from "@/shared/components/ui/BotonesFormulario";
import Campo, { claseInput } from "@/shared/components/ui/Campo";
import Modal from "@/shared/components/ui/Modal";

interface IngredienteModalProps {
  abierto: boolean;
  modoEdicion: boolean;
  form: IngredienteFormApi;
  guardando: boolean;
  error: string | null;
  onClose: () => void;
}

export default function IngredienteModal({
  abierto,
  modoEdicion,
  form,
  guardando,
  error,
  onClose,
}: IngredienteModalProps) {
  return (
    <Modal
      abierto={abierto}
      titulo={modoEdicion ? "Editar ingrediente" : "Nuevo ingrediente"}
      onClose={onClose}
    >
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.Field
          name="nombre"
          validators={{
            onChange: requerido("El nombre es obligatorio"),
            onBlur: requerido("El nombre es obligatorio"),
          }}
        >
          {(field) => (
            <Campo id="nombre" etiqueta="Nombre del ingrediente" errores={field.state.meta.errors}>
              <input
                id="nombre"
                autoFocus
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={claseInput}
              />
            </Campo>
          )}
        </form.Field>

        {error && (
          <p role="alert" className="mt-4 rounded-md bg-error/10 px-3 py-2 text-sm text-error">
            {error}
          </p>
        )}

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
          {([canSubmit, isSubmitting]) => (
            <BotonesFormulario
              guardando={guardando || isSubmitting}
              deshabilitado={!canSubmit}
              onCancelar={onClose}
            />
          )}
        </form.Subscribe>
      </form>
    </Modal>
  );
}
