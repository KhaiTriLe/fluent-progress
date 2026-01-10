# Fluent Progress - Developer Instructions

## Project Overview

**Fluent Progress** is a Next.js-based web application designed to help users practice and track their English speaking skills. The app features sentence libraries, practice timers, progress tracking, and AI-powered text-to-speech functionality using Google's Gemini API.

## Tech Stack

- **Framework**: Next.js 15.1.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + ShadCN UI components
- **AI**: Genkit with Google AI (Gemini 2.5 Flash)
- **State Management**: React Context API + Custom Hooks
- **Data Persistence**: Browser LocalStorage
- **Development Environment**: Dev Container (Ubuntu 24.04.3 LTS)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Dashboard (home page)
│   ├── practice/          # Practice session page
│   ├── sentences/         # Sentence library management
│   ├── settings/          # Settings and data management
│   ├── layout.tsx         # Root layout with navigation
│   └── globals.css        # Global styles and CSS variables
├── components/            # React components
│   ├── ui/               # ShadCN UI components
│   ├── app-provider.tsx  # Global context provider
│   ├── sentence-*.tsx    # Sentence-related components
│   ├── practice-timer.tsx # Timer component
│   ├── stat-card.tsx     # Statistics display
│   ├── bottom-nav.tsx    # Mobile navigation
│   └── desktop-nav.tsx   # Desktop navigation
├── hooks/                # Custom React hooks
│   ├── use-app-data.ts   # Main data management hook
│   ├── use-toast.ts      # Toast notifications
│   └── use-navigation-guard.ts # Navigation protection
├── ai/                   # AI/Genkit integration
│   ├── genkit.ts         # Genkit configuration
│   ├── dev.ts            # Development imports
│   └── flows/
│       └── tts-flow.ts   # Text-to-speech flow
└── lib/                  # Utilities and types
    ├── types.ts          # TypeScript interfaces
    ├── data.ts           # Initial/sample data
    └── utils.ts          # Utility functions
```

## Key Architecture Patterns

### 1. Data Management
- **Storage**: LocalStorage with keys:
  - `fluent-progress-data`: Main app data (topics, sentences, sessions)
  - `fluent-progress-gemini-api-key`: Gemini API key
- **Hook**: [`useAppData`](src/hooks/use-app-data.ts) manages all state and persistence
- **Context**: [`AppContext`](src/components/app-provider.tsx) provides global access
- **Migration**: Built-in migration system for schema updates (see [`runMigration`](src/hooks/use-app-data.ts))

### 2. Data Model
```typescript
interface Sentence {
  id: string;
  text: string;              // English sentence
  vietnamese: string;        // Vietnamese translation
  practiceCount: number;     // How many times practiced
  selected: boolean;         // Selected for practice
}

interface Topic {
  id: string;
  name: string;
  sentences: Sentence[];
}

interface PracticeSession {
  id: string;
  startTime: number;         // Unix timestamp
  endTime: number;           // Unix timestamp
  duration: number;          // Milliseconds
}

interface AppData {
  topics: Topic[];
  sessions: PracticeSession[];
}
```

### 3. Component Patterns
- All UI components are from ShadCN UI (in [`src/components/ui/`](src/components/ui/))
- Client components use `"use client"` directive
- Form handling with `react-hook-form` + `zod` validation
- Toast notifications via [`useToast`](src/hooks/use-toast.ts) hook

### 4. AI Integration
- **TTS Flow**: [`textToSpeech`](src/ai/flows/tts-flow.ts) function
- **Caching**: Audio responses cached in memory (Context state)
- **Model**: Uses `gemini-2.5-flash-preview-tts` with Algenib voice
- **Format**: Returns base64-encoded WAV data URI

## Common Development Tasks

### Adding a New Page
1. Create file in `src/app/[page-name]/page.tsx`
2. Add navigation link in [`desktop-nav.tsx`](src/components/desktop-nav.tsx) and [`bottom-nav.tsx`](src/components/bottom-nav.tsx)
3. Update navItems array with icon, label, and href

### Adding a New Feature to Data Model
1. Update types in [`src/lib/types.ts`](src/lib/types.ts)
2. Add migration logic in [`runMigration`](src/hooks/use-app-data.ts)
3. Update CRUD operations in [`useAppData`](src/hooks/use-app-data.ts)
4. Update components to use new fields

### Working with Forms
```typescript
// Example pattern used in SentenceForm
const formSchema = z.object({
  field: z.string().min(1, "Error message"),
});

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: { field: "" },
});

function onSubmit(values: z.infer<typeof formSchema>) {
  // Handle submission
}
```

### Adding a New Genkit Flow
1. Create flow in `src/ai/flows/[flow-name].ts`
2. Import in [`src/ai/dev.ts`](src/ai/dev.ts) for development
3. Define input/output schemas with Zod
4. Use `ai.defineFlow()` pattern

## Environment Setup

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
# Runs on http://localhost:9002
```

### Using Genkit Dev UI
```bash
npm run genkit:dev
# Opens Genkit developer UI for testing AI flows
```

## API Key Configuration

The app requires a **Gemini API Key** for text-to-speech features:

1. Get free API key from [Google AI Studio](https://aistudio.google.com/app/api-keys)
2. Navigate to Settings page in the app
3. Paste API key and click "Save"
4. Key is stored in LocalStorage and validated on save

## Color Scheme (HSL Values)

```css
/* Light Mode */
--primary: 210 60% 50%        /* #3399CC - Main brand color */
--background: 210 20% 95%     /* #F0F8FF - Page background */
--accent: 180 50% 40%         /* #339999 - Interactive elements */
--foreground: 0 0% 3.9%       /* Dark text */

/* Dark Mode */
--primary: 210 60% 50%
--background: 0 0% 3.9%
--foreground: 0 0% 98%
```

See [`src/app/globals.css`](src/app/globals.css) for complete theme definitions.

## Useful Commands

```bash
# Development
npm run dev                 # Start dev server (port 9002)
npm run build              # Production build
npm run start              # Start production server

# AI/Genkit
npm run genkit:dev         # Genkit developer UI

# Code Quality
npm run lint               # Run ESLint (currently disabled during builds)

# Browser Tools
"$BROWSER" <url>           # Open URL in host's default browser
```

## Important Files Reference

### Core Configuration
- [`next.config.ts`](next.config.ts) - Next.js configuration
- [`tailwind.config.ts`](tailwind.config.ts) - Tailwind CSS configuration
- [`tsconfig.json`](tsconfig.json) - TypeScript configuration
- [`components.json`](components.json) - ShadCN UI configuration

### Entry Points
- [`src/app/layout.tsx`](src/app/layout.tsx) - Root layout with providers
- [`src/components/app-provider.tsx`](src/components/app-provider.tsx) - Global state provider
- [`src/hooks/use-app-data.ts`](src/hooks/use-app-data.ts) - Main data hook

### Key Features
- **Practice Timer**: [`src/components/practice-timer.tsx`](src/components/practice-timer.tsx)
- **Sentence Library**: [`src/components/sentence-library.tsx`](src/components/sentence-library.tsx)
- **Statistics Calculation**: [`useAppData.statistics`](src/hooks/use-app-data.ts) (lines 168-227)
- **TTS Integration**: [`src/ai/flows/tts-flow.ts`](src/ai/flows/tts-flow.ts)

## LocalStorage Data Structure

```json
{
  "topics": [
    {
      "id": "topic-1",
      "name": "Common Greetings",
      "sentences": [
        {
          "id": "sent-1-1",
          "text": "How's it going?",
          "vietnamese": "Dạo này sao rồi?",
          "practiceCount": 5,
          "selected": true
        }
      ]
    }
  ],
  "sessions": [
    {
      "id": "session-123",
      "startTime": 1704067200000,
      "endTime": 1704070800000,
      "duration": 3600000
    }
  ]
}
```

## Statistics Calculation Logic

The app calculates several statistics (see [`useAppData.statistics`](src/hooks/use-app-data.ts)):

1. **Current Streak**: Consecutive days with practice sessions (resets if missed a day)
2. **Longest Streak**: Highest consecutive days achieved
3. **Time Today**: Total practice duration for current day
4. **Total Time**: Sum of all session durations
5. **Total Practice Days**: Count of unique days with sessions
6. **Last Session Date**: Timestamp of most recent session

## Navigation Guard

The practice page uses [`useNavigationGuard`](src/hooks/use-navigation-guard.ts) to warn users before leaving during an active timer session.

## Common Gotchas

1. **TypeScript Build Errors**: Currently ignored via `next.config.ts` (`ignoreBuildErrors: true`)
2. **Audio Caching**: Audio data URIs are stored in memory context, not persisted
3. **Streak Calculation**: Uses calendar days, not 24-hour periods
4. **Migration System**: When adding fields to data model, always add migration logic
5. **ShadCN Components**: Located in `src/components/ui/` - don't modify directly, regenerate if needed

## Testing AI Features Locally

```bash
# Start Genkit dev UI
npm run genkit:dev

# Test TTS flow directly in Genkit UI:
# Input: { "text": "Hello world", "apiKey": "your-api-key" }
# Output: { "audioDataUri": "data:audio/wav;base64,..." }
```

## Mobile vs Desktop Differences

- **Mobile**: Bottom navigation ([`bottom-nav.tsx`](src/components/bottom-nav.tsx)), shows on `md:hidden`
- **Desktop**: Top navigation ([`desktop-nav.tsx`](src/components/desktop-nav.tsx)), shows on `hidden md:block`
- Both use the same navItems array structure
- Layout adapts via Tailwind responsive classes

## When Asking for Help

Include:
1. **Page/component** you're working on
2. **Feature area**: Timer, Library, Stats, Settings, or AI
3. **Data model changes**: If adding/modifying Sentence/Topic/Session
4. **Related files**: Links to relevant components or hooks
5. **Error messages**: Full TypeScript/runtime errors

## Quick Reference Links

- [Next.js Docs](https://nextjs.org/docs)
- [ShadCN UI Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Genkit Documentation](https://firebase.google.com/docs/genkit)
- [Google AI Studio](https://aistudio.google.com/)