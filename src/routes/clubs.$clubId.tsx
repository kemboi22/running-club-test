import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import {
  getClub,
  getRun,
  inviteMember,
  createRun,
  useStore,
} from "@/lib/mock-data";

export const Route = createFileRoute("/clubs/$clubId")({
  loader: ({ params }) => {
    const club = getClub(params.clubId);
    if (!club) throw notFound();
    return { clubId: params.clubId };
  },
  head: ({ loaderData, params }) => {
    const club = loaderData ? getClub(loaderData.clubId) : getClub(params.clubId);
    return {
      meta: [
        { title: `${club?.name ?? "Club"} — PacePack` },
        { name: "description", content: club?.description ?? "Running club" },
      ],
    };
  },
  component: ClubPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-xl p-10 text-center">
        <h1 className="font-display text-4xl">Club not found</h1>
        <Link to="/clubs" className="mt-4 inline-block text-primary hover:underline">
          ← Back to clubs
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-destructive">{error.message}</div>
  ),
});

function ClubPage() {
  useStore();
  const { clubId } = Route.useLoaderData();
  const club = getClub(clubId)!;
  const clubRuns = club.runIds.map((id) => getRun(id)!).filter(Boolean);

  const [showInvite, setShowInvite] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Solid colored hero (no gradient) */}
      <section className="text-primary-foreground" style={{ backgroundColor: club.accent }}>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <Link to="/clubs" className="text-sm font-semibold opacity-85 hover:opacity-100">
            ← All clubs
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="grid h-20 w-20 place-items-center rounded-2xl bg-white/20 text-5xl backdrop-blur">
              {club.emoji}
            </span>
            <div>
              <h1 className="font-display text-5xl sm:text-7xl">{club.name}</h1>
              <p className="text-base opacity-90">📍 {club.city}</p>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-base opacity-95">{club.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setShowInvite(true)}
              className="rounded-xl bg-card px-5 py-2.5 text-sm font-bold text-foreground hover:brightness-95"
            >
              + Invite members
            </button>
            <button
              onClick={() => setShowCreate(true)}
              className="rounded-xl border-2 border-white/70 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10"
            >
              + Create run
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-display text-3xl">Runs ({clubRuns.length})</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {clubRuns.map((r) => (
              <Link
                key={r.id}
                to="/runs/$runId"
                params={{ runId: r.id }}
                className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]"
              >
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <span>
                    {r.date} · {r.time}
                  </span>
                  {r.isPaid ? (
                    <span className="text-accent">${r.price}</span>
                  ) : (
                    <span className="text-primary">FREE</span>
                  )}
                </div>
                <h3 className="font-display mt-2 text-2xl">{r.title}</h3>
                <p className="text-sm text-muted-foreground">📍 {r.location}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-wider text-primary">
                  {r.paths.length} paths · {r.joined.length} joined →
                </p>
              </Link>
            ))}
            {clubRuns.length === 0 && (
              <div className="rounded-2xl border-2 border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                No runs scheduled yet — hit "Create run" up top.
              </div>
            )}
          </div>
        </div>

        <aside>
          <h2 className="font-display text-3xl">Members ({club.members.length})</h2>
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
                    <p className="text-xs text-muted-foreground">avg {m.pace}/km</p>
                  </div>
                </div>
              </div>
            ))}
            {club.members.length === 0 && (
              <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No members yet — invite some!
              </p>
            )}
          </div>
        </aside>
      </main>

      {showInvite && (
        <InviteModal clubId={clubId} onClose={() => setShowInvite(false)} />
      )}
      {showCreate && (
        <CreateRunModal clubId={clubId} onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/50 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-3xl">{title}</h3>
          <button onClick={onClose} className="text-2xl text-muted-foreground hover:text-foreground">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function InviteModal({ clubId, onClose }: { clubId: string; onClose: () => void }) {
  const [name, setName] = useState("");
  const [added, setAdded] = useState<string[]>([]);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    inviteMember(clubId, name.trim());
    setAdded((a) => [...a, name.trim()]);
    setName("");
  };

  return (
    <Modal title="Invite members" onClose={onClose}>
      <p className="mt-1 text-sm text-muted-foreground">
        Add your runners by name — they'll appear in the members list instantly.
      </p>
      <form onSubmit={add} className="mt-5 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Runner"
          className="flex-1 rounded-xl border-2 border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground hover:brightness-110"
        >
          Add
        </button>
      </form>
      {added.length > 0 && (
        <ul className="mt-4 space-y-1 text-sm">
          {added.map((n, i) => (
            <li key={i} className="rounded-lg bg-primary/10 px-3 py-2 text-primary">
              ✓ {n} invited
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={onClose}
        className="mt-5 w-full rounded-xl border-2 border-border py-2.5 text-sm font-bold hover:bg-muted"
      >
        Done
      </button>
    </Modal>
  );
}

function CreateRunModal({ clubId, onClose }: { clubId: string; onClose: () => void }) {
  const [form, setForm] = useState({
    title: "",
    date: new Date().toISOString().slice(0, 10),
    time: "07:00",
    location: "",
    isPaid: false,
    price: 10,
  });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    createRun({
      clubId,
      title: form.title,
      date: form.date,
      time: form.time,
      location: form.location,
      isPaid: form.isPaid,
      price: form.isPaid ? Number(form.price) : undefined,
    });
    onClose();
  };

  return (
    <Modal title="Create run" onClose={onClose}>
      <form onSubmit={submit} className="mt-4 space-y-4">
        <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Date" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} required />
          <Input label="Time" type="time" value={form.time} onChange={(v) => setForm({ ...form, time: v })} required />
        </div>
        <Input label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} required />
        <div className="flex items-center gap-3 rounded-xl border-2 border-border bg-background p-3">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={form.isPaid}
              onChange={(e) => setForm({ ...form, isPaid: e.target.checked })}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            Paid run
          </label>
          {form.isPaid && (
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-muted-foreground">$</span>
              <input
                type="number"
                min={1}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-20 rounded-lg border border-border bg-background px-2 py-1 text-sm"
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground hover:brightness-110"
        >
          Schedule run
        </button>
      </form>
    </Modal>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-xl border-2 border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
      />
    </label>
  );
}