"use client";

import { useState, useContext } from 'react';
import type { Sentence, Topic } from "@/lib/types";
import { AppContext } from "@/components/app-provider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Volume2, Languages, LoaderCircle } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { textToSpeech } from '@/ai/flows/tts-flow';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SentenceItemProps {
  sentence: Sentence;
  topic: Topic;
  onToggleSelection: (topicId: string, sentenceId: string, selected: boolean) => void;
  onEdit: (topic: Topic, sentence: Sentence) => void;
  onDelete: (topicId: string, sentence: Sentence) => void;
}

export default function SentenceItem({ sentence, topic, onToggleSelection, onEdit, onDelete }: SentenceItemProps) {
  const { geminiApiKey, audioCache, setAudioCache } = useContext(AppContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const handleSpeak = async () => {
    if (!geminiApiKey) {
        toast({
            variant: 'destructive',
            title: 'Missing API Key',
            description: 'Please set your Gemini API key in the settings page to use this feature.',
        });
        return;
    }

    if (audioCache[sentence.id]) {
        const audio = new Audio(audioCache[sentence.id]);
        setIsPlaying(true);
        audio.play();
        audio.onended = () => setIsPlaying(false);
        return;
    }

    setIsPlaying(true);
    try {
      const { audioDataUri } = await textToSpeech({text: sentence.text, apiKey: geminiApiKey});
      setAudioCache(sentence.id, audioDataUri);
      const audio = new Audio(audioDataUri);
      audio.play();
      audio.onended = () => setIsPlaying(false);
    } catch (error) {
      console.error("Error generating speech:", error);
      toast({
        variant: 'destructive',
        title: 'Speech Error',
        description: 'Could not generate audio. Check your API key or network connection.',
      });
      setIsPlaying(false);
    }
  };

  const speakButton = (
    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSpeak} disabled={!geminiApiKey || isPlaying}>
      {isPlaying ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
    </Button>
  );

  return (
    <Collapsible asChild>
      <li className="flex flex-col gap-2 rounded-md p-2 hover:bg-accent/50">
        <div className="flex items-center gap-4">
          <Checkbox
            id={`cb-${sentence.id}`}
            checked={sentence.selected}
            onCheckedChange={(checked) => onToggleSelection(topic.id, sentence.id, !!checked)}
          />
          <label htmlFor={`cb-${sentence.id}`} className="flex-1 cursor-pointer text-sm">
            {sentence.text}
          </label>
          <div className="flex items-center gap-1">
            {geminiApiKey ? speakButton : (
                <Tooltip>
                    <TooltipTrigger>{speakButton}</TooltipTrigger>
                    <TooltipContent>
                        <p>Please add a Gemini API key in settings.</p>
                    </TooltipContent>
                </Tooltip>
            )}
            <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Languages className="h-4 w-4" />
                </Button>
            </CollapsibleTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(topic, sentence)}><Edit className="h-4 w-4" /></Button>
            <AlertDialog>
              <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete this sentence.</AlertDialogDescription></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => onDelete(topic.id, sentence)}>Delete</AlertDialogAction></AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <CollapsibleContent>
            <div className="ml-10 rounded-md border bg-muted/50 p-3 text-sm text-muted-foreground">
                <p><span className="font-semibold text-foreground">[VI]</span> {sentence.vietnamese}</p>
            </div>
        </CollapsibleContent>
      </li>
    </Collapsible>
  );
}
