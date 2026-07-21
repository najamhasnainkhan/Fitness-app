import { prisma } from "./prisma";

export type PlanEnvironment = "HOME" | "GYM";

export interface PlanPreferences {
  environment: PlanEnvironment;
  daysPerWeek: number; // 2–4
}

const BEGINNER_TEMPLATES = {
  HOME: {
    name: "Home Starter (No Equipment)",
    description:
      "Gentle full-body routine you can do in your living room. Focuses on movement, not perfection.",
  },
  GYM: {
    name: "Beginner Gym Confidence Plan",
    description:
      "Simple machines-first routine to ease you into the gym without feeling lost.",
  },
} as const;

export async function getActivePlan(userId: string) {
  return prisma.workoutPlan.findFirst({
    where: { userId, isActive: true },
    include: { sessions: { orderBy: { indexInPlan: "asc" } } },
  });
}

export async function listPlans(userId: string) {
  return prisma.workoutPlan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { sessions: true },
  });
}

export async function createTemplatePlan(userId: string, env: PlanEnvironment) {
  const daysPerWeek = 3;
  const weeks = 4;

  return createPlan(userId, {
    environment: env,
    daysPerWeek,
  });
}

export async function createAutoPlan(userId: string, prefs: PlanPreferences) {
  return createPlan(userId, prefs);
}

async function createPlan(userId: string, prefs: PlanPreferences) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weeks = 4;
  const totalSessions = weeks * prefs.daysPerWeek;

  const sessionsData = buildSessions(today, weeks, prefs.daysPerWeek, prefs.environment);

  const plan = await prisma.workoutPlan.create({
    data: {
      userId,
      name: BEGINNER_TEMPLATES[prefs.environment].name,
      type: "AUTO",
      environment: prefs.environment,
      daysPerWeek: prefs.daysPerWeek,
      weeks,
      startDate: today,
      level: "beginner",
      sessions: {
        createMany: {
          data: sessionsData,
        },
      },
    },
    include: { sessions: true },
  });

  const end = plan.sessions.reduce<Date | null>((acc, s) => {
    if (!acc || s.date > acc) return s.date;
    return acc;
  }, null);

  if (end) {
    await prisma.workoutPlan.update({
      where: { id: plan.id },
      data: { endDate: end },
    });
  }

  return plan;
}

function buildSessions(startDate: Date, weeks: number, daysPerWeek: number, env: PlanEnvironment) {
  const sessions: {
    indexInPlan: number;
    weekIndex: number;
    dayIndex: number;
    date: Date;
    title: string;
    focus: string;
    intensity: string;
    durationMinutes: number;
  }[] = [];

  let index = 0;
  for (let week = 0; week < weeks; week++) {
    for (let day = 0; day < daysPerWeek; day++) {
      const sessionDate = new Date(startDate);
      const offsetDays = week * 7 + day * Math.floor(7 / daysPerWeek);
      sessionDate.setDate(startDate.getDate() + offsetDays);

      const weekNum = week + 1;
      const title = env === "HOME" ? `Home session ${index + 1}` : `Gym session ${index + 1}`;
      const focus =
        weekNum === 1
          ? "Light full-body, learning the movements"
          : weekNum === 2
          ? "Full-body with slightly longer work blocks"
          : weekNum === 3
          ? "A bit more challenge, still beginner-friendly"
          : "Practice & confidence week";

      const intensity = weekNum <= 2 ? "easy" : "easy-moderate";
      const durationMinutes = 20 + week * 5;

      sessions.push({
        indexInPlan: index,
        weekIndex: week,
        dayIndex: day,
        date: sessionDate,
        title,
        focus,
        intensity,
        durationMinutes,
      });

      index++;
    }
  }

  return sessions;
}
