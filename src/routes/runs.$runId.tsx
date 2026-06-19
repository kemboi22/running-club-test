import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import RunMap from "@/components/RunMap";
import {
  getRun,
  getClub,
  getMember,
  formatTime,
  type Run,
  type Club,
} from "@/lib/mock-data";

export const Route = createFileRoute("/runs/$runId")({
  loader: ({ params }) => {
    const run = getRun(params.runId);
    if (!run) throw notFound();
    return { run, club: getClub(run.clubId)! };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.run.title ?? "Run"} — PacePack` },
      { name: "description", content: `${loaderData?.run.location ?? ""}` },
    ],
  }),
  component: RunPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">Run not found</h1>
        <Link to="/runs" className="mt-4 inline-block text-primary hover:underline">
          ← All runs
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-destructive">{error.message}</div>
  ),
});

function RunPage() {
  const { run, club } = Route.useLoaderData() as { run: Run; club: Club };
  const [activePathId, setActivePathId] = useState<string | undefined>(run.paths[0]?.id);
  const [joined, setJoined] = useState(false);

  const activePath = run.paths.find((p) => p.id === activePathId);
  const pathBoard = run.leaderboard
    .filter((e) => !activePathId || e.pathId === activePathId)
    .sort((a, b) => a.timeSeconds - b.timeSeconds);
  const mvps = run.leaderboard.filter((e) => e.isMVP);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-10 text-white sm:px-6">
          <Link
            to="/clubs/$clubId"
            params={{ clubId: club.id }}
            className="text-sm font-semibold text-white/85 hover:text-white"
          >
            ← {club.emoji} {club.name}
          </Link>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black sm:text-5xl">{run.title}</h1>
              <p className="mt-2 text-white/90">
                📍 {run.location} • {run.date} at {run.time}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                {run.isPaid ? (
                  <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">
                    💳 Paid • ${run.price}
                  </span>
                ) : (
                  <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">🎟️ Free</span>
                )}
                <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">
                  {run.paths.length} paths
                </span>
                <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">
                  {run.joined.length} runners joined
                </span>
              </div>
            </div>
            <button
              onClick={() => setJoined((v) => !v)}
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-foreground shadow-xl transition hover:scale-[1.02]"
            >
              {joined ? "✓ You're in!" : run.isPaid ? `Pay $${run.price} & join` : "Join this run"}
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-xl font-bold">Choose your path</h2>
          <div className="mb-4 flex flex-wrap gap-2">
            {run.paths.map((p) => {
              const active = p.id === activePathId;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePathId(p.id)}
                  className={`rounded-xl border-2 px-4 py-2 text-sm font-bold transition ${
                    active ? "text-white shadow-lg" : "border-border bg-card text-foreground hover:border-primary"
                  }`}
                  style={
                    active
                      ? { backgroundColor: p.color, borderColor: p.color }
                      : { borderColor: p.color + "55" }
                  }
                >
                  <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  {p.title} • {p.distanceKm} km
                </button>
              );
            })}
            <button
              onClick={() => setActivePathId(undefined)}
              className={`rounded-xl border-2 px-4 py-2 text-sm font-bold transition ${
                !activePathId ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground"
              }`}
            >
              Show all
            </button>
          </div>

          <RunMap center={run.centerCoord} paths={run.paths} activePathId={activePathId} />

          {activePath && (
            <div className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-3">
                <span
                  className="grid h-10 w-10 place-items-center rounded-xl text-white"
                  style={{ backgroundColor: activePath.color }}
                >
                  🥾
                </span>
                <div>
                  <h3 className="text-lg font-bold">{activePath.title}</h3>
                  <p className="text-sm text-muted-foreground">{activePath.description}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <Stat label="Distance" value={`${activePath.distanceKm} km`} />
                <Stat label="Difficulty" value={activePath.difficulty} />
                <Stat label="Markers" value={activePath.markers.length.toString()} />
              </div>
              <div className="mt-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Markers</p>
                <div className="flex flex-wrap gap-2">
                  {activePath.markers.map((m) => (
                    <span key={m.id} className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">
                      {iconFor(m.type)} {m.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              🏆 Leaderboard
              {activePath && (
                <span className="text-xs font-semibold text-muted-foreground">· {activePath.title}</span>
              )}
            </h3>
            {pathBoard.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                No results yet. Be the first to clock a time!
              </p>
            ) : (
              <ol className="mt-3 space-y-2">
                {pathBoard.map((entry, i) => {
                  const m = getMember(entry.memberId);
                  return (
                    <li
                      key={entry.memberId + entry.pathId}
                      className="flex items-center justify-between rounded-xl bg-muted/60 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${
                            i === 0
                              ? "bg-[var(--accent)] text-accent-foreground"
                              : i === 1
                              ? "bg-[var(--secondary)]/40"
                              : i === 2
                              ? "bg-[var(--primary)]/20 text-primary"
                              : "bg-background"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-sm font-semibold">
                            {m?.avatar} {m?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{entry.paceMinKm}/km</p>
                        </div>
                      </div>
                      <span className="font-mono text-sm font-bold">{formatTime(entry.timeSeconds)}</span>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="text-lg font-bold">⭐ MVPs of this run</h3>
            {mvps.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">MVPs revealed after the run.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {mvps.map((e) => {
                  const m = getMember(e.memberId);
                  const path = run.paths.find((p) => p.id === e.pathId);
                  return (
                    <div
                      key={e.memberId + e.pathId}
                      className="flex items-center justify-between rounded-xl p-3"
                      style={{ backgroundColor: (path?.color ?? "#888") + "1a" }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{m?.avatar}</span>
                        <div>
                          <p className="text-sm font-bold">{m?.name}</p>
                          <p className="text-xs text-muted-foreground">{path?.title}</p>
                        </div>
                      </div>
                      <span className="font-mono text-sm font-bold">{formatTime(e.timeSeconds)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="text-lg font-bold">Joined ({run.joined.length})</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {run.joined.map((id) => {
                const m = getMember(id);
                if (!m) return null;
                return (
                  <span
                    key={id}
                    className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold"
                  >
                    <span>{m.avatar}</span> {m.name}
                  </span>
                );
              })}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-base font-bold capitalize">{value}</p>
    </div>
  );
}

function iconFor(type: string) {
  return (
    { water: "💧", crossing: "🚦", rest: "🪑", start: "🟢", finish: "🏁", cheer: "📣" } as Record<string, string>
  )[type] ?? "📍";
}