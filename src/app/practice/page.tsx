"use client";

import { useContext, useMemo } from 'react';
import PracticeTimer from '@/components/practice-timer';
import { AppContext } from '@/components/app-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Info } from 'lucide-react';
import Link from 'next/link';

export default function PracticePage() {
  const { topics, addPracticeSession, incrementSentenceCount, isLoaded } = useContext(AppContext);

  const selectedSentences = useMemo(() => {
    if (!isLoaded) return [];
    return topics.flatMap(topic =>
      topic.sentences
        .filter(sentence => sentence.selected)
        .map(sentence => ({ ...sentence, topicId: topic.id }))
    );
  }, [topics, isLoaded]);

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary">
          Practice Session
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Focus and speak. Your progress is being tracked.
        </p>
      </header>

      <PracticeTimer onSessionEnd={addPracticeSession} />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Practice Sentences</CardTitle>
          <CardDescription>
            These are the sentences you've selected. Tap the plus button each time you practice one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedSentences.length > 0 ? (
            <ul className="space-y-4">
              {selectedSentences.map((sentence) => (
                <li
                  key={sentence.id}
                  className="flex items-center justify-between gap-4 rounded-lg border bg-card p-4 shadow-sm"
                >
                  <p className="flex-1 text-card-foreground">{sentence.text}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-primary">{sentence.practiceCount}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => incrementSentenceCount(sentence.topicId, sentence.id)}
                      aria-label={`Increment count for ${sentence.text}`}
                    >
                      <PlusCircle className="h-6 w-6 text-accent" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center">
              <Info className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No Sentences Selected</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Go to the sentences page to select some for your practice session.
              </p>
              <Button asChild className="mt-6">
                <Link href="/sentences">Select Sentences</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
