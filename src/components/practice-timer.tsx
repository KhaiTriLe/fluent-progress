"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PracticeTimerProps {
  onSessionEnd: (duration: number) => void;
}

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default function PracticeTimer({ onSessionEnd }: PracticeTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number>(0);
  const animationFrameId = useRef<number | null>(null);
  const { toast } = useToast();
  
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [nextPath, setNextPath] = useState('');
  const router = useRouter();

  const animate = useCallback(() => {
    setElapsedTime(Date.now() - startTimeRef.current);
    animationFrameId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    // For browser refresh/close tab
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isRunning) {
        event.preventDefault();
        event.returnValue = 'You have an active practice session. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsedTime;
      animationFrameId.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    }
  }, [isRunning, elapsedTime, animate]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleStop = () => {
    if (elapsedTime > 0) {
      onSessionEnd(elapsedTime);
      toast({
        title: "Session Saved!",
        description: `You practiced for ${formatTime(elapsedTime)}. Great job!`,
      });
    }
    setIsRunning(false);
    setElapsedTime(0);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
  };

  // This is a placeholder for Next.js router integration to prevent leaving the page
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (isRunning && url !== window.location.pathname) {
        setShowExitConfirm(true);
        setNextPath(url);
        // This is a trick to prevent route change in some Next.js versions.
        // It might not be officially supported and could break.
        // A more robust solution might involve a custom router provider.
        router.events.emit('routeChangeError');
        throw 'Route change blocked by practice session.';
      }
    };

    // This is a simplified example. In a real Next.js 13+ app with App Router,
    // you would use a different approach, possibly with a layout and context
    // to intercept navigation. For this example, we'll imagine this works.
    // In a real scenario, `next/navigation`'s `useRouter` doesn't have `events`.
    // This code is illustrative of the goal.
    // For now, we will rely on the beforeunload event.

    return () => {
      // Cleanup logic here
    };
  }, [isRunning, router.events]);

  const confirmNavigation = () => {
    setIsRunning(false);
    router.push(nextPath);
  };

  return (
    <>
      <Card className="w-full shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center">
            <p className="font-mono text-5xl md:text-7xl font-bold text-center text-foreground tabular-nums tracking-tighter">
              {formatTime(elapsedTime)}
            </p>
            <div className="mt-6 flex w-full items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={handleStartPause}
                className="w-32 bg-primary hover:bg-primary/90"
              >
                {isRunning ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                {isRunning ? 'Pause' : 'Start'}
              </Button>
              <Button
                size="lg"
                variant="destructive"
                onClick={handleStop}
                disabled={!isRunning && elapsedTime === 0}
                className="w-32"
              >
                <Square className="mr-2" />
                Stop
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleReset}
                disabled={isRunning}
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End session?</AlertDialogTitle>
            <AlertDialogDescription>
              You have an active practice session. Leaving now will end it without saving. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay</AlertDialogCancel>
            <AlertDialogAction onClick={confirmNavigation}>Leave Page</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
