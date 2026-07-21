import { prisma } from "./prisma";

export async function getUserWorkoutSession(userId: string, sessionId: string) {
  return prisma.workoutSession.findFirst({
    where: {
      id: sessionId,
      plan: { userId },
    },
    include: {
      plan: true,
    },
  });
}
