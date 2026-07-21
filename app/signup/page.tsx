import Link from "next/link";
import { signup } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-300">
          Welcome, beginner
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Create your fitness account
        </h1>
        <p className="text-sm text-slate-400">
          Start simple: basic home workouts, gentle progress, and weight
          tracking.
        </p>
      </div>
      <form
        action={async (formData) => {
          "use server";
          return signup(formData);
        }}
        className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/80 p-5 shadow-sm"
      >
        <div className="space-y-1">
          <label
            htmlFor="name"
            className="text-xs font-medium uppercase tracking-wide text-slate-300"
          >
            First name (optional)
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="given-name"
            className="w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/40 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1"
            placeholder="e.g. Maya"
          />
        </div>
        <div className="space-y-1">
          <label
            htmlFor="email"
            className="text-xs font-medium uppercase tracking-wide text-slate-300"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/40 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1"
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-1">
          <label
            htmlFor="password"
            className="text-xs font-medium uppercase tracking-wide text-slate-300"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/40 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1"
            placeholder="At least 8 characters"
          />
        </div>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-brand-600 disabled:opacity-60"
        >
          Create account
        </button>
        <p className="text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-300 hover:text-emerald-200">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
