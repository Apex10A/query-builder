import { cn } from "@/lib/utils/cn";

interface LanternLogoProps {
  className?: string;
  size?: "sm" | "md";
}

export function LanternLogo({ className, size = "md" }: LanternLogoProps) {
  const iconSize = size === "sm" ? 28 : 36;

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        <rect width="40" height="40" rx="10" fill="url(#lantern-bg)" />
        <path
          d="M20 8c-3 0-5 2.5-5 5.5v2h10v-2C25 10.5 23 8 20 8z"
          fill="#FEF3C7"
        />
        <path
          d="M13 15.5h14v12c0 2.2-1.8 4-4 4h-6c-2.2 0-4-1.8-4-4v-12z"
          fill="url(#lantern-body)"
        />
        <ellipse cx="20" cy="24" rx="4" ry="5" fill="#FDE68A" opacity="0.9" />
        <path
          d="M17 31.5h6v2.5c0 .8-.7 1.5-1.5 1.5h-3c-.8 0-1.5-.7-1.5-1.5v-2.5z"
          fill="#4F46E5"
        />
        <defs>
          <linearGradient id="lantern-bg" x1="0" y1="0" x2="40" y2="40">
            <stop stopColor="#4F46E5" />
            <stop offset="1" stopColor="#6366F1" />
          </linearGradient>
          <linearGradient id="lantern-body" x1="13" y1="15" x2="27" y2="31">
            <stop stopColor="#F59E0B" />
            <stop offset="1" stopColor="#FBBF24" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            "font-bold tracking-tight text-[var(--fg)]",
            size === "sm" ? "text-sm" : "text-base"
          )}
        >
          Lantern
        </span>
        {size === "md" && (
          <span className="text-[0.65rem] font-medium text-[var(--fg-muted)]">
            Query Builder
          </span>
        )}
      </div>
    </div>
  );
}
