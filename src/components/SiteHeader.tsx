import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span
            className="grid h-9 w-9 place-items-center rounded-xl text-xl shadow-lg"
            style={{ background: "var(--gradient-hero)" }}
          >
            🏃
          </span>
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>
            PacePack
          </span>
        </Link>
        <nav className="hidden items-center gap-1 sm:flex">
          <Link
            to="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            activeProps={{ className: "rounded-lg px-3 py-2 text-sm font-semibold text-foreground bg-muted" }}
            activeOptions={{ exact: true }}
          >
            Clubs
          </Link>
          <Link
            to="/runs"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            activeProps={{ className: "rounded-lg px-3 py-2 text-sm font-semibold text-foreground bg-muted" }}
          >
            All Runs
          </Link>
        </nav>
        <button
          className="rounded-xl px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-90"
          style={{ background: "var(--gradient-hero)" }}
        >
          + New Club
        </button>
      </div>
    </header>
  );
}