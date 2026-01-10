"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [startTime, setStartTime] = useState(0);
  const animationFrameId = useRef<number | null>(null);
  const { toast } = useToast();

  const animate = useCallback(() => {
    setElapsedTime(Date.now() - startTime);
    animationFrameId.current = requestAnimationFrame(animate);
  }, [startTime]);

  useEffect(() => {
    if (isRunning) {
      setStartTime(Date.now() - elapsedTime);
      animationFrameId.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
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
  
  return (
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
  );
}
