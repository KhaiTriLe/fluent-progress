# **App Name**: Fluent Progress

## Core Features:

- **Practice Timer**: Start/stop/reset timer to track speaking practice duration with real-time display. Includes navigation guard to prevent accidental exits during active sessions.
- **Progress Tracking**: Record daily practice time, total practice time, current streak, longest streak, and total practice days. All data persisted in browser LocalStorage.
- **Sentence Template Library**: Categorized collection of English sentence templates with Vietnamese translations. Topics include Common Greetings, Ordering Food, and Daily Conversations (expandable).
- **Practice Sentence Selection**: Users can select/deselect sentences from the library for inclusion in practice sessions via checkbox interface.
- **Practice Counter**: Track how many times each sentence has been practiced. Increment count with single button click during practice sessions.
- **Data Import/Export**: Full backup/restore functionality - export all application data (topics, sentences, practice sessions, counters, selections) to JSON file and import back. Includes data validation and migration support.
- **Text-to-Speech (TTS)**: AI-powered pronunciation feature using Google's Gemini 2.5 Flash TTS model. Speaks selected sentences with natural English voice (Algenib). Audio responses are cached in memory for better performance.
- **Statistics Dashboard**: Visual summary cards showing current streak, longest streak, today's practice time, total practice time, and last session date.
- **Topic Management**: Create, edit, and delete topics. Add, edit, and delete sentences within topics.
- **Vietnamese Translations**: Each sentence includes Vietnamese translation for language learners, displayed in collapsible sections.

## Technical Architecture:

- **Framework**: Next.js 15 with App Router and TypeScript
- **UI Library**: ShadCN UI components with Tailwind CSS
- **State Management**: React Context API with custom hooks
- **Data Persistence**: Browser LocalStorage with migration system
- **AI Integration**: Genkit framework with Google AI (Gemini API)
- **Audio Format**: Base64-encoded WAV data URIs
- **Date Handling**: date-fns library for streak calculations
- **Form Validation**: react-hook-form + Zod schemas
- **Responsive Design**: Mobile-first with adaptive navigation (bottom nav on mobile, top nav on desktop)

## Pages:

1. **Dashboard** (`/`): Statistics overview with practice time cards and quick action buttons
2. **Practice** (`/practice`): Active practice session with timer, selected sentences, TTS playback, and practice counters
3. **Sentences** (`/sentences`): Full sentence library management with topic accordion, CRUD operations
4. **Settings** (`/settings`): Gemini API key configuration, data import/export functionality

## Data Model:

```typescript
interface Sentence {
  id: string;
  text: string;              // English sentence
  vietnamese: string;        // Vietnamese translation (migrated field)
  practiceCount: number;     // Usage counter
  selected: boolean;         // Practice selection state
}

interface Topic {
  id: string;
  name: string;
  sentences: Sentence[];
}

interface PracticeSession {
  id: string;
  startTime: number;         // Unix timestamp (milliseconds)
  endTime: number;
  duration: number;          // Milliseconds
}

interface AppData {
  topics: Topic[];
  sessions: PracticeSession[];
}
```

## Style Guidelines:

- **Primary Color**: HSL(210, 60%, 50%) = #3399CC - Professional, serene tone conducive to learning
- **Background Color**: HSL(210, 20%, 95%) = #F0F8FF - Calming, unobtrusive backdrop (light mode)
- **Accent Color**: HSL(180, 50%, 40%) = #339999 - Highlighting interactive elements
- **Typography**:
  - Body and Headline Font: 'PT Sans' (Humanist sans-serif, Google Fonts)
  - Code Font: monospace
- **Design Principles**:
  - Mobile-first responsive design
  - Clear, concise elements for easy navigation on smaller screens
  - Simple, clean Lucide React icons for actions and categories
  - Subtle transitions for UI feedback
  - Dark mode support with automatic theme switching
- **Component Library**: ShadCN UI for consistent, accessible components
- **Layout**:
  - Fixed top navigation on desktop (hidden on mobile)
  - Fixed bottom navigation on mobile (hidden on desktop)
  - Main content area with padding for comfortable reading
  - Card-based information architecture

## AI Features:

- **Text-to-Speech**:
  - Model: Gemini 2.5 Flash Preview TTS
  - Voice: Algenib (natural English voice)
  - Format: WAV audio encoded as base64 data URI
  - Caching: Audio responses stored in memory context to reduce API calls
  - Error Handling: User-friendly toast notifications for API key issues or network errors
  - Loading States: Spinner icons during audio generation
- **API Key Management**:
  - Stored securely in browser LocalStorage
  - Validation on save with test API call
  - User guidance to obtain free key from Google AI Studio

## User Experience Enhancements:

- **Toast Notifications**: Real-time feedback for all user actions (save, delete, import, export, errors)
- **Loading States**: Spinner indicators for async operations (TTS generation, API key validation)
- **Confirmation Dialogs**: AlertDialogs for destructive actions (delete topic, delete sentence, import data)
- **Navigation Guard**: Warning dialog when attempting to leave practice page with active timer
- **Collapsible Content**: Vietnamese translations hidden by default, expandable on click
- **Tooltips**: Helper text for disabled features (e.g., TTS without API key)
- **Skeletons**: Loading placeholders for statistics while data is being fetched

## Accessibility:

- Semantic HTML structure
- ARIA labels for icon buttons
- Keyboard navigation support
- Screen reader friendly
- High contrast color ratios
- Focus indicators on interactive elements

## Future Enhancement Ideas:

- Spaced repetition algorithm for sentence recommendations
- Audio recording and playback for self-review
- Progress charts and visualizations
- Social sharing of achievements
- Multi-language support beyond Vietnamese
- Cloud sync for cross-device usage
- Customizable TTS voice options
- Sentence difficulty levels
- Custom user-created topics and sentences