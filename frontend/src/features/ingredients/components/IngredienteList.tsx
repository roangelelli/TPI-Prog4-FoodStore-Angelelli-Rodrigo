import type { Table } from "@tanstack/react-table";
import type { Ingrediente } from "@/features/ingredients/types/ingrediente.types";
import DataTable from "@/shared/components/ui/DataTable";

interface IngredienteListProps {
  table: Table<Ingrediente>;
}

export default function IngredienteList({ table }: IngredienteListProps) {
  return <DataTable table={table} etiqueta="Listado de ingredientes" />;
}
