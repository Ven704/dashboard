type PageHeaderProps = {
  title: string;
  description?: string;
  updatedAtLabel?: string;
};

const PageHeader = ({ title, description, updatedAtLabel }: PageHeaderProps) => {
  return (
    <header className="mb-8 border-b border-[var(--border)] pb-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-3xl text-sm text-[var(--muted)]">
              {description}
            </p>
          ) : null}
        </div>
        {updatedAtLabel ? (
          <p
            className="shrink-0 font-mono text-xs text-zinc-500"
            title="Server render time (UTC)"
          >
            Updated {updatedAtLabel}
          </p>
        ) : null}
      </div>
    </header>
  );
};

export default PageHeader;
