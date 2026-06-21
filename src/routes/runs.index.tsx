import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { runs, getClub, useStore } from "@/lib/mock-data";

export const Route = createFileRoute("/runs/")({
  head: () => ({
    meta: [
      { title: "All runs — PacePack" },
      { name: "description", content: "Every scheduled run across every club." },
    ],
  }),
  component: RunsPage,
});

type Filter = "all" | "upcoming" | "finished" | "free" | "paid";

function RunsPage() {
  useStore();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = runs.filter((r) => {
    if (filter === "upcoming") return r.status !== "finished";
    if (filter === "finished") return r.status === "finished";
    if (filter === "free") return !r.isPaid;
    if (filter === "paid") return r.isPaid;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-5xl text-foreground">All runs</h1>
        <p className="mt-1 text-muted-foreground">
          Tap one to see paths, markers, and vote MVPs.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {(["all", "upcoming", "finished", "free", "paid"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                filter === f
                  ? "bg-foreground text-background"
                  : "border border-border bg-card text-muted-foreground hover:border-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => {
            const club = getClub(r.clubId);
            return (
              <Link
                key={r.id}
                to="/runs/$runId"
                params={{ runId: r.id }}
                className="group flex flex-col rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]"
              >
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                  <span
                    className="rounded-full px-3 py-1"
                    style={{ backgroundColor: (club?.accent ?? "#000") + "1f", color: club?.accent }}
                  >
                    {club?.emoji} {club?.name}
                  </span>
                  <StatusPill status={r.status} />
                </div>
                <h3 className="font-display mt-3 text-2xl">{r.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  📍 {r.location} · {r.date} {r.time}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4 text-xs font-bold">
                  <span className="text-muted-foreground">
                    {r.paths.length} paths · {r.joined.length} joined
                  </span>
                  {r.isPaid ? (
                    <span className="rounded-full bg-accent/10 px-2 py-1 text-accent">
                      ${r.price}
                    </span>
                  ) : (
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">FREE</span>
                  )}
                </div>
              </Link>
            );
          })}
          {filtered.length === 0 && (
            <p className="col-span-full rounded-2xl border-2 border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No runs match this filter.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

function StatusPill({ status }: { status: "upcoming" | "live" | "finished" }) {
  const map = {
    upcoming: { label: "Upcoming", cls: "bg-secondary/30 text-foreground" },
    live: { label: "● LIVE", cls: "bg-primary text-primary-foreground animate-pulse" },
    finished: { label: "Finished", cls: "bg-muted text-muted-foreground" },
  } as const;
  const s = map[status];
  return <span className={`rounded-full px-3 py-1 ${s.cls}`}>{s.label}</span>;
}