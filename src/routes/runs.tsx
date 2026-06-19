import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { runs, getClub } from "@/lib/mock-data";

export const Route = createFileRoute("/runs")({
  head: () => ({
    meta: [
      { title: "All Runs — PacePack" },
      { name: "description", content: "Every scheduled run across every club." },
    ],
  }),
  component: RunsPage,
});

function RunsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold sm:text-4xl">All runs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse runs from every club. Tap one to see paths, markers, and the leaderboard.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {runs.map((r) => {
            const club = getClub(r.clubId);
            return (
              <Link
                key={r.id}
                to="/runs/$runId"
                params={{ runId: r.id }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]"
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="rounded-full bg-muted px-2 py-1 text-muted-foreground">
                    {club?.emoji} {club?.name}
                  </span>
                  <StatusPill status={r.status} />
                </div>
                <h3 className="mt-3 text-lg font-bold">{r.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  📍 {r.location} • {r.date} {r.time}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {r.paths.length} paths • {r.joined.length} joined
                  </span>
                  {r.isPaid ? (
                    <span className="rounded-full bg-[var(--highlight)]/15 px-2 py-1 text-xs font-bold text-[var(--highlight)]">
                      ${r.price}
                    </span>
                  ) : (
                    <span className="rounded-full bg-[var(--secondary)]/20 px-2 py-1 text-xs font-bold text-secondary-foreground">
                      Free
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function StatusPill({ status }: { status: "upcoming" | "live" | "finished" }) {
  const map = {
    upcoming: { label: "Upcoming", cls: "bg-[var(--accent)]/30 text-accent-foreground" },
    live: { label: "● Live", cls: "bg-primary/15 text-primary animate-pulse" },
    finished: { label: "Finished", cls: "bg-muted text-muted-foreground" },
  } as const;
  const s = map[status];
  return <span className={`rounded-full px-2 py-1 ${s.cls}`}>{s.label}</span>;
}