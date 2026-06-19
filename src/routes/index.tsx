import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { clubs, runs } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PacePack — Run together, track everything" },
      { name: "description", content: "Create running clubs, schedule runs, draw paths on a map, and crown MVPs." },
      { property: "og:title", content: "PacePack" },
      { property: "og:description", content: "The SaaS for running clubs." },
    ],
  }),
  component: Index,
});

function Index() {
  const upcoming = runs.filter((r) => r.status !== "finished").slice(0, 3);
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-90"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,white_0%,transparent_40%)] opacity-30" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            🏃 New • Build your run, your way
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white sm:text-6xl">
            Run together. <br />
            <span className="bg-white/90 bg-clip-text text-transparent">Track everything.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/90 sm:text-lg">
            Create your running club, schedule runs, draw multiple paths on the map,
            mark water and crossings, and crown the MVPs of every session.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/runs"
              className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-foreground shadow-xl transition hover:scale-[1.02]"
            >
              Browse runs →
            </Link>
            <a
              href="#clubs"
              className="rounded-xl border-2 border-white/60 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              Explore clubs
            </a>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Upcoming runs */}
        <section className="mb-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Upcoming runs</h2>
              <p className="text-sm text-muted-foreground">Lace up — these are happening soon.</p>
            </div>
            <Link to="/runs" className="text-sm font-semibold text-primary hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {upcoming.map((r) => (
              <Link
                key={r.id}
                to="/runs/$runId"
                params={{ runId: r.id }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]"
              >
                <div
                  className="absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-20 transition group-hover:scale-125"
                  style={{ background: "var(--gradient-hero)" }}
                />
                <div className="flex items-center gap-2 text-xs font-semibold">
                  {r.isPaid ? (
                    <span className="rounded-full bg-[var(--highlight)]/15 px-2 py-1 text-[var(--highlight)]">
                      💳 ${r.price}
                    </span>
                  ) : (
                    <span className="rounded-full bg-[var(--secondary)]/20 px-2 py-1 text-secondary-foreground">
                      🎟️ Free
                    </span>
                  )}
                  <span className="rounded-full bg-muted px-2 py-1 text-muted-foreground">
                    {r.date} • {r.time}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold">{r.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">📍 {r.location}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {r.joined.slice(0, 4).map((id) => (
                      <span
                        key={id}
                        className="grid h-8 w-8 place-items-center rounded-full border-2 border-card bg-muted text-sm"
                      >
                        {id.slice(-1)}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {r.joined.length} joined
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Clubs */}
        <section id="clubs">
          <div className="mb-6">
            <h2 className="text-2xl font-bold sm:text-3xl">Running clubs</h2>
            <p className="text-sm text-muted-foreground">Find your pack.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {clubs.map((c) => (
              <Link
                key={c.id}
                to="/clubs/$clubId"
                params={{ clubId: c.id }}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${c.color} p-6 text-white shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]`}
              >
                <div className="text-4xl">{c.emoji}</div>
                <h3 className="mt-3 text-xl font-bold">{c.name}</h3>
                <p className="text-sm text-white/85">📍 {c.city}</p>
                <p className="mt-3 text-sm text-white/90">{c.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-white/25 pt-4">
                  <span className="text-xs font-semibold">{c.members.length} members</span>
                  <span className="text-xs font-semibold">{c.runIds.length} runs →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        Built with ❤️ for runners. © PacePack
      </footer>
    </div>
  );
}
