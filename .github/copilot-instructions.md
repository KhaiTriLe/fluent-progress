# Fluent Progress - AI Agent Instructions

## Project Overview
Next.js 15 (App Router) + TypeScript English learning app. Users practice speaking with sentence libraries, timers, progress tracking, and AI-powered TTS using Genkit + Gemini API. All data persists in browser LocalStorage.

## Architecture Patterns

### State & Data Flow
- **Single source of truth**: [`useAppData`](../src/hooks/use-app-data.ts) hook manages all state (topics, sentences, sessions, API key, audio cache)
- **Global access**: [`AppContext`](../src/components/app-provider.tsx) provides state to entire app via React Context
- **Persistence**: Auto-saves to LocalStorage on every state change (keys: `fluent-progress-data`, `fluent-progress-gemini-api-key`)
- **Migration system**: `runMigration()` in `use-app-data.ts` handles schema updates when adding fields to data model

### Data Model
```typescript
interface Sentence {
  id: string;
  text: string;              // English sentence
  vietnamese: string;        // Vietnamese translation (added via migration)
  practiceCount: number;     // Incremented each practice
  selected: boolean;         // For practice session inclusion
}
```
See [`src/lib/types.ts`](../src/lib/types.ts) for Topic, PracticeSession, AppData, and Statistics interfaces.

### CRUD Pattern
All data mutations go through `useAppData` hook methods:
- `crudTopic(action, topic)` - add/update/delete topics
- `crudSentence(action, topicId, sentence)` - add/update/delete sentences within topics
- `toggleSentenceSelection(topicId, sentenceId, selected)` - toggle practice checkbox
- `incrementSentenceCount(topicId, sentenceId)` - increment practice counter
- `addPracticeSession(duration)` - save completed session with timestamps

When adding new fields to data models, ALWAYS add migration logic in `runMigration()` with default values.

## Component Patterns

### UI Components
- **All from ShadCN UI**: Located in [`src/components/ui/`](../src/components/ui/) - don't modify, regenerate if needed
- **Client components**: Use `"use client"` directive for interactivity
- **Styling**: Tailwind classes + `cn()` utility from [`src/lib/utils.ts`](../src/lib/utils.ts) for conditional classes

### Forms
Standard pattern using react-hook-form + Zod (see [`sentence-form.tsx`](../src/components/sentence-form.tsx)):
```typescript
const formSchema = z.object({
  text: z.string().min(1, "Required"),
  vietnamese: z.string().min(1, "Required"),
});

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: { text: "", vietnamese: "" },
});
```

### Responsive Navigation
- Mobile: [`bottom-nav.tsx`](../src/components/bottom-nav.tsx) - fixed bottom, visible on `md:hidden`
- Desktop: [`desktop-nav.tsx`](../src/components/desktop-nav.tsx) - fixed top, visible on `hidden md:block`
- Both share same `navItems` array structure with Lucide icons

## AI/Genkit Integration

### TTS Flow Pattern
Server action in [`src/ai/flows/tts-flow.ts`](../src/ai/flows/tts-flow.ts):
- Model: `gemini-2.5-flash-preview-tts` with Algenib voice
- Input: `{ text: string, apiKey: string }`
- Output: `{ audioDataUri: string }` - base64-encoded WAV data URI
- **Audio caching**: Store responses in `audioCache` (in-memory context state) using sentence ID as key

### Genkit Configuration
- Main config: [`src/ai/genkit.ts`](../src/ai/genkit.ts) - exports `ai` instance
- Dev imports: [`src/ai/dev.ts`](../src/ai/dev.ts) - import all flows here for Genkit Dev UI
- Flow pattern: Use `ai.defineFlow()` with Zod schemas for input/output validation

## Development Workflows

### Running the App
```bash
npm run dev              # Next.js dev server on http://localhost:9002 (--turbopack enabled)
npm run genkit:dev       # Genkit Dev UI for testing AI flows
npm run genkit:watch     # Auto-reload Genkit flows during development
```

### Adding a New Page
1. Create `src/app/[page-name]/page.tsx`
2. Add nav item to both `desktop-nav.tsx` and `bottom-nav.tsx`
3. Import icon from `lucide-react`
4. Add to `navItems` array: `{ icon: IconName, label: "Label", href: "/path" }`

### Modifying Data Model
1. Update types in [`src/lib/types.ts`](../src/lib/types.ts)
2. Add migration in `runMigration()` at top of [`use-app-data.ts`](../src/hooks/use-app-data.ts):
   ```typescript
   if (typeof (sentence as any).newField === 'undefined') {
     needsUpdate = true;
     return { ...sentence, newField: 'default-value' };
   }
   ```
3. Update CRUD methods in `useAppData` hook
4. Update components consuming the data

### Testing AI Features
```bash
npm run genkit:dev
```
Open Genkit UI, test `textToSpeech` flow with input: `{ "text": "Hello", "apiKey": "your-key" }`

## Key Files Reference

### Entry Points
- [`src/app/layout.tsx`](../src/app/layout.tsx) - Root layout with AppProvider, navigation, toast
- [`src/components/app-provider.tsx`](../src/components/app-provider.tsx) - Context provider wrapping useAppData hook
- [`src/hooks/use-app-data.ts`](../src/hooks/use-app-data.ts) - **Central state management** (251 lines)

### Feature Components
- [`practice-timer.tsx`](../src/components/practice-timer.tsx) - Start/stop/reset timer with navigation guard
- [`sentence-library.tsx`](../src/components/sentence-library.tsx) - Accordion UI for topics/sentences
- [`sentence-form.tsx`](../src/components/sentence-form.tsx) - Add/edit sentences with Zod validation
- [`sentence-item.tsx`](../src/components/sentence-item.tsx) - Individual sentence with TTS, counter, selection

### Configuration
- [`next.config.ts`](../next.config.ts) - **Note**: TypeScript & ESLint errors ignored during builds
- [`components.json`](../components.json) - ShadCN UI config (cn utility, components path)
- [`tailwind.config.ts`](../tailwind.config.ts) - Custom colors defined (primary: HSL 210 60% 50%)

## Common Patterns & Gotchas

### Statistics Calculation
Implemented in `useAppData.statistics` (memoized):
- **Current Streak**: Consecutive calendar days with sessions (uses `isToday`/`isYesterday` from date-fns)
- **Longest Streak**: Max consecutive days achieved
- Streaks reset if user misses a day (not 24-hour periods)

### Navigation Guard
Practice page uses [`useNavigationGuard`](../src/hooks/use-navigation-guard.ts) to warn users before navigating away during active timer.

### Build Configuration
TypeScript/ESLint errors currently ignored (`ignoreBuildErrors: true`, `ignoreDuringBuilds: true`) - prioritize functionality over strict types during development.

### PWA Support
- Service worker: [`public/sw.js`](../public/sw.js) - currently open in editor
- Manifest: [`public/manifest.json`](../public/manifest.json)
- Registration: [`pwa-register.tsx`](../src/components/pwa-register.tsx) component in layout

## Color Scheme (HSL)
See [`src/app/globals.css`](../src/app/globals.css):
- Primary: `210 60% 50%` (#3399CC - brand blue)
- Background (light): `210 20% 95%` (#F0F8FF - soft blue-gray)
- Accent: `180 50% 40%` (#339999 - teal)
- Custom font: PT Sans (Google Fonts) - loaded in layout.tsx

## When Making Changes
- **Add data fields**: Include migration + default value
- **UI components**: Use ShadCN components from `ui/` folder
- **State updates**: Always use methods from `useAppData` hook (never mutate context directly)
- **Toast notifications**: Use `useToast()` hook from [`use-toast.ts`](../src/hooks/use-toast.ts)
- **Icons**: Import from `lucide-react`
- **Forms**: Zod schema + react-hook-form + zodResolver pattern
