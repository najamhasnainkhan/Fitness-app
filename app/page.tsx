import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="grid gap-8 md:grid-cols-[3fr,2fr] md:items-center">
      <section className="space-y-6">
        <p className="inline-flex rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-200">
          Phase 1 · Core skeleton & auth
        </p>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
          Start your fitness journey with simple, guided home workouts.
        </h1>
        <p className="text-sm leading-relaxed text-slate-300 md:text-base">
          No gym. No complex tracking. Just beginner-friendly workout plans, gentle
          habit building, and a clear path to weight loss you can actually stick
          to.
        </p>
        <div className="flex flex-wrap gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-brand-600"
            >
              Go to your dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-brand-600"
              >
                Start now – it&apos;s free
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-slate-500 hover:bg-slate-900"
              >
                I already have an account
              </Link>
            </>
          )}
        </div>
        <ul className="grid gap-3 text-sm text-slate-200 md:grid-cols-2">
          <li className="flex items-start gap-2 rounded-md border border-slate-800 bg-slate-900/70 p-3">
            <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <div>
              <p className="font-medium">Beginner-only plans</p>
              <p className="text-xs text-slate-400">
                No advanced jargon. Just simple routines you can follow at
                home.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-2 rounded-md border border-slate-800 bg-slate-900/70 p-3">
            <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <div>
              <p className="font-medium">Weight & body tracking</p>
              <p className="text-xs text-slate-400">
                Log your weight and key measurements. No calorie counting.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-2 rounded-md border border-slate-800 bg-slate-900/70 p-3">
            <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <div>
              <p className="font-medium">Guided home sessions</p>
              <p className="text-xs text-slate-400">
                Simple text-based guidance, images, and basic timers.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-2 rounded-md border border-slate-800 bg-slate-900/70 p-3">
            <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <div>
              <p className="font-medium">Built for Android & web</p>
              <p className="text-xs text-slate-400">
                Runs in the browser today; easy to wrap in an Android WebView.
              </p>
            </div>
          </li>
        </ul>
      </section>
      <section className="space-y-4 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-xl shadow-emerald-500/10">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-300">
          What you&apos;ll see after logging in
        </p>
        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-200">
          <p className="font-semibold text-slate-50">Today&apos;s focus</p>
          <ul className="space-y-1 text-xs text-slate-300">
            <li>• 10-minute full-body warmup</li>
            <li>• 3 beginner strength blocks (no equipment)</li>
            <li>• 5-minute cool down + breathing</li>
          </ul>
          <p className="pt-2 text-xs text-emerald-300">
            This is just a preview. The real plans and trackers come in later
            phases.
          </p>
        </div>
        <p className="text-xs text-slate-400">
          This current phase focuses only on secure login, signup, and a simple
          dashboard we can build on.
        </p>
      </section>
    </div>
  );
}
