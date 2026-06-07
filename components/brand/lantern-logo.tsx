import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface LanternLogoProps {
  className?: string;
  size?: "sm" | "md";
  href?: string;
}

export function LanternLogo({ className, size = "md", href }: LanternLogoProps) {
  const label = (
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

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex rounded-lg outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
      >
        {label}
      </Link>
    );
  }

  return label;
}
