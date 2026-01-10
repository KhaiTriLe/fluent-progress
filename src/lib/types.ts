export interface Sentence {
  id: string;
  text: string;
  practiceCount: number;
  selected: boolean;
}

export interface Topic {
  id: string;
  name: string;
  sentences: Sentence[];
}

export interface PracticeSession {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
}

export interface AppData {
  topics: Topic[];
  sessions: PracticeSession[];
}

export interface Statistics {
    currentStreak: number;
    longestStreak: number;
    totalTime: number;
    timeToday: number;
    totalPracticeDays: number;
    lastSessionDate: number | null;
}
