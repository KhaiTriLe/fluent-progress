import type { AppData } from './types';

export const initialData: AppData = {
  topics: [
    {
      id: 'topic-1',
      name: 'Common Greetings',
      sentences: [
        { id: 'sent-1-1', text: "How's it going?", practiceCount: 0, selected: false },
        { id: 'sent-1-2', text: "What have you been up to?", practiceCount: 0, selected: false },
        { id: 'sent-1-3', text: "It's a pleasure to meet you.", practiceCount: 0, selected: false },
      ],
    },
    {
      id: 'topic-2',
      name: 'Ordering Food',
      sentences: [
        { id: 'sent-2-1', text: "I'd like to have the chicken salad, please.", practiceCount: 0, selected: false },
        { id: 'sent-2-2', text: "Could we get the check, please?", practiceCount: 0, selected: false },
        { id: 'sent-2-3', text: "Do you have any vegetarian options?", practiceCount: 0, selected: false },
      ],
    },
    {
        id: 'topic-3',
        name: 'Daily Conversations',
        sentences: [
          { id: 'sent-3-1', text: "I'm not sure I follow you.", practiceCount: 0, selected: false },
          { id: 'sent-3-2', text: "Could you please repeat that?", practiceCount: 0, selected: false },
          { id: 'sent-3-3', text: "On second thought, I think I'll pass.", practiceCount: 0, selected: false },
        ],
      },
  ],
  sessions: [],
};
