import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { clubs, runs, useStore } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PacePack — Run together. Track everything." },
      {
        name: "description",
        content:
          "Create running clubs, schedule runs, draw paths on a map, and crown the MVPs of every session.",
      },
      { property: "og:title", content: "PacePack" },
      { property: "og:description", content: "The SaaS for running clubs." },
    ],
  }),
  component: Index,
});

function Index() {
  useStore();
  const upcoming = runs.filter((r) => r.status !== "finished");
  const featured = upcoming[0];
  const finishedCount = runs.filter((r) => r.status === "finished").length;
  const totalMembers = clubs.reduce((s, c) => s + c.members.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        {/* HERO */}
        <div className="grid items-center gap-6 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              · New for 2026
            </span>
            <h1 className="font-display mt-4 text-5xl leading-[0.95] text-foreground sm:text-7xl">
              Run together.
              <br />
              <span className="text-primary">Track everything.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Build your running club, schedule runs, draw multiple paths on the map,
              mark water + crossings, and crown the MVPs of every session.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/clubs"
                className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:brightness-110"
              >
                Explore clubs →
              </Link>
              <Link
                to="/clubs/new"
                className="rounded-xl border-2 border-foreground bg-card px-5 py-3 text-sm font-bold text-foreground transition hover:bg-foreground hover:text-background"
              >
                + Start a club
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Stat label="Clubs" value={clubs.length} tone="primary" />
            <Stat label="Runners" value={totalMembers} tone="accent" />
            <Stat label="Runs" value={runs.length} tone="secondary" />
          </div>
        </div>

        {/* BENTO */}
        <section className="mt-10 grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Featured run — wide */}
          {featured && (
            <Link
              to="/runs/$runId"
              params={{ runId: featured.id }}
              className="group relative col-span-1 row-span-2 flex flex-col justify-between overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-hover)] sm:col-span-2"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                  Next up
                </span>
                <h3 className="font-display mt-3 text-4xl leading-tight sm:text-5xl">
                  {featured.title}
                </h3>
                <p className="mt-2 text-sm opacity-90">
                  📍 {featured.location} · {featured.date} · {featured.time}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {featured.joined.slice(0, 5).map((id) => (
                    <span
                      key={id}
                      className="grid h-9 w-9 place-items-center rounded-full border-2 border-primary bg-primary-foreground text-foreground text-sm"
                    >
                      {id.slice(-1)}
                    </span>
                  ))}
                </div>
                <span className="rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-bold backdrop-blur">
                  {featured.paths.length} paths · {featured.joined.length} joined →
                </span>
              </div>
            </Link>
          )}

          {/* Club cards */}
          {clubs.slice(0, 3).map((c) => (
            <Link
              key={c.id}
              to="/clubs/$clubId"
              params={{ clubId: c.id }}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]"
            >
              <div>
                <span
                  className="grid h-12 w-12 place-items-center rounded-2xl text-2xl"
                  style={{ backgroundColor: c.accent + "22", color: c.accent }}
                >
                  {c.emoji}
                </span>
                <h3 className="font-display mt-3 text-2xl text-foreground">{c.name}</h3>
                <p className="text-xs text-muted-foreground">📍 {c.city}</p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs font-semibold">
                <span className="text-muted-foreground">{c.members.length} members</span>
                <span style={{ color: c.accent }}>{c.runIds.length} runs →</span>
              </div>
            </Link>
          ))}

          {/* Leaderboard mini */}
          <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl">Leaderboard buzz</h3>
              <span className="text-xs font-semibold text-muted-foreground">
                {finishedCount} finished
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              MVPs are voted by runners after each run.
            </p>
            <div className="mt-4 grid gap-2">
              {runs
                .filter((r) => r.leaderboard.length > 0)
                .slice(0, 3)
                .map((r) => {
                  const top = [...r.leaderboard].sort(
                    (a, b) => (b.votes ?? 0) - (a.votes ?? 0),
                  )[0];
                  return (
                    <Link
                      key={r.id}
                      to="/runs/$runId"
                      params={{ runId: r.id }}
                      className="flex items-center justify-between rounded-xl bg-muted px-3 py-2 hover:bg-primary/10"
                    >
                      <span className="truncate text-sm font-semibold">{r.title}</span>
                      <span className="text-xs font-bold text-primary">
                        ⭐ {top.votes} votes
                      </span>
                    </Link>
                  );
                })}
            </div>
          </div>

          {/* CTA tile */}
          <Link
            to="/runs"
            className="flex flex-col justify-between rounded-3xl border-2 border-dashed border-foreground bg-card p-5 transition hover:bg-foreground hover:text-background"
          >
            <span className="font-display text-3xl leading-tight">All runs</span>
            <span className="text-sm font-semibold">Browse every scheduled session →</span>
          </Link>

          <Link
            to="/clubs/new"
            className="flex flex-col justify-between rounded-3xl bg-accent p-5 text-accent-foreground transition hover:brightness-110"
          >
            <span className="font-display text-3xl leading-tight">Start a club</span>
            <span className="text-sm font-semibold opacity-90">
              Invite your crew, pick a city, go →
            </span>
          </Link>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        Built for runners. © PacePack
      </footer>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "primary" | "accent" | "secondary";
}) {
  const bg =
    tone === "primary" ? "bg-primary/10" : tone === "accent" ? "bg-accent/10" : "bg-secondary/20";
  const fg =
    tone === "primary" ? "text-primary" : tone === "accent" ? "text-accent" : "text-foreground";
  return (
    <div className={`rounded-2xl ${bg} p-4 text-center`}>
      <p className={`font-display text-4xl ${fg}`}>{value}</p>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}