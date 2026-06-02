import { cn } from "@/lib/utils/cn";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--accent)] text-[#0f0e0c] hover:bg-[var(--accent-hover)] shadow-[0_0_24px_var(--accent-glow)] font-semibold dark:text-[#0f0e0c]",
  secondary:
    "border border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--fg)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
  ghost:
    "text-[var(--fg-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--fg)]",
  danger:
    "text-[var(--danger)] hover:bg-[color-mix(in_srgb,var(--danger)_12%,transparent)]",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1 rounded-lg",
  md: "h-9 px-3.5 text-sm gap-1.5 rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
