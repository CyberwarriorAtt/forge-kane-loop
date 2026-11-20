export type Habit = {
  id: string;
  name: string;
  emoji: string;
  createdAt: string;
  completions: string[]; // ISO date strings YYYY-MM-DD
};

export type HabitStats = {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completedToday: boolean;
};

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
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

export function createHabit(name: string, emoji = "🔥"): Habit {
  return {
    id: generateId(),
    name: name.trim(),
    emoji,
    createdAt: new Date().toISOString(),
    completions: [],
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

export function computeStats(habit: Habit): HabitStats {
  const today = new Date().toISOString().slice(0, 10);
  const completedToday = habit.completions.includes(today);
  const totalCompletions = habit.completions.length;

  // Current streak
  let currentStreak = 0;
  const d = new Date();
  for (;;) {
    const iso = d.toISOString().slice(0, 10);
    if (habit.completions.includes(iso)) {
      currentStreak++;
      d.setDate(d.getDate() - 1);
    } else {
      if (iso === today) {
        d.setDate(d.getDate() - 1);
        continue;
      }
      break;
    }
  }

  // Longest streak
  let longestStreak = 0;
  let run = 0;
  const sorted = [...habit.completions].sort();
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) {
      run = 1;
    } else {
      const prev = new Date(sorted[i - 1]);
      const curr = new Date(sorted[i]);
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        run++;
      } else {
        longestStreak = Math.max(longestStreak, run);
        run = 1;
      }
    }
  }
  longestStreak = Math.max(longestStreak, run);

  return { currentStreak, longestStreak, totalCompletions, completedToday };
}
