import Button from "./Button";

interface ErrorStateProps {
  mensaje: string;
  onReintentar?: () => void;
}

/** Estado de error: explica el problema y ofrece reintentar. */
export default function ErrorState({ mensaje, onReintentar }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-error bg-error/5 px-4 py-3 text-sm text-error"
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
