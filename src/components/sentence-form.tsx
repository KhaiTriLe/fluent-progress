"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Topic, Sentence } from "@/lib/types";

interface SentenceFormProps {
  topic: Topic | null;
  sentence: Sentence | null;
  isAddingSentenceToTopic: boolean;
  onClose: () => void;
  crudTopic: (action: 'add' | 'update', topic: Topic) => void;
  crudSentence: (action: 'add' | 'update', topicId: string, sentence: Sentence) => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Topic name is required.").optional(),
  text: z.string().min(1, "Sentence text is required.").optional(),
  vietnamese: z.string().min(1, "Vietnamese meaning is required.").optional(),
});

export default function SentenceForm({ topic, sentence, isAddingSentenceToTopic, onClose, crudTopic, crudSentence }: SentenceFormProps) {
  const isEditingTopic = topic && !sentence && !isAddingSentenceToTopic;
  const isEditingSentence = topic && sentence;
  const isAddingSentence = topic && isAddingSentenceToTopic;
  const isAddingTopic = !topic && !sentence;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: isEditingTopic ? topic.name : "",
      text: isEditingSentence ? sentence.text : "",
      vietnamese: isEditingSentence ? sentence.vietnamese : "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (isAddingTopic && values.name) {
      const newTopic: Topic = {
        id: `topic-${Date.now()}`,
        name: values.name,
        sentences: [],
      };
      crudTopic('add', newTopic);
    } else if (isEditingTopic && values.name) {
      crudTopic('update', { ...topic, name: values.name });
    } else if (isAddingSentence && values.text && values.vietnamese && topic) {
      const newSentence: Sentence = {
        id: `sent-${Date.now()}`,
        text: values.text,
        vietnamese: values.vietnamese,
        practiceCount: 0,
        selected: false,
      };
      crudSentence('add', topic.id, newSentence);
    } else if (isEditingSentence && values.text && values.vietnamese && topic && sentence) {
      crudSentence('update', topic.id, { ...sentence, text: values.text, vietnamese: values.vietnamese });
    }
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {(isAddingTopic || isEditingTopic) && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Business Meetings" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {(isAddingSentence || isEditingSentence) && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sentence (English)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Let's circle back on this next week." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="vietnamese"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vietnamese Meaning</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Hãy thảo luận lại về vấn đề này vào tuần tới." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
