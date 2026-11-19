import Button from "./Button";

interface PageHeaderProps {
  titulo: string;
  /** El botón "Nuevo" solo se muestra si se pasan el texto y la acción (rol admin). */
  textoBoton?: string;
  onNuevo?: () => void;
}

export default function PageHeader({ titulo, textoBoton, onNuevo }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{titulo}</h1>
      {textoBoton && onNuevo && <Button onClick={onNuevo}>{textoBoton}</Button>}
    </div>
  );
}
