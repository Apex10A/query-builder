import { cn } from "@/lib/utils/cn";

interface LanternLogoProps {
  className?: string;
  size?: "sm" | "md";
}

export function LanternLogo({ className, size = "md" }: LanternLogoProps) {
  return (
    <span
      className={cn(
        "font-sans font-bold tracking-tight text-[var(--fg)]",
        size === "sm" ? "text-lg" : "text-xl",
        className
      )}
    >
      Lantern
    </span>
  );
}
