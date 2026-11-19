"use client";

import { Habit, HabitStats, computeStats, toggleCompletion } from "@/lib/habits";
import { cn } from "@/lib/utils";
import { Check, Flame, Trash2 } from "lucide-react";

type Props = {
  habit: Habit;
  onUpdate: (h: Habit) => void;
  onDelete: (id: string) => void;
};

export function HabitCard({ habit, onUpdate, onDelete }: Props) {
  const stats: HabitStats = computeStats(habit);
  const today = new Date().toISOString().slice(0, 10);

  const handleToggle = () => {
    onUpdate(toggleCompletion(habit, today));
  };

  return (
    <div
      className={cn(
        "group relative flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:shadow-md",
        stats.completedToday && "border-emerald-500/40 bg-emerald-500/5"
      )}
      data-testid={`habit-${habit.id}`}
    >
      <button
        onClick={handleToggle}
        aria-label={stats.completedToday ? "Mark incomplete" : "Mark complete"}
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 transition-all",
          stats.completedToday
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-muted-foreground/30 hover:border-primary"
        )}
      >
        {stats.completedToday ? (
          <Check className="h-6 w-6" strokeWidth={3} />
        ) : (
          <span className="text-2xl">{habit.emoji}</span>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold tracking-tight">{habit.name}</h3>
        <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 text-orange-500" />
            {stats.currentStreak} day{stats.currentStreak !== 1 ? "s" : ""}
          </span>
          <span>·</span>
          <span>{stats.totalCompletions} total</span>
        </div>
      </div>

      <button
        onClick={() => onDelete(habit.id)}
        aria-label="Delete habit"
        className="opacity-0 transition-opacity group-hover:opacity-100 p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-red-500"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
