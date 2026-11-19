"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { createHabit, Habit } from "@/lib/habits";
import { cn } from "@/lib/utils";

const EMOJIS = ["🔥", "💪", "📚", "🧘", "🏃", "💧", "✍️", "🎯", "🌙", "🥗"];

type Props = {
  onAdd: (habit: Habit) => void;
};

export function AddHabitForm({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🔥");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(createHabit(name, emoji));
    setName("");
    setEmoji("🔥");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-muted-foreground/30 p-4 text-muted-foreground transition hover:border-primary hover:text-foreground"
        data-testid="add-habit-button"
      >
        <Plus className="h-5 w-5" />
        Add a habit
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border bg-card p-4 shadow-sm space-y-4"
      data-testid="add-habit-form"
    >
      <div>
        <label htmlFor="habit-name" className="text-sm font-medium">
          Habit name
        </label>
        <input
          id="habit-name"
          data-testid="habit-name-input"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Morning run, Read 20 pages..."
          className="mt-1.5 w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Emoji</label>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={cn(
                "h-10 w-10 rounded-xl text-xl transition",
                emoji === e
                  ? "bg-primary text-primary-foreground scale-110"
                  : "bg-muted hover:bg-accent"
              )}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium hover:bg-muted"
        >
          Cancel
        </button>
        <button
          type="submit"
          data-testid="submit-habit"
          disabled={!name.trim()}
          className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-40"
        >
          Create habit
        </button>
      </div>
    </form>
  );
}
