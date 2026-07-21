"use server";

import { requireAuth } from "@/lib/auth";
import { archiveHabit, createHabit, toggleHabitCompletion } from "@/lib/habits";

export async function createHabitAction(formData: FormData) {
  const user = await requireAuth();
  await createHabit(user.id, formData);
}

export async function toggleHabitCompletionAction(formData: FormData) {
  const user = await requireAuth();
  await toggleHabitCompletion(user.id, formData);
}

export async function archiveHabitAction(formData: FormData) {
  const user = await requireAuth();
  await archiveHabit(user.id, formData);
}
