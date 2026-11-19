"use client";

import { useEffect, useState } from "react";
import {
  Habit,
  getHabits,
  saveHabits,
  computeStats,
} from "@/lib/habits";
import { HabitCard } from "@/components/HabitCard";
import { AddHabitForm } from "@/components/AddHabitForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Flame, ShieldCheck } from "lucide-react";

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setHabits(getHabits());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveHabits(habits);
  }, [habits, ready]);

  const handleAdd = (h: Habit) => setHabits((prev) => [h, ...prev]);
  const handleUpdate = (updated: Habit) =>
    setHabits((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
  const handleDelete = (id: string) =>
    setHabits((prev) => prev.filter((h) => h.id !== id));

  const completedToday = habits.filter((h) => computeStats(h).completedToday).length;
  const totalStreak = habits.reduce((sum, h) => sum + computeStats(h).currentStreak, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Forge</h1>
              <p className="text-xs text-muted-foreground">Daily habits, verified</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="hidden sm:flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs text-muted-foreground"
              title="Verified with Kane CLI"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              Kane
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-8 space-y-8">
        {/* Stats bar */}
        {ready && habits.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground">Done today</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">
                {completedToday}
                <span className="text-base font-normal text-muted-foreground">
                  /{habits.length}
                </span>
              </p>
            </div>
            <div className="rounded-2xl border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground">Active streak</p>
              <p className="mt-1 text-2xl font-bold tabular-nums flex items-center gap-1.5">
                <Flame className="h-5 w-5 text-orange-500" />
                {totalStreak}
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {ready && habits.length === 0 && (
          <div className="rounded-2xl border border-dashed bg-card/50 p-10 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <Flame className="h-7 w-7 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold">Start your first habit</h2>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Build consistency. Every completion is recorded. Kane CLI verifies the whole flow works.
            </p>
          </div>
        )}

        {/* Habit list */}
        <div className="space-y-3" data-testid="habit-list">
          {habits.map((h) => (
            <HabitCard
              key={h.id}
              habit={h}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {/* Add form */}
        <AddHabitForm onAdd={handleAdd} />

        {/* Footer note */}
        <p className="pt-6 text-center text-xs text-muted-foreground">
          Built with an AI agent · Verified with{" "}
          <a
            href="https://www.testmuai.com/kane-cli"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Kane CLI
          </a>
        </p>
      </main>
    </div>
  );
}
