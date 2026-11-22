import Button from "@/shared/ui/Button";

interface EstadoErrorProps {
  mensaje: string;
  onReintentar?: () => void;
}

export default function EstadoError({ mensaje, onReintentar }: EstadoErrorProps) {
  return (
    <div
      role="alert"
      className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-error bg-error/5 px-4 py-3 text-sm text-error dark:text-red-300"
    >
      <p>{mensaje}</p>
      {onReintentar && (
        <Button variant="danger" onClick={onReintentar}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
