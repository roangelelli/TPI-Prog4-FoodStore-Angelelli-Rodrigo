import { useForm } from "@tanstack/react-form";
import type { Categoria } from "@/features/categorias/types/categoria.types";
import BotonesFormulario from "@/shared/ui/BotonesFormulario";
import Campo from "@/shared/ui/Campo";
import Input, { claseInput } from "@/shared/ui/Input";
import Modal from "@/shared/ui/Modal";
import { largoEntre, numeroMinimo } from "@/shared/utils/validators";
import type { Producto, ProductoFormData } from "../types/producto.types";

interface ProductoModalProps {
  abierto: boolean;
  producto: Producto | null;
  categorias: Categoria[];
  guardando: boolean;
  onGuardar: (datos: ProductoFormData) => void;
  onClose: () => void;
}

function Formulario({ producto, categorias, guardando, onGuardar, onClose }: Omit<ProductoModalProps, "abierto">) {
  const form = useForm({
    defaultValues: {
      categoria_id: producto?.categoria_id ?? categorias[0]?.id ?? 0,
      nombre: producto?.nombre ?? "",
      descripcion: producto?.descripcion ?? "",
      precio_base: producto?.precio_base ?? 0,
      imagen_url: producto?.imagen_url ?? "",
      stock: producto?.stock ?? 0,
      disponible: producto?.disponible ?? true,
    } satisfies ProductoFormData,
    onSubmit: ({ value }) => onGuardar({ ...value, nombre: value.nombre.trim() }),
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
      <form.Field name="categoria_id" validators={{ onChange: numeroMinimo(1, "Elegí una categoría") }}>
        {(field) => (
          <Campo id="categoria" etiqueta="Categoría" errores={field.state.meta.errors}>
            <select
              id="categoria"
              className={claseInput}
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
            >
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </Campo>
        )}
      </form.Field>

      <form.Field
        name="nombre"
        validators={{ onChange: largoEntre(1, 150, "El nombre es obligatorio (máx. 150 caracteres)") }}
      >
        {(field) => (
          <Campo id="nombre" etiqueta="Nombre" errores={field.state.meta.errors}>
            <Input
              id="nombre"
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
              rows={2}
              className={claseInput}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </Campo>
        )}
      </form.Field>

      <div className="grid grid-cols-2 gap-4">
        <form.Field name="precio_base" validators={{ onChange: numeroMinimo(0, "El precio no puede ser negativo") }}>
          {(field) => (
            <Campo id="precio" etiqueta="Precio" errores={field.state.meta.errors}>
              <Input
                id="precio"
                type="number"
                min={0}
                step="0.01"
                value={Number.isNaN(field.state.value) ? "" : field.state.value}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
            </Campo>
          )}
        </form.Field>

        <form.Field name="stock" validators={{ onChange: numeroMinimo(0, "El stock no puede ser negativo") }}>
          {(field) => (
            <Campo id="stock" etiqueta="Stock" errores={field.state.meta.errors}>
              <Input
                id="stock"
                type="number"
                min={0}
                step={1}
                value={Number.isNaN(field.state.value) ? "" : field.state.value}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
            </Campo>
          )}
        </form.Field>
      </div>

      <form.Field name="imagen_url">
        {(field) => (
          <Campo id="imagen" etiqueta="URL de la imagen" errores={field.state.meta.errors}>
            <Input
              id="imagen"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="https://..."
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

export default function ProductoModal({ abierto, producto, ...resto }: ProductoModalProps) {
  return (
    <Modal abierto={abierto} titulo={producto ? "Editar producto" : "Nuevo producto"} onClose={resto.onClose}>
      <Formulario key={producto?.id ?? "nuevo"} producto={producto} {...resto} />
    </Modal>
  );
}
