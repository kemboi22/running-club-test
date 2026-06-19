import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — PacePack" },
      { name: "description", content: "Join PacePack and start running with your club." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "runner" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/" });
  };

  const set = (k: keyof typeof form) => (v: string) => setForm({ ...form, [k]: v });

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Right-side solid brand panel (using secondary so signup feels distinct from login) */}
      <aside className="hidden bg-secondary p-12 text-secondary-foreground md:order-2 md:flex md:flex-col md:justify-between">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary-foreground/10 text-xl">🏃</span>
          PacePack
        </Link>
        <div>
          <h2 className="text-4xl font-black leading-tight">
            Join the <br /> pack.
          </h2>
          <p className="mt-4 max-w-sm text-secondary-foreground/85">
            Create your account in seconds, then start a club or join one.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
            <Tile label="Clubs" value="120+" />
            <Tile label="Runners" value="8.4k" />
            <Tile label="Runs / week" value="540" />
            <Tile label="MVPs crowned" value="2.1k" />
          </div>
        </div>
        <p className="text-xs text-secondary-foreground/70">© PacePack</p>
      </aside>

      <main className="flex items-center justify-center bg-background p-6 sm:p-12 md:order-1">
        <div className="w-full max-w-md">
          <Link to="/" className="text-sm font-semibold text-muted-foreground hover:text-foreground md:hidden">
            ← Home
          </Link>
          <h1 className="mt-2 text-3xl font-black">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Already a member?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Log in
            </Link>
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <Field label="Full name" value={form.name} onChange={set("name")} placeholder="Jane Runner" required />
            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="you@example.com"
              required
            />
            <Field
              label="Password"
              type="password"
              value={form.password}
              onChange={set("password")}
              placeholder="At least 8 characters"
              required
            />

            <div>
              <span className="mb-1.5 block text-sm font-semibold text-foreground">I'm joining as</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "runner", label: "🏃 Runner" },
                  { id: "organizer", label: "📣 Club organizer" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => set("role")(opt.id)}
                    className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${
                      form.role === opt.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-foreground hover:border-primary/40"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
            >
              Create account
            </button>

            <p className="text-center text-xs text-muted-foreground">
              By signing up you agree to our Terms and Privacy Policy.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary-foreground/10 p-4">
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs font-semibold text-secondary-foreground/80">{label}</p>
    </div>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none"
      />
    </label>
  );
}