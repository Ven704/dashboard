type ConnectPromptProps = {
  message: string;
};

const ConnectPrompt = ({ message }: ConnectPromptProps) => {
  return (
    <main className="mx-auto max-w-xl px-4 py-20">
      <h1 className="text-2xl font-semibold text-[var(--foreground)]">
        Polymarket bot dashboard
      </h1>
      <p className="mt-4 rounded-lg border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">
        {message}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
        Add{" "}
        <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-xs">
          NEXT_PUBLIC_SUPABASE_URL
        </code>{" "}
        and{" "}
        <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-xs">
          SUPABASE_SERVICE_ROLE_KEY
        </code>{" "}
        in Vercel (or copy{" "}
        <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-xs">
          .env.example
        </code>{" "}
        to{" "}
        <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-xs">
          .env.local
        </code>
        ). Redeploy after saving env vars.
      </p>
    </main>
  );
};

export default ConnectPrompt;
