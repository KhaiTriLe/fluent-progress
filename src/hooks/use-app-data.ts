"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { initialData } from '@/lib/data';
import type { AppData, PracticeSession, Statistics, Topic, Sentence } from '@/lib/types';
import { isToday, isYesterday, differenceInCalendarDays } from 'date-fns';

const LOCAL_STORAGE_KEY = 'fluent-progress-data';

export const useAppData = () => {
  const [data, setData] = useState<AppData>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (item) {
        const parsedData = JSON.parse(item);
        // Basic validation
        if (parsedData.topics && parsedData.sessions) {
          setData(parsedData);
        }
      }
    } catch (error) {
      console.error('Failed to load data from localStorage', error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save data to localStorage', error);
      }
    }
  }, [data, isLoaded]);

  const addPracticeSession = useCallback((duration: number) => {
    const now = Date.now();
    const newSession: PracticeSession = {
      id: `session-${now}`,
      startTime: now - duration,
      endTime: now,
      duration,
    };
    setData((prevData) => ({
      ...prevData,
      sessions: [...prevData.sessions, newSession],
    }));
  }, []);
  
  const crudTopic = useCallback((action: 'add' | 'update' | 'delete', topic: Topic) => {
    setData(prev => {
        let newTopics: Topic[];
        if (action === 'add') {
            newTopics = [...prev.topics, topic];
        } else if (action === 'update') {
            newTopics = prev.topics.map(t => t.id === topic.id ? topic : t);
        } else { // delete
            newTopics = prev.topics.filter(t => t.id !== topic.id);
        }
        return { ...prev, topics: newTopics };
    });
  }, []);

  const crudSentence = useCallback((action: 'add' | 'update' | 'delete', topicId: string, sentence: Sentence) => {
    setData(prev => {
        const newTopics = prev.topics.map(topic => {
            if (topic.id === topicId) {
                let newSentences: Sentence[];
                if (action === 'add') {
                    newSentences = [...topic.sentences, sentence];
                } else if (action === 'update') {
                    newSentences = topic.sentences.map(s => s.id === sentence.id ? sentence : s);
                } else { // delete
                    newSentences = topic.sentences.filter(s => s.id !== sentence.id);
                }
                return { ...topic, sentences: newSentences };
            }
            return topic;
        });
        return { ...prev, topics: newTopics };
    });
  }, []);

  const toggleSentenceSelection = useCallback((topicId: string, sentenceId: string, selected: boolean) => {
    setData(prev => ({
      ...prev,
      topics: prev.topics.map(topic => 
        topic.id === topicId 
        ? {
            ...topic,
            sentences: topic.sentences.map(sentence => 
              sentence.id === sentenceId 
              ? { ...sentence, selected } 
              : sentence
            ),
          }
        : topic
      ),
    }));
  }, []);
  
  const incrementSentenceCount = useCallback((topicId: string, sentenceId: string) => {
    setData(prev => ({
        ...prev,
        topics: prev.topics.map(topic => 
            topic.id === topicId 
            ? {
                ...topic,
                sentences: topic.sentences.map(sentence => 
                    sentence.id === sentenceId
                    ? { ...sentence, practiceCount: sentence.practiceCount + 1 }
                    : sentence
                ),
              }
            : topic
        ),
    }));
  }, []);

  const importData = useCallback((importedData: AppData) => {
    // Add validation here if necessary
    setData(importedData);
  }, []);


  const statistics: Statistics = useMemo(() => {
    const { sessions } = data;
    const now = new Date();
    
    const timeToday = sessions
      .filter(s => isToday(new Date(s.endTime)))
      .reduce((sum, s) => sum + s.duration, 0);

    const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);

    const practiceDays = Array.from(new Set(sessions.map(s => new Date(s.endTime).toDateString()))).map(dateStr => new Date(dateStr)).sort((a,b) => b.getTime() - a.getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let streak = 0;

    if (practiceDays.length > 0) {
        if (isToday(practiceDays[0]) || isYesterday(practiceDays[0])) {
            streak = 1;
            for (let i = 0; i < practiceDays.length - 1; i++) {
                const diff = differenceInCalendarDays(practiceDays[i], practiceDays[i+1]);
                if (diff === 1) {
                    streak++;
                } else {
                    break;
                }
            }
        }
        currentStreak = streak;

        // Calculate longest streak
        if (practiceDays.length > 0) {
            longestStreak = 1;
            let currentLongest = 1;
            for (let i = 0; i < practiceDays.length - 1; i++) {
                const diff = differenceInCalendarDays(practiceDays[i], practiceDays[i+1]);
                if (diff === 1) {
                    currentLongest++;
                } else {
                    currentLongest = 1;
                }
                if (currentLongest > longestStreak) {
                    longestStreak = currentLongest;
                }
            }
        }
    }


    const lastSessionDate = sessions.length > 0 ? Math.max(...sessions.map(s => s.endTime)) : null;

    return {
      currentStreak,
      longestStreak,
      timeToday,
      totalTime,
      totalPracticeDays: practiceDays.length,
      lastSessionDate,
    };
  }, [data]);

  return {
    ...data,
    isLoaded,
    addPracticeSession,
    crudTopic,
    crudSentence,
    toggleSentenceSelection,
    incrementSentenceCount,
    importData,
    statistics,
    getAppData: () => data,
  };
};
