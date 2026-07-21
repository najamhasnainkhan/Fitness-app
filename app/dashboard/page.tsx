import { requireAuth, logout } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-300">
            Dashboard
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Hey {user.name || user.email}, let&apos;s keep it simple.
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            In this first version you can log in, manage your account, and soon
            you&apos;ll be able to follow beginner plans, track habits, and log your
            progress.
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            await logout();
          }}
        >
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
          >
            Log out
          </button>
        </form>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2 rounded-xl border border-emerald-500/30 bg-slate-950/80 p-4 shadow-sm shadow-emerald-500/20">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-200">
            Today
          </p>
          <p className="text-sm font-semibold text-slate-50">
            Simple movement, gentle progress
          </p>
          <p className="text-xs text-slate-300">
            In a later phase this card will show your exact plan for today.
            For now, treat it as a reminder to move for 10–15 minutes.
          </p>
        </div>
        <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/80 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-300">
            Habits
          </p>
          <p className="text-sm font-semibold text-slate-50">Coming soon</p>
          <p className="text-xs text-slate-400">
            You&apos;ll be able to tick off tiny daily habits like
            "+1 glass of water" or "5-minute stretch".
          </p>
        </div>
        <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/80 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-300">
            Weight & body
          </p>
          <p className="text-sm font-semibold text-slate-50">Coming soon</p>
          <p className="text-xs text-slate-400">
            You&apos;ll be able to log your weight and measurements here. No
            calorie counting, just simple progress.
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
          Phase 1 completed
        </p>
        <p className="mt-1 text-sm text-slate-300">
          You can now sign up, log in, and see your dashboard. Next we&apos;ll add
          beginner workout planning, guided home workouts, habit tracking, and
          weight / measurement tracking on top of this.
        </p>
      </section>
    </div>
  );
}
