import type { PlanEnvironment } from "./plans";

export type GuidedExercise = {
  id: string;
  name: string;
  description: string;
  durationSeconds?: number;
  reps?: string;
  tips?: string[];
};

export type GuidedBlockType = "warmup" | "main" | "cooldown" | "breathing";

export type GuidedBlock = {
  id: string;
  title: string;
  type: GuidedBlockType;
  targetMinutes: number;
  focusNote?: string;
  exercises: GuidedExercise[];
};

export type GuidedSession = {
  title: string;
  intro: string;
  focus: string;
  environment: PlanEnvironment;
  estimatedMinutes: number;
  safetyNote: string;
  blocks: GuidedBlock[];
};

type SessionLike = {
  id: string;
  weekIndex: number;
  indexInPlan: number;
  durationMinutes: number | null;
};

export function buildGuidedSession(
  session: SessionLike,
  environment: PlanEnvironment,
): GuidedSession {
  const weekNumber = session.weekIndex + 1;
  const estimatedMinutes = session.durationMinutes ?? 20;

  const baseIntro =
    environment === "HOME"
      ? "You can do this entire session in your living room with just a mat or soft surface. Move at a pace that feels good."
      : "This is a simple, machines-first routine to help you feel comfortable in the gym. Take your time setting up each machine.";

  const focusByWeek: Record<number, string> = {
    1: "Light full-body, learning the movements.",
    2: "Full-body with slightly longer work blocks.",
    3: "A little more time under tension for confidence.",
    4: "Practice week: repeat what feels good and stay consistent.",
  };

  const focus = focusByWeek[weekNumber] ?? focusByWeek[4];

  if (environment === "HOME") {
    return buildHomeGuidedSession({
      weekNumber,
      estimatedMinutes,
      baseIntro,
      focus,
    });
  }

  return buildGymGuidedSession({ weekNumber, estimatedMinutes, baseIntro, focus });
}

function buildHomeGuidedSession(args: {
  weekNumber: number;
  estimatedMinutes: number;
  baseIntro: string;
  focus: string;
}): GuidedSession {
  const { weekNumber, estimatedMinutes, baseIntro, focus } = args;

  const workSeconds = weekNumber <= 2 ? 30 : 40;

  const warmup: GuidedBlock = {
    id: "warmup",
    title: "Gentle warm-up (3–4 min)",
    type: "warmup",
    targetMinutes: 4,
    focusNote: "Wake up your joints and get blood flowing without getting out of breath.",
    exercises: [
      {
        id: "march",
        name: "March in place",
        description: "Stand tall, swing your arms gently, and lift one knee at a time like a slow march.",
        durationSeconds: workSeconds,
        tips: ["Keep shoulders relaxed.", "Breathe in through your nose, out through your mouth."],
      },
      {
        id: "arm-circles",
        name: "Arm circles",
        description: "Raise your arms to shoulder height and draw small circles forward, then backward.",
        durationSeconds: workSeconds,
        tips: ["Only go as high as feels comfortable.", "Shake out your arms if they get tired."],
      },
      {
        id: "hip-circles",
        name: "Hip circles",
        description: "Place hands on hips and slowly draw circles with your hips, changing direction halfway.",
        durationSeconds: workSeconds,
      },
    ],
  };

  const main: GuidedBlock = {
    id: "main",
    title: "Main block – simple strength (10–12 min)",
    type: "main",
    targetMinutes: 12,
    focusNote:
      "We repeat a few movements so your body can learn them. Rest as needed – you don\'t have to rush.",
    exercises: [
      {
        id: "sit-to-stand",
        name: "Chair sit-to-stand",
        description:
          "Sit on the front of a sturdy chair, feet under knees. Lean slightly forward and stand up, then slowly sit back down.",
        durationSeconds: workSeconds,
        tips: ["Use your hands on the chair or thighs if needed.", "Aim for slow, controlled movements."],
      },
      {
        id: "wall-pushup",
        name: "Wall push-ups",
        description:
          "Stand arm\'s length from a wall, hands flat at chest height. Bend elbows to bring your chest toward the wall, then push back.",
        durationSeconds: workSeconds,
        tips: ["Keep your body in a straight line.", "Step closer to make it easier, further to make it harder."],
      },
      {
        id: "hip-hinge",
        name: "Hip hinge reach",
        description:
          "With soft knees, push your hips back like you\'re closing a drawer with your bum, then stand tall and gently squeeze your glutes.",
        durationSeconds: workSeconds,
      },
      {
        id: "dead-bug",
        name: "Dead bug (core)",
        description:
          "Lie on your back, knees above hips. Gently lower one heel toward the floor and bring it back, then switch legs.",
        durationSeconds: workSeconds,
        tips: ["If your back feels tense, keep the movement smaller.", "Keep breathing – don\'t hold your breath."],
      },
    ],
  };

  const cooldown: GuidedBlock = {
    id: "cooldown",
    title: "Cool down & breathing (3–5 min)",
    type: "cooldown",
    targetMinutes: 5,
    focusNote: "Let your heart rate come down and finish feeling calmer than when you started.",
    exercises: [
      {
        id: "quad-stretch",
        name: "Supported quad stretch",
        description:
          "Hold a wall or chair. Gently bend one knee and bring your heel toward your bum, holding your foot or ankle if comfortable.",
        durationSeconds: workSeconds,
      },
      {
        id: "chest-opener",
        name: "Chest opener",
        description:
          "Clasp your hands behind your back (or hold a towel), gently draw your knuckles down and away to open your chest.",
        durationSeconds: workSeconds,
      },
      {
        id: "breathing",
        name: "Box breathing",
        description:
          "Inhale through your nose for 4 seconds, hold for 4, exhale slowly for 4, hold for 4. Repeat at your own pace.",
        durationSeconds: workSeconds,
      },
    ],
  };

  return {
    title: "Guided home session",
    intro: baseIntro,
    focus,
    environment: "HOME",
    estimatedMinutes,
    safetyNote:
      "If anything hurts sharply, stop that movement. It\'s okay to pause, skip an exercise, or shorten the time.",
    blocks: [warmup, main, cooldown],
  };
}

function buildGymGuidedSession(args: {
  weekNumber: number;
  estimatedMinutes: number;
  baseIntro: string;
  focus: string;
}): GuidedSession {
  const { estimatedMinutes, baseIntro, focus } = args;

  const blocks: GuidedBlock[] = [
    {
      id: "warmup",
      title: "Warm-up – treadmill or bike (5 min)",
      type: "warmup",
      targetMinutes: 5,
      exercises: [
        {
          id: "cardio-warmup",
          name: "Easy walk or pedal",
          description:
            "Start at a very easy pace where you can still hold a conversation. Gradually increase speed if it feels good.",
          durationSeconds: 300,
        },
      ],
    },
    {
      id: "machines",
      title: "Machines circuit (10–15 min)",
      type: "main",
      targetMinutes: 15,
      focusNote: "Pick a light weight where the last 2 reps feel effortful but still controlled.",
      exercises: [
        {
          id: "leg-press",
          name: "Leg press",
          description: "Press the platform away slowly, then lower it with control. Aim for 2–3 sets of 8–10 reps.",
          reps: "2–3 sets · 8–10 slow reps",
        },
        {
          id: "row",
          name: "Seated row",
          description:
            "Pull the handles toward your ribs, squeezing your shoulder blades together. Control the return.",
          reps: "2–3 sets · 8–10 reps",
        },
        {
          id: "chest-press",
          name: "Chest press",
          description:
            "Push the handles forward to just before your elbows lock, then slowly bring them back.",
          reps: "2 sets · 8–10 reps",
        },
      ],
    },
    {
      id: "cooldown",
      title: "Cool down & stretch (5 min)",
      type: "cooldown",
      targetMinutes: 5,
      exercises: [
        {
          id: "walk-easy",
          name: "Easy walk",
          description: "Walk slowly until your breathing feels close to normal again.",
          durationSeconds: 120,
        },
        {
          id: "stretch",
          name: "Light stretching",
          description: "Gently stretch legs, chest, and back with no bouncing. Hold each stretch ~20–30 seconds.",
        },
      ],
    },
  ];

  return {
    title: "Guided gym session",
    intro: baseIntro,
    focus,
    environment: "GYM",
    estimatedMinutes,
    safetyNote:
      "Ask staff for help setting up any machine. Stop if you feel pain, dizziness, or anything that worries you.",
    blocks,
  };
}
