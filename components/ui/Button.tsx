import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

const variants = {
  primary: "bg-sky-600 text-white hover:bg-sky-700",
  secondary:
    "border border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50",
  ghost: "text-sky-600 hover:bg-sky-50",
};

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const classes = `
    inline-flex items-center justify-center
    rounded-full
    px-6 py-3
    text-sm font-semibold
    transition-colors
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-sky-500
    focus-visible:ring-offset-2
    ${variants[variant]}
    ${className}
  `;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes}>
      {children}
    </button>
  );
}
