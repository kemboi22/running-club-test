import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — PacePack" },
      { name: "description", content: "Log in to your PacePack running club." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/" });
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <aside
        className="hidden flex-col justify-between p-12 text-primary-foreground md:flex"
        style={{ backgroundColor: "var(--primary)" }}
      >
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-foreground/15 text-xl">
            🏃
          </span>
          <span className="font-display text-2xl tracking-wide">PACEPACK</span>
        </Link>
        <div>
          <h2 className="font-display text-6xl leading-[0.95]">
            Welcome back,
            <br /> runner.
          </h2>
          <p className="mt-4 max-w-sm opacity-90">
            Pick up where you left off — your club, your runs, your leaderboards.
          </p>
          <ul className="mt-8 space-y-3 text-sm font-semibold">
            <li>🏆 Track every PR</li>
            <li>🗺️ Pick your path on the map</li>
            <li>⭐ Get crowned MVP</li>
          </ul>
        </div>
        <p className="text-xs opacity-70">© PacePack</p>
      </aside>

      <main className="flex items-center justify-center bg-background p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground md:hidden"
          >
            ← Home
          </Link>
          <h1 className="font-display mt-2 text-5xl">Log in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              required
            />
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              required
            />
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="h-4 w-4 accent-[var(--primary)]" />
                Remember me
              </label>
              <a href="#" className="font-semibold text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground transition hover:brightness-110"
            >
              Log in
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> OR{" "}
            <span className="h-px flex-1 bg-border" />
          </div>

          <button className="w-full rounded-xl border-2 border-border bg-card py-3 text-sm font-bold text-foreground hover:bg-muted">
            Continue with Google
          </button>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none"
      />
    </label>
  );
}