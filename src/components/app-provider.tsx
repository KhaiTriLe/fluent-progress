"use client";

import { createContext } from 'react';
import { useAppData } from '@/hooks/use-app-data';
import type { AppData, Topic, Sentence, Statistics } from '@/lib/types';

type AppContextType = {
  topics: Topic[];
  isLoaded: boolean;
  addPracticeSession: (duration: number) => void;
  crudTopic: (action: 'add' | 'update' | 'delete', topic: Topic) => void;
  crudSentence: (action: 'add' | 'update' | 'delete', topicId: string, sentence: Sentence) => void;
  toggleSentenceSelection: (topicId: string, sentenceId: string, selected: boolean) => void;
  incrementSentenceCount: (topicId: string, sentenceId: string) => void;
  importData: (data: AppData) => void;
  statistics: Statistics;
  getAppData: () => AppData;
};

export const AppContext = createContext<AppContextType>({
  topics: [],
  isLoaded: false,
  addPracticeSession: () => {},
  crudTopic: () => {},
  crudSentence: () => {},
  toggleSentenceSelection: () => {},
  incrementSentenceCount: () => {},
  importData: () => {},
  statistics: {
    currentStreak: 0,
    longestStreak: 0,
    timeToday: 0,
    totalTime: 0,
    totalPracticeDays: 0,
    lastSessionDate: null,
  },
  getAppData: () => ({ topics: [], sessions: [] }),
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const appData = useAppData();

  return (
    <AppContext.Provider value={appData}>{children}</AppContext.Provider>
  );
}
