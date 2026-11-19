import type { ProductoFormApi } from "@/features/products/hooks/useProductoForm";
import type { Categoria } from "@/features/categories";
import { precioValido, requerido } from "@/shared/utils/validators";
import BotonesFormulario from "@/shared/components/ui/BotonesFormulario";
import Campo, { claseInput } from "@/shared/components/ui/Campo";
import Modal from "@/shared/components/ui/Modal";

interface ProductoModalProps {
  abierto: boolean;
  modoEdicion: boolean;
  form: ProductoFormApi;
  /** Categorías que se pueden asignar al producto (ProductoCategoria). */
  categorias: Categoria[];
  guardando: boolean;
  error: string | null;
  onClose: () => void;
}

export default function ProductoModal({
  abierto,
  modoEdicion,
  form,
  categorias,
  guardando,
  error,
  onClose,
}: ProductoModalProps) {
  return (
    <Modal
      abierto={abierto}
      titulo={modoEdicion ? "Editar producto" : "Nuevo producto"}
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
            <Campo id="nombre" etiqueta="Nombre del producto" errores={field.state.meta.errors}>
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

        <form.Field name="descripcion">
          {(field) => (
            <Campo
              id="descripcion"
              etiqueta="Descripción (opcional)"
              errores={field.state.meta.errors}
            >
              <textarea
                id="descripcion"
                rows={3}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={claseInput}
              />
            </Campo>
          )}
        </form.Field>

        <form.Field
          name="precio_base"
          validators={{ onChange: precioValido, onBlur: precioValido }}
        >
          {(field) => (
            <Campo id="precio_base" etiqueta="Precio base" errores={field.state.meta.errors}>
              <input
                id="precio_base"
                type="number"
                step="0.01"
                // El valor de un input numérico llega como texto: se convierte a number.
                value={Number.isNaN(field.state.value) ? "" : field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(e.target.value === "" ? Number.NaN : Number(e.target.value))
                }
                className={claseInput}
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
                className="size-4 accent-brand"
              />
              Disponible para la venta
            </label>
          )}
        </form.Field>

        {categorias.length > 0 && (
          <form.Field name="categorias_ids">
            {(field) => (
              <fieldset className="mt-4">
                <legend className="block text-xs font-medium text-secondary">
                  Categorías (marcá la principal)
                </legend>
                <div className="mt-1 max-h-40 space-y-1 overflow-y-auto rounded-md border border-slate-200 dark:border-slate-700 p-2">
                  {categorias.map((categoria) => {
                    const marcada = field.state.value.includes(categoria.id);
                    return (
                      <div key={categoria.id} className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                          <input
                            type="checkbox"
                            checked={marcada}
                            onChange={(e) => {
                              const ids = e.target.checked
                                ? [...field.state.value, categoria.id]
                                : field.state.value.filter((id) => id !== categoria.id);
                              field.handleChange(ids);
                              // La principal es siempre una de las marcadas.
                              const principal = form.getFieldValue("categoria_principal_id");
                              if (principal === null || !ids.includes(principal)) {
                                form.setFieldValue("categoria_principal_id", ids[0] ?? null);
                              }
                            }}
                            className="size-4 accent-brand"
                          />
                          {categoria.nombre}
                        </label>
                        {marcada && (
                          <form.Field name="categoria_principal_id">
                            {(principal) => (
                              <label className="flex items-center gap-1 text-xs text-secondary">
                                <input
                                  type="radio"
                                  name="categoria_principal"
                                  checked={principal.state.value === categoria.id}
                                  onChange={() => principal.handleChange(categoria.id)}
                                  className="accent-brand"
                                />
                                Principal
                              </label>
                            )}
                          </form.Field>
                        )}
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            )}
          </form.Field>
        )}

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
