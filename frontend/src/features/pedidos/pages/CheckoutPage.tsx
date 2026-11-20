import { useForm } from "@tanstack/react-form";
import { Navigate, useNavigate } from "react-router-dom";
import Button from "@/shared/ui/Button";
import Campo from "@/shared/ui/Campo";
import Card from "@/shared/ui/Card";
import Input, { claseInput } from "@/shared/ui/Input";
import { formatearPrecio } from "@/shared/utils/formato";
import { largoEntre } from "@/shared/utils/validators";
import { useCartStore } from "@/store/cartStore";
import { useCrearPedido } from "../hooks/usePedidos";
import type { FormaPago } from "../types/pedido.types";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, vaciar, total } = useCartStore();
  const crearPedido = useCrearPedido();

  const form = useForm({
    defaultValues: { direccion_entrega: "", forma_pago: "EFECTIVO" as FormaPago, notas: "" },
    onSubmit: ({ value }) =>
      crearPedido.mutate(
        {
          items: items.map((i) => ({ producto_id: i.producto_id, cantidad: i.cantidad })),
          forma_pago: value.forma_pago,
          direccion_entrega: value.direccion_entrega.trim(),
          notas: value.notas.trim() || undefined,
        },
        {
          onSuccess: () => {
            vaciar();
            navigate("/mis-pedidos");
          },
        },
      ),
  });

  // si se vacio el carrito no hay nada que confirmar (el pedido ya se hizo si pasa por onSuccess)
  if (items.length === 0 && !crearPedido.isSuccess) return <Navigate to="/carrito" replace />;

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">Confirmar pedido</h1>

      <Card className="mb-6">
        <ul className="divide-y divide-slate-200 text-sm dark:divide-slate-700">
          {items.map((i) => (
            <li key={i.producto_id} className="flex justify-between py-2">
              <span className="text-slate-700 dark:text-slate-200">
                {i.cantidad} x {i.nombre}
              </span>
              <span className="text-secondary">{formatearPrecio(i.precio_unitario * i.cantidad)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-right text-lg font-bold text-slate-900 dark:text-slate-100">
          Total: {formatearPrecio(total())}
        </p>
      </Card>

      <Card>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <form.Field
            name="direccion_entrega"
            validators={{ onChange: largoEntre(5, 200, "La dirección debe tener entre 5 y 200 caracteres") }}
          >
            {(field) => (
              <Campo id="direccion" etiqueta="Dirección de entrega" errores={field.state.meta.errors}>
                <Input
                  id="direccion"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Campo>
            )}
          </form.Field>

          <form.Field name="forma_pago">
            {(field) => (
              <Campo id="forma-pago" etiqueta="Forma de pago" errores={field.state.meta.errors}>
                <select
                  id="forma-pago"
                  className={claseInput}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value as FormaPago)}
                >
                  <option value="EFECTIVO">Efectivo</option>
                  <option value="TRANSFERENCIA">Transferencia</option>
                </select>
              </Campo>
            )}
          </form.Field>

          <form.Field name="notas">
            {(field) => (
              <Campo id="notas" etiqueta="Notas (opcional)" errores={field.state.meta.errors}>
                <textarea
                  id="notas"
                  rows={3}
                  className={claseInput}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Campo>
            )}
          </form.Field>

          <form.Subscribe selector={(state) => state.canSubmit}>
            {(canSubmit) => (
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="secondary" onClick={() => navigate("/carrito")} disabled={crearPedido.isPending}>
                  Volver
                </Button>
                <Button type="submit" disabled={!canSubmit || crearPedido.isPending}>
                  {crearPedido.isPending ? "Enviando..." : "Confirmar pedido"}
                </Button>
              </div>
            )}
          </form.Subscribe>
        </form>
      </Card>
    </div>
  );
}
