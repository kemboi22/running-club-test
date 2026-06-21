import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { createClub } from "@/lib/mock-data";

export const Route = createFileRoute("/clubs/new")({
  head: () => ({ meta: [{ title: "New club — PacePack" }] }),
  component: NewClubPage,
});

const EMOJIS = ["🏃", "🌅", "🌙", "🌲", "⚡", "🔥", "🏔️", "🌊", "🌻"];
const ACCENTS = ["#ff6b35", "#f7931e", "#e84393", "#22c55e", "#3b82f6", "#a855f7"];

function NewClubPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    city: "",
    description: "",
    emoji: "🏃",
    accent: ACCENTS[0],
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const club = createClub(form);
    if (club) navigate({ to: "/clubs/$clubId", params: { clubId: club.id } });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <Link to="/clubs" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
          ← All clubs
        </Link>
        <h1 className="font-display mt-3 text-5xl">Start a club</h1>
        <p className="mt-1 text-muted-foreground">Give your pack an identity — invite runners after.</p>

        <form onSubmit={submit} className="mt-8 space-y-5 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <Field label="Club name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required placeholder="Sunrise Striders" />
          <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required placeholder="New York, NY" />
          <div>
            <span className="mb-1.5 block text-sm font-bold uppercase tracking-wider text-foreground">About</span>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={3}
              placeholder="What's your club about?"
              className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-foreground">Icon</span>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button
                  type="button"
                  key={e}
                  onClick={() => setForm({ ...form, emoji: e })}
                  className={`grid h-11 w-11 place-items-center rounded-xl border-2 text-xl transition ${
                    form.emoji === e ? "border-primary bg-primary/10" : "border-border bg-background hover:border-primary/40"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-foreground">Accent</span>
            <div className="flex flex-wrap gap-2">
              {ACCENTS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setForm({ ...form, accent: c })}
                  aria-label={c}
                  className={`h-10 w-10 rounded-xl border-2 transition ${form.accent === c ? "border-foreground scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground hover:brightness-110"
          >
            Create club
          </button>
        </form>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold uppercase tracking-wider text-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
      />
    </label>
  );
}