import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { getClub, getRunsForClub, type Club, type Run } from "@/lib/mock-data";

export const Route = createFileRoute("/clubs/$clubId")({
  loader: ({ params }) => {
    const club = getClub(params.clubId);
    if (!club) throw notFound();
    return { club, runs: getRunsForClub(params.clubId) };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.club.name ?? "Club"} — PacePack` },
      { name: "description", content: loaderData?.club.description ?? "Running club" },
    ],
  }),
  component: ClubPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-xl p-10 text-center">
        <h1 className="text-2xl font-bold">Club not found</h1>
        <Link to="/" className="mt-4 inline-block text-primary hover:underline">
          ← Back home
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-destructive">{error.message}</div>
  ),
});

function ClubPage() {
  const { club, runs } = Route.useLoaderData() as { club: Club; runs: Run[] };
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className={`relative overflow-hidden bg-gradient-to-br ${club.color} text-white`}>
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <Link to="/" className="text-sm font-semibold text-white/85 hover:text-white">
            ← All clubs
          </Link>
          <div className="mt-4 flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/20 text-4xl backdrop-blur">
              {club.emoji}
            </span>
            <div>
              <h1 className="text-3xl font-black sm:text-5xl">{club.name}</h1>
              <p className="text-white/90">📍 {club.city}</p>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-white/90">{club.description}</p>
          <div className="mt-6 flex gap-3">
            <button className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-foreground shadow-lg hover:scale-[1.02]">
              + Invite members
            </button>
            <button className="rounded-xl border-2 border-white/60 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur hover:bg-white/20">
              + Create run
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold">Runs ({runs.length})</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {runs.map((r) => (
              <Link
                key={r.id}
                to="/runs/$runId"
                params={{ runId: r.id }}
                className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span>{r.date} • {r.time}</span>
                  {r.isPaid ? (
                    <span className="text-[var(--highlight)]">💳 ${r.price}</span>
                  ) : (
                    <span className="text-secondary-foreground">🎟️ Free</span>
                  )}
                </div>
                <h3 className="mt-2 text-lg font-bold">{r.title}</h3>
                <p className="text-sm text-muted-foreground">📍 {r.location}</p>
                <p className="mt-3 text-xs font-semibold text-primary">
                  {r.paths.length} paths • {r.joined.length} joined →
                </p>
              </Link>
            ))}
            {runs.length === 0 && (
              <div className="rounded-2xl border-2 border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                No runs scheduled yet. Create one!
              </div>
            )}
          </div>
        </div>

        <aside>
          <h2 className="text-xl font-bold">Members ({club.members.length})</h2>
          <div className="mt-4 space-y-2">
            {club.members.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-muted text-xl">
                    {m.avatar}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{m.name}</p>
                    <p className="text-xs text-muted-foreground">avg pace {m.pace}/km</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}