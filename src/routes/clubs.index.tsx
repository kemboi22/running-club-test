import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { clubs, useStore } from "@/lib/mock-data";

export const Route = createFileRoute("/clubs")({
  head: () => ({
    meta: [
      { title: "Clubs — PacePack" },
      { name: "description", content: "Browse running clubs and find your pack." },
    ],
  }),
  component: ClubsIndex,
});

function ClubsIndex() {
  useStore();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-5xl text-foreground">Running clubs</h1>
            <p className="mt-1 text-muted-foreground">Find your pack — or start your own.</p>
          </div>
          <Link
            to="/clubs/new"
            className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:brightness-110"
          >
            + New club
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map((c) => (
            <Link
              key={c.id}
              to="/clubs/$clubId"
              params={{ clubId: c.id }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]"
            >
              <div
                className="flex h-32 items-center justify-center text-6xl"
                style={{ backgroundColor: c.accent + "1f", color: c.accent }}
              >
                {c.emoji}
              </div>
              <div className="p-5">
                <h3 className="font-display text-2xl text-foreground">{c.name}</h3>
                <p className="text-xs text-muted-foreground">📍 {c.city}</p>
                <p className="mt-3 text-sm text-foreground/80">{c.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs font-semibold">
                  <span className="text-muted-foreground">{c.members.length} members</span>
                  <span style={{ color: c.accent }}>{c.runIds.length} runs →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}