"use client";

import { useContext, useMemo } from 'react';
import PracticeTimer from '@/components/practice-timer';
import { AppContext } from '@/components/app-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Info } from 'lucide-react';
import SentenceLibrary from '@/components/sentence-library';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

export default function PracticePage() {
  const { topics, addPracticeSession, incrementSentenceCount, toggleSentenceSelection, isLoaded } = useContext(AppContext);

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
          <CardTitle>Your Practice Set</CardTitle>
          <CardDescription>
            These are your selected sentences. Increment the count or unselect them to remove them.
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
                  <div className="flex flex-1 items-center gap-4">
                    <Checkbox
                      id={`practice-cb-${sentence.id}`}
                      checked={sentence.selected}
                      onCheckedChange={(checked) => toggleSentenceSelection(sentence.topicId, sentence.id, !!checked)}
                      aria-label={`Unselect ${sentence.text}`}
                    />
                     <label htmlFor={`practice-cb-${sentence.id}`} className="flex-1 cursor-pointer text-sm">
                        {sentence.text}
                     </label>
                  </div>
                  <div className="flex items-center gap-2">
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
                Select sentences from your library below to start practicing.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Separator className="my-12" />

      <SentenceLibrary />

    </div>
  );
}
