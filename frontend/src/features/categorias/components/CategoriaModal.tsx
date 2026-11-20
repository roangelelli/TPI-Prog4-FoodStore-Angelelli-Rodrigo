import { useForm } from "@tanstack/react-form";
import BotonesFormulario from "@/shared/ui/BotonesFormulario";
import Campo from "@/shared/ui/Campo";
import Input, { claseInput } from "@/shared/ui/Input";
import Modal from "@/shared/ui/Modal";
import { largoEntre } from "@/shared/utils/validators";
import type { Categoria, CategoriaFormData } from "../types/categoria.types";

interface CategoriaModalProps {
  abierto: boolean;
  categoria: Categoria | null;
  guardando: boolean;
  onGuardar: (datos: CategoriaFormData) => void;
  onClose: () => void;
}

function Formulario({ categoria, guardando, onGuardar, onClose }: Omit<CategoriaModalProps, "abierto">) {
  const form = useForm({
    defaultValues: { nombre: categoria?.nombre ?? "", descripcion: categoria?.descripcion ?? "" },
    onSubmit: ({ value }) => onGuardar({ nombre: value.nombre.trim(), descripcion: value.descripcion.trim() }),
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
      <form.Field
        name="nombre"
        validators={{ onChange: largoEntre(2, 100, "El nombre debe tener entre 2 y 100 caracteres") }}
      >
        {(field) => (
          <Campo id="nombre" etiqueta="Nombre" errores={field.state.meta.errors}>
            <Input
              id="nombre"
              autoFocus
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </Campo>
        )}
      </form.Field>

      <form.Field name="descripcion">
        {(field) => (
          <Campo id="descripcion" etiqueta="Descripción" errores={field.state.meta.errors}>
            <textarea
              id="descripcion"
              rows={3}
              className={claseInput}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </Campo>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => state.canSubmit}>
        {(canSubmit) => <BotonesFormulario guardando={guardando} deshabilitado={!canSubmit} onCancelar={onClose} />}
      </form.Subscribe>
    </form>
  );
}

export default function CategoriaModal({ abierto, categoria, ...resto }: CategoriaModalProps) {
  return (
    <Modal abierto={abierto} titulo={categoria ? "Editar categoría" : "Nueva categoría"} onClose={resto.onClose}>
      {/* la key reinicia el formulario cada vez que cambia la categoria */}
      <Formulario key={categoria?.id ?? "nueva"} categoria={categoria} {...resto} />
    </Modal>
  );
}
