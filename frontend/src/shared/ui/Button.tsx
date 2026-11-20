import type { ButtonHTMLAttributes } from "react";

type Variante = "primary" | "secondary" | "outline" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variante;
}

const clases: Record<Variante, string> = {
  primary: "bg-brand text-white hover:bg-brand-hover",
  secondary: "bg-secondary text-white hover:opacity-90",
  outline: "border border-brand text-brand hover:bg-brand/10",
  danger: "border border-error text-error hover:bg-error/10",
};

export default function Button({
  variant = "primary",
  type = "button",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition active:scale-95
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand
        disabled:cursor-not-allowed disabled:opacity-50 ${clases[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
