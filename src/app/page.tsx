"use client";

import { useContext } from "react";
import { AppContext } from "@/components/app-provider";
import StatCard from "@/components/stat-card";
import { Flame, Timer, BarChart3, Star } from "lucide-react";
import { formatDistance, format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function formatDuration(ms: number) {
  if (ms < 0) ms = 0;
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));

  let formatted = "";
  if (hours > 0) formatted += `${hours}h `;
  if (minutes > 0) formatted += `${minutes}m `;
  if (hours === 0 && minutes === 0) formatted += `${seconds}s`;

  return formatted.trim() || "0s";
}

export default function Home() {
  const { statistics, isLoaded } = useContext(AppContext);

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Welcome back! Here's your progress summary.
        </p>
      </header>

      {isLoaded ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Current Streak"
            value={`${statistics.currentStreak} day${statistics.currentStreak !== 1 ? 's' : ''}`}
            icon={<Flame className="text-orange-500" />}
            description={statistics.longestStreak > 0 ? `Longest: ${statistics.longestStreak} days` : "Start practicing to build a streak!"}
          />
          <StatCard
            title="Today's Practice"
            value={formatDuration(statistics.timeToday)}
            icon={<Timer className="text-green-500" />}
            description={`Practiced on ${statistics.totalPracticeDays} day${statistics.totalPracticeDays !== 1 ? 's' : ''}`}
          />
          <StatCard
            title="Total Time"
            value={formatDuration(statistics.totalTime)}
            icon={<BarChart3 className="text-blue-500" />}
            description={statistics.lastSessionDate ? `Last session: ${format(new Date(statistics.lastSessionDate), "MMM d")}` : "No sessions yet."}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[150px] rounded-lg" />
          <Skeleton className="h-[150px] rounded-lg" />
          <Skeleton className="h-[150px] rounded-lg" />
        </div>
      )}

      <div className="mt-12 text-center">
        <h2 className="font-headline text-2xl font-semibold">Ready to practice?</h2>
        <p className="mt-2 text-muted-foreground">
          Select your sentences and start the timer.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="font-bold">
                <Link href="/practice">
                    <Star className="mr-2" /> Start Practice Session
                </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
                <Link href="/sentences">Manage Sentences</Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
