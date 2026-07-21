import { notFound } from "next/navigation";

import { requireAuth } from "@/lib/auth";
import { getUserWorkoutSession } from "@/lib/sessions";
import { buildGuidedSession } from "@/lib/workouts";
import { Timer } from "@/components/Timer";

export const dynamic = "force-dynamic";

function formatDateTime(d: Date) {
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default async function GuidedSessionPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireAuth();
  const session = await getUserWorkoutSession(user.id, params.id);

  if (!session) notFound();

  const guided = buildGuidedSession(
    {
      id: session.id,
      weekIndex: session.weekIndex,
      indexInPlan: session.indexInPlan,
      durationMinutes: session.durationMinutes,
    },
    session.plan.environment as "HOME" | "GYM",
  );

  const date = new Date(session.date);

  return (
    <div className="space-y-4">
      <header className="space-y-1 border-b border-slate-800 pb-3">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-300">
          Guided {guided.environment === "HOME" ? "home" : "gym"} session
        </p>
        <h1 className="text-xl font-semibold tracking-tight text-slate-50">
          {guided.title}
        </h1>
        <p className="text-xs text-slate-400">
          {formatDateTime(date)} · Week {session.weekIndex + 1} of your plan
        </p>
      </header>

      <p className="text-sm text-slate-200">{guided.intro}</p>
      <p className="text-xs text-emerald-300">
        Estimated time: ~{guided.estimatedMinutes} minutes · Focus: {guided.focus}
      </p>

      <div className="rounded-lg border border-amber-500/60 bg-amber-500/10 p-3 text-xs text-amber-100">
        <p className="font-semibold">Go at your own pace</p>
        <p className="mt-1 text-amber-100/90">{guided.safetyNote}</p>
      </div>

      {/* Basic follow-along blocks */}
      <div className="space-y-4">
        {guided.blocks.map((block, blockIndex) => (
          <section
            key={block.id}
            className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/80 p-3"
          >
            <div className="flex items-center justify-between gap-2 text-xs">
              <div>
                <p className="font-semibold text-slate-50">
                  Step {blockIndex + 1}: {block.title}
                </p>
                {block.focusNote && (
                  <p className="text-[11px] text-slate-400">{block.focusNote}</p>
                )}
              </div>
              <p className="text-[11px] text-emerald-300">
                ~{block.targetMinutes} min
              </p>
            </div>

            <ol className="space-y-2 text-xs text-slate-200">
              {block.exercises.map((ex, exIndex) => (
                <li
                  key={ex.id}
                  className="rounded-lg border border-slate-800 bg-slate-900/80 p-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">
                      {blockIndex + 1}.{exIndex + 1} {ex.name}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {ex.durationSeconds
                        ? `${Math.round(ex.durationSeconds / 10) * 10}s timer`
                        : ex.reps ?? "Go by feel"}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-300">
                    {ex.description}
                  </p>
                  {ex.tips && ex.tips.length > 0 && (
                    <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[10px] text-slate-400">
                      {ex.tips.map((tip) => (
                        <li key={tip}>{tip}</li>
                      ))}
                    </ul>
                  )}
                  {ex.durationSeconds && (
                    <TimerClient seconds={ex.durationSeconds} />
                  )}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}

function TimerClient({ seconds }: { seconds: number }) {
  return (
    <div className="mt-2">
      <p className="text-[10px] text-slate-500">
        Basic timer: count down {seconds} seconds using the button below.
      </p>
      <BasicTimer initialSeconds={seconds} />
    </div>
  );
}

import { Timer } from "@/components/Timer";

function BasicTimer({ initialSeconds }: { initialSeconds: number }) {
  return <Timer initialSeconds={initialSeconds} />;
}
