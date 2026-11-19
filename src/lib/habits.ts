export type Habit = {
  id: string;
  name: string;
  emoji: string;
  createdAt: string;
  completions: string[]; // ISO date strings YYYY-MM-DD
  color: string;
};

export type HabitStats = {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completedToday: boolean;
};

const STORAGE_KEY = "forgehabs-v1";

const COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
];

export function getHabits(): Habit[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Habit[];
  } catch {
    return [];
  }
}

export function saveHabits(habits: Habit[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

export function createHabit(name: string, emoji = "🔥"): Habit {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    emoji,
    createdAt: new Date().toISOString(),
    completions: [],
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  };
}

export function toggleCompletion(habit: Habit, dateISO: string): Habit {
  const set = new Set(habit.completions);
  if (set.has(dateISO)) {
    set.delete(dateISO);
  } else {
    set.add(dateISO);
  }
  return { ...habit, completions: Array.from(set).sort() };
}

export function computeStats(habit: Habit): HabitStats {
  const today = todayISO();
  const completedToday = habit.completions.includes(today);
  const totalCompletions = habit.completions.length;

  // Compute current streak
  let currentStreak = 0;
  const d = new Date();
  for (;;) {
    const iso = d.toISOString().slice(0, 10);
    if (habit.completions.includes(iso)) {
      currentStreak++;
      d.setDate(d.getDate() - 1);
    } else {
      // Allow today to be incomplete without breaking streak if previous days are good
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

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
