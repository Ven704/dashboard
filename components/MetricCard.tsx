type MetricCardProps = {
  label: string;
  value: string;
  hint?: string;
};

const MetricCard = ({ label, value, hint }: MetricCardProps) => {
  return (
    <article
      className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm"
      aria-label={label}
    >
      <p className="text-sm font-medium text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p>
      ) : null}
    </article>
  );
};

export default MetricCard;
