import { cn } from "@/lib/utils";
import { humanize } from "@/lib/constants";

const tones = {
  neutral: "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)]",
  success: "border-transparent bg-[color-mix(in_srgb,var(--success)_14%,transparent)] text-[var(--success)]",
  warning: "border-transparent bg-[color-mix(in_srgb,var(--warning)_14%,transparent)] text-[var(--warning)]",
  danger: "border-transparent bg-[color-mix(in_srgb,var(--danger)_14%,transparent)] text-[var(--danger)]",
  accent: "border-transparent bg-[var(--accent-soft)] text-[var(--accent-strong)]",
} as const;

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", tones[tone], className)}>
      {children}
    </span>
  );
}

export function StatusBadge({ value }: { value: string }) {
  const tone =
    value === "completed" || value === "on_track"
      ? "success"
      : value === "blocked" || value === "urgent" || value === "at_risk"
        ? "danger"
        : value === "waiting" || value === "needs_attention" || value === "high"
          ? "warning"
          : "neutral";
  return <Badge tone={tone}>{humanize(value)}</Badge>;
}

export function PrivacyBadge({ value }: { value: string }) {
  const sensitive = value === "sensitive_personal" || value === "company_confidential";
  return <Badge tone={sensitive ? "warning" : "accent"}>{humanize(value)}</Badge>;
}
