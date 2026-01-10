"use client";

import { useContext, useMemo, useState } from 'react';
import PracticeTimer from '@/components/practice-timer';
import { AppContext } from '@/components/app-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Info, LoaderCircle, Volume2, Languages } from 'lucide-react';
import SentenceLibrary from '@/components/sentence-library';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { textToSpeech } from '@/ai/flows/tts-flow';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function PracticePage() {
  const { topics, addPracticeSession, incrementSentenceCount, toggleSentenceSelection, isLoaded, geminiApiKey } = useContext(AppContext);
  const [playingSentenceId, setPlayingSentenceId] = useState<string | null>(null);
  const { toast } = useToast();

  const selectedSentences = useMemo(() => {
    if (!isLoaded) return [];
    return topics.flatMap(topic =>
      topic.sentences
        .filter(sentence => sentence.selected)
        .map(sentence => ({ ...sentence, topicId: topic.id }))
    );
  }, [topics, isLoaded]);

  const handleSpeak = async (sentenceText: string, sentenceId: string) => {
    if (!geminiApiKey) {
        toast({
            variant: 'destructive',
            title: 'Missing API Key',
            description: 'Please set your Gemini API key in the settings page to use this feature.',
        });
        return;
    }
    setPlayingSentenceId(sentenceId);
    try {
      const { audioDataUri } = await textToSpeech({text: sentenceText, apiKey: geminiApiKey});
      const audio = new Audio(audioDataUri);
      audio.play();
      audio.onended = () => setPlayingSentenceId(null);
    } catch (error) {
      console.error("Error generating speech:", error);
      toast({
        variant: 'destructive',
        title: 'Speech Error',
        description: 'Could not generate audio for this sentence.',
      });
      setPlayingSentenceId(null);
    }
  };

  const speakButton = (sentence: any) => (
    <Button
        size="icon"
        variant="ghost"
        onClick={() => handleSpeak(sentence.text, sentence.id)}
        disabled={!geminiApiKey || playingSentenceId === sentence.id}
    >
        {playingSentenceId === sentence.id ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Volume2 className="h-5 w-5 text-accent" />}
    </Button>
  );

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
            <ul className="space-y-2">
              {selectedSentences.map((sentence) => (
                <Collapsible asChild key={sentence.id}>
                  <li
                    className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm"
                  >
                    <div className='flex items-center justify-between gap-4'>
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
                        {geminiApiKey ? (
                             speakButton(sentence)
                        ) : (
                            <Tooltip>
                                <TooltipTrigger>{speakButton(sentence)}</TooltipTrigger>
                                <TooltipContent>
                                <p>Please add a Gemini API key in settings.</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Languages className="h-5 w-5 text-accent" />
                            </Button>
                        </CollapsibleTrigger>
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
                    </div>
                    <CollapsibleContent>
                        <div className="ml-10 rounded-md border bg-muted/50 p-3 text-sm text-muted-foreground">
                            <p><span className="font-semibold text-foreground">[VI]</span> {sentence.vietnamese}</p>
                        </div>
                    </CollapsibleContent>
                  </li>
                </Collapsible>
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
