import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import RunMap from "@/components/RunMap";
import {
  getRun,
  getClub,
  getMember,
  formatTime,
  mvpForPath,
  toggleJoin,
  voteMVP,
  currentMemberId,
  useStore,
} from "@/lib/mock-data";

export const Route = createFileRoute("/runs/$runId")({
  loader: ({ params }) => {
    const run = getRun(params.runId);
    if (!run) throw notFound();
    return { runId: params.runId };
  },
  head: ({ loaderData, params }) => {
    const run = loaderData ? getRun(loaderData.runId) : getRun(params.runId);
    return {
      meta: [
        { title: `${run?.title ?? "Run"} — PacePack` },
        { name: "description", content: run?.location ?? "" },
      ],
    };
  },
  component: RunPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="p-10 text-center">
        <h1 className="font-display text-4xl">Run not found</h1>
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
  useStore();
  const { runId } = Route.useLoaderData();
  const run = getRun(runId)!;
  const club = getClub(run.clubId)!;

  const [activePathId, setActivePathId] = useState<string | undefined>(run.paths[0]?.id);

  const activePath = run.paths.find((p) => p.id === activePathId);
  const board = run.leaderboard
    .filter((e) => !activePathId || e.pathId === activePathId)
    .sort((a, b) => a.timeSeconds - b.timeSeconds);

  const isJoined = run.joined.includes(currentMemberId);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="text-primary-foreground" style={{ backgroundColor: club.accent }}>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <Link
            to="/clubs/$clubId"
            params={{ clubId: club.id }}
            className="text-sm font-semibold opacity-85 hover:opacity-100"
          >
            ← {club.emoji} {club.name}
          </Link>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-5xl sm:text-6xl">{run.title}</h1>
              <p className="mt-2 opacity-90">
                📍 {run.location} · {run.date} at {run.time}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
                <Tag>{run.isPaid ? `💳 Paid · $${run.price}` : "🎟️ Free"}</Tag>
                <Tag>{run.paths.length} paths</Tag>
                <Tag>{run.joined.length} runners</Tag>
                <Tag>{run.status}</Tag>
              </div>
            </div>
            <button
              onClick={() => toggleJoin(run.id, currentMemberId)}
              className="rounded-xl bg-card px-6 py-3 text-sm font-bold text-foreground transition hover:brightness-95"
            >
              {isJoined ? "✓ You're in! (leave)" : run.isPaid ? `Pay $${run.price} & join` : "Join this run"}
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-display mb-3 text-3xl">Pick your path</h2>
          <div className="mb-4 flex flex-wrap gap-2">
            {run.paths.map((p) => {
              const active = p.id === activePathId;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePathId(p.id)}
                  className={`rounded-xl border-2 px-4 py-2 text-sm font-bold transition ${
                    active ? "text-primary-foreground" : "bg-card text-foreground hover:border-foreground"
                  }`}
                  style={
                    active
                      ? { backgroundColor: p.color, borderColor: p.color }
                      : { borderColor: p.color + "55" }
                  }
                >
                  <span
                    className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full align-middle"
                    style={{ backgroundColor: active ? "#fff" : p.color }}
                  />
                  {p.title} · {p.distanceKm} km
                </button>
              );
            })}
            <button
              onClick={() => setActivePathId(undefined)}
              className={`rounded-xl border-2 px-4 py-2 text-sm font-bold transition ${
                !activePathId
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground"
              }`}
            >
              Show all
            </button>
          </div>

          <RunMap center={run.centerCoord} paths={run.paths} activePathId={activePathId} />

          {activePath && (
            <div className="mt-5 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-3">
                <span
                  className="grid h-12 w-12 place-items-center rounded-2xl text-primary-foreground"
                  style={{ backgroundColor: activePath.color }}
                >
                  🥾
                </span>
                <div>
                  <h3 className="font-display text-2xl">{activePath.title}</h3>
                  <p className="text-sm text-muted-foreground">{activePath.description}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <Stat label="Distance" value={`${activePath.distanceKm} km`} />
                <Stat label="Difficulty" value={activePath.difficulty} />
                <Stat label="Markers" value={activePath.markers.length.toString()} />
              </div>
              <div className="mt-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Markers
                </p>
                <div className="flex flex-wrap gap-2">
                  {activePath.markers.map((m) => (
                    <span
                      key={m.id}
                      className="rounded-full bg-muted px-3 py-1 text-xs font-semibold"
                    >
                      {iconFor(m.type)} {m.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="font-display flex items-center gap-2 text-2xl">
              🏆 Leaderboard
              {activePath && (
                <span className="text-xs font-semibold text-muted-foreground">
                  · {activePath.title}
                </span>
              )}
            </h3>
            {board.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                No results yet. Be the first to clock a time!
              </p>
            ) : (
              <ol className="mt-3 space-y-2">
                {board.map((entry, i) => {
                  const m = getMember(entry.memberId);
                  return (
                    <li
                      key={entry.memberId + entry.pathId}
                      className="flex items-center justify-between rounded-xl bg-muted/60 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold ${
                            i === 0
                              ? "bg-primary text-primary-foreground"
                              : i === 1
                              ? "bg-secondary text-secondary-foreground"
                              : i === 2
                              ? "bg-accent text-accent-foreground"
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
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold">
                          {formatTime(entry.timeSeconds)}
                        </span>
                        <button
                          onClick={() => voteMVP(run.id, entry.memberId, entry.pathId)}
                          className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground"
                          title="Vote MVP"
                        >
                          ⭐ {entry.votes ?? 0}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="font-display text-2xl">⭐ MVPs (live vote)</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Highest-voted runner per path is the current MVP.
            </p>
            <div className="mt-3 space-y-2">
              {run.paths.map((p) => {
                const mvp = mvpForPath(run, p.id);
                if (!mvp) return null;
                const m = getMember(mvp.memberId);
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-xl p-3"
                    style={{ backgroundColor: p.color + "1a" }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{m?.avatar}</span>
                      <div>
                        <p className="text-sm font-bold">{m?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.title} · ⭐ {mvp.votes ?? 0} votes
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-bold">{formatTime(mvp.timeSeconds)}</span>
                  </div>
                );
              })}
              {run.leaderboard.length === 0 && (
                <p className="text-sm text-muted-foreground">MVPs revealed after the run.</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="font-display text-2xl">Joined ({run.joined.length})</h3>
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
              {run.joined.length === 0 && (
                <p className="text-sm text-muted-foreground">Nobody yet — be the first!</p>
              )}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">{children}</span>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted p-3">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-display mt-1 text-2xl capitalize">{value}</p>
    </div>
  );
}

function iconFor(type: string) {
  return (
    { water: "💧", crossing: "🚦", rest: "🪑", start: "🟢", finish: "🏁", cheer: "📣" } as Record<
      string,
      string
    >
  )[type] ?? "📍";
}