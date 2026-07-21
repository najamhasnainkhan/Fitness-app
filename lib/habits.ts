"use server";

import { prisma } from "./prisma";

export type HabitCadence = "DAILY" | "WEEKLY";

export type HabitWithStats = {
  id: string;
  title: string;
  cadence: HabitCadence;
  createdAt: Date;
  archivedAt: Date | null;
  completions: { occurredOn: Date }[];
  streak: number;
  completedTodayOrThisPeriod: boolean;
};

const STREAK_WINDOW_DAYS = 14;

export async function listHabitsWithRecentStats(userId: string): Promise<HabitWithStats[]> {
  const since = new Date();
  since.setDate(since.getDate() - STREAK_WINDOW_DAYS);

  const habits = await prisma.habit.findMany({
    where: { userId, archivedAt: null },
    orderBy: { createdAt: "asc" },
    include: {
      completions: {
        where: { occurredOn: { gte: since } },
        orderBy: { occurredOn: "asc" },
      },
    },
  });

  const today = startOfDay(new Date());

  return habits.map((h) => {
    const completions = h.completions.map((c) => ({ occurredOn: c.occurredOn }));
    const { streak, completedTodayOrThisPeriod } =
      h.cadence === "DAILY"
        ? computeDailyStreak(completions, today)
        : computeWeeklyStreak(completions, today);

    return {
      id: h.id,
      title: h.title,
      cadence: h.cadence as HabitCadence,
      createdAt: h.createdAt,
      archivedAt: h.archivedAt,
      completions,
      streak,
      completedTodayOrThisPeriod,
    };
  });
}

export async function createHabit(userId: string, formData: FormData) {
  const title = String(formData.get("title"))?.trim();
  const cadence = formData.get("cadence");

  if (!title || (cadence !== "DAILY" && cadence !== "WEEKLY")) {
    return;
  }

  await prisma.habit.create({
    data: {
      userId,
      title,
      cadence: cadence as HabitCadence,
    },
  });
}

export async function toggleHabitCompletion(userId: string, formData: FormData) {
  const habitId = String(formData.get("habitId"));
  const dateStr = String(formData.get("date"));

  if (!habitId || !dateStr) return;

  const habit = await prisma.habit.findFirst({ where: { id: habitId, userId } });
  if (!habit) return;

  const targetDate = startOfDay(new Date(dateStr));

  const existing = await prisma.habitCompletion.findUnique({
    where: {
      habitId_occurredOn: {
        habitId,
        occurredOn: targetDate,
      },
    },
  });

  if (existing) {
    await prisma.habitCompletion.delete({ where: { id: existing.id } });
  } else {
    await prisma.habitCompletion.create({
      data: {
        habitId,
        occurredOn: targetDate,
      },
    });
  }
}

export async function archiveHabit(userId: string, formData: FormData) {
  const habitId = String(formData.get("habitId"));
  if (!habitId) return;

  await prisma.habit.updateMany({
    where: { id: habitId, userId },
    data: { archivedAt: new Date() },
  });
}

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function computeDailyStreak(completions: { occurredOn: Date }[], today: Date) {
  const completionDays = new Set(
    completions.map((c) => startOfDay(c.occurredOn).getTime()),
  );

  let streak = 0;
  let cursor = startOfDay(today).getTime();

  while (completionDays.has(cursor)) {
    streak++;
    cursor -= 24 * 60 * 60 * 1000;
  }

  const completedTodayOrThisPeriod = completionDays.has(startOfDay(today).getTime());

  return { streak, completedTodayOrThisPeriod };
}

function computeWeeklyStreak(completions: { occurredOn: Date }[], today: Date) {
  const weekKeys = new Set(completions.map((c) => weekKey(c.occurredOn)));

  let streak = 0;
  let cursor = new Date(today);

  while (weekKeys.has(weekKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 7);
  }

  const completedTodayOrThisPeriod = weekKeys.has(weekKey(today));

  return { streak, completedTodayOrThisPeriod };
}

function weekKey(d: Date): string {
  const tmp = startOfDay(d);
  const day = tmp.getDay();
  const diffToMonday = (day + 6) % 7; // 0 for Monday, 6 for Sunday
  tmp.setDate(tmp.getDate() - diffToMonday);
  return tmp.toISOString().slice(0, 10);
}
