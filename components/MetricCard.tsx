type MetricVariant = "default" | "profit" | "loss" | "accent" | "warn";

type MetricCardProps = {
  label: string;
  value: string;
  hint?: string;
  variant?: MetricVariant;
  subValue?: string;
};

const variantClass: Record<MetricVariant, string> = {
  default: "border-[var(--border)]",
  profit: "border-emerald-500/40 bg-emerald-950/20",
  loss: "border-red-500/40 bg-red-950/15",
  accent: "border-cyan-500/40 bg-cyan-950/20",
  warn: "border-amber-500/40 bg-amber-950/15",
};

const MetricCard = ({
  label,
  value,
  hint,
  variant = "default",
  subValue,
}: MetricCardProps) => {
  return (
    <article
      className={`rounded-xl border bg-[var(--card)] p-5 shadow-sm ring-1 ring-white/5 ${variantClass[variant]}`}
      aria-label={label}
    >
      <p className="text-sm font-medium text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
        {value}
      </p>
      {subValue ? (
        <p className="mt-1 text-xs font-medium text-zinc-500">{subValue}</p>
      ) : null}
      {hint ? (
        <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p>
      ) : null}
    </article>
  );
};

export default MetricCard;
