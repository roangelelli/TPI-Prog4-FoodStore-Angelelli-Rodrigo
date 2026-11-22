// logo: una cloche (tapa de plato) en un cuadrado azul
export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label="Food Store">
      <rect width="32" height="32" rx="8" fill="#2563eb" />
      <path d="M7 21a9 9 0 0 1 18 0z" fill="#fff" />
      <rect x="5" y="22.5" width="22" height="2.5" rx="1.25" fill="#fff" />
      <circle cx="16" cy="10.2" r="1.6" fill="#fff" />
    </svg>
  );
}
