export type Habit = {
  id: string;
  name: string;
  emoji: string;
  createdAt: string;
  completions: string[]; // ISO date strings (YYYY-MM-DD)
};

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback for environments where crypto.randomUUID is not available
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function createHabit(name: string, emoji = "🔥"): Habit {
  return {
    id: generateId(),
    name: name.trim(),
    emoji,
    createdAt: new Date().toISOString(),
    completions: [],
  };
}

export function getHabits(): Habit[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("forge-habits");
    if (!raw) return [];
    return JSON.parse(raw) as Habit[];
  } catch {
    return [];
  }
}

export function saveHabits(habits: Habit[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("forge-habits", JSON.stringify(habits));
}

export function computeStats(habit: Habit) {
  const today = new Date().toISOString().slice(0, 10);
  const completedToday = habit.completions.includes(today);

  // Calculate current streak
  let currentStreak = 0;
  const sorted = [...habit.completions].sort().reverse();
  const d = new Date();

  for (const date of sorted) {
    const expected = d.toISOString().slice(0, 10);
    if (date === expected) {
      currentStreak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }

  return {
    completedToday,
    currentStreak,
    totalCompletions: habit.completions.length,
  };
}

export function toggleCompletion(habit: Habit): Habit {
  const today = new Date().toISOString().slice(0, 10);
  const hasToday = habit.completions.includes(today);

  return {
    ...habit,
    completions: hasToday
      ? habit.completions.filter((d) => d !== today)
      : [...habit.completions, today],
  };
}
