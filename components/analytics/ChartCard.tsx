type ChartCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  tall?: boolean;
};

const ChartCard = ({
  title,
  description,
  children,
  className = "",
  tall = false,
}: ChartCardProps) => {
  return (
    <div
      className={`rounded-xl border border-[var(--border)] bg-zinc-900/35 p-4 shadow-sm ring-1 ring-white/5 ${className}`}
    >
      <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
      {description ? (
        <p className="mt-1 text-xs text-zinc-500">{description}</p>
      ) : null}
      <div className={tall ? "mt-4 h-80 w-full" : "mt-4 h-72 w-full"}>
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
