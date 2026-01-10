import type { AppData } from './types';

export const initialData: AppData = {
  topics: [
    {
      id: 'topic-1',
      name: 'Common Greetings',
      sentences: [
        { id: 'sent-1-1', text: "How's it going?", vietnamese: "Dạo này sao rồi?", practiceCount: 0, selected: false },
        { id: 'sent-1-2', text: "What have you been up to?", vietnamese: "Dạo này bạn làm gì?", practiceCount: 0, selected: false },
        { id: 'sent-1-3', text: "It's a pleasure to meet you.", vietnamese: "Rất vui được gặp bạn.", practiceCount: 0, selected: false },
      ],
    },
    {
      id: 'topic-2',
      name: 'Ordering Food',
      sentences: [
        { id: 'sent-2-1', text: "I'd like to have the chicken salad, please.", vietnamese: "Làm ơn cho tôi salad gà.", practiceCount: 0, selected: false },
        { id: 'sent-2-2', text: "Could we get the check, please?", vietnamese: "Làm ơn cho chúng tôi hóa đơn được không?", practiceCount: 0, selected: false },
        { id: 'sent-2-3', text: "Do you have any vegetarian options?", vietnamese: "Bạn có lựa chọn nào cho người ăn chay không?", practiceCount: 0, selected: false },
      ],
    },
    {
        id: 'topic-3',
        name: 'Daily Conversations',
        sentences: [
          { id: 'sent-3-1', text: "I'm not sure I follow you.", vietnamese: "Tôi không chắc là tôi hiểu ý bạn.", practiceCount: 0, selected: false },
          { id: 'sent-3-2', text: "Could you please repeat that?", vietnamese: "Bạn có thể vui lòng lặp lại điều đó được không?", practiceCount: 0, selected: false },
          { id: 'sent-3-3', text: "On second thought, I think I'll pass.", vietnamese: "Suy nghĩ lại thì, tôi nghĩ tôi sẽ bỏ qua.", practiceCount: 0, selected: false },
        ],
      },
  ],
  sessions: [],
};
