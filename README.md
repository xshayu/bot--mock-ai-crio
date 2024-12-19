# Bot AI - Crio Frontend Assignment
Bot AI assignment of crio. [Here's the assignment instructions link.](https://docs.google.com/document/d/1SYWc8WwSVPA31NGRmG-Cng5V4GOTBZU565Z5EOivTIE/edit?usp=sharing)

Done by Ayush Wardhan. In case this interests you, check out my actual github [here](https://github.com/xylarshayu). Thanks.

## Getting Started

First, navigate to the Next.js project folder, and install dependencies.
```bash
cd bot-mock-ai-crio
pnpm i
```

Then, run the development server
```bash
npm run dev
```

## Choices made

This project was done in roughly less than 12 hours spread over the course of a day or two, and is limited accordingly.
Some obvious limits are the usage of a mock-up of an LLM rather than an actual one. If I had to build a genuine chat app, I would use something like Groq's API due to its speed, cost effectiveness, and (claimed) environmental friendliness.

### Technical choices made

#### Frameworks & Libraries

* Used Next.js for the project.
    - Assignment requirements were to use React, so went with the most popular meta framework for it.
    - This is due to wealth of documentation, industry relevance and transferrable familiarty (have worked with Nuxt.js, which is similar).
* Typescript for type safety.
    - Also used due to it being industry standard, and was keen on gaining more experience with it
* Used TailwindCSS for utility-first styling.
    - This allowed me to develop the application in the short timeframe.
* Zustand for state management.
    - Popular state management library for React, works well with Next.js.
* Lucide React for consistent, good looking iconography.
* Shadcn/ui for pre-built highly accessible primitive components.

#### Performance Optimizations

* Component memoization where applicable, to prevent unnecessary re-renders.
    - As this is a highly interactive app, this was necessary
    - Not all re-rendered components could be memoized, so their LOCs were (eg. MessageBubble in the chat page)
* Code splitting through dynamic imports.
    - Handled by Next.js itself

### Design choices made

#### Architecture

* Pages in the application are homepage for "New chat", a history page, and a page for individual chats.
    - Pages for "New chat" and individual chats were kept seperate based on how it works for ChatGPT.
    - Also for convenience/seperation-of-concerns as the "New chat" page primarily served to provide random prompt options or take a novel prompt. Didn't need to be 'client rendered', at least not its skeleton, as the main interactivity would lead to page navigation anyway.
* For individual chats page, the folder `@/app/chat` consists of `page.tsx` but also `messageBubble.tsx` and `ratingDialog.tsx`.
    - This is to avoid cluttering the `page.tsx`.
    - Weren't put in `@/components/` as they're not reusable components
* Constants and types all stored in a single `@/components/models.ts` file.
    - Single source of truth of shape of data.
    - Single source of truth for constants like page length (for history), and format of date-time in various places.
* All logic regarding the data of conversations has been consolidated to a single Conversations store and related hook
    - Easy maintainability, single source of truth for how conversations are stored, filtered, updated, fetched.
    - Hook was created as calling zustand store getters directly in the components caused infinite rerenders.
* Functional programming used to avoid boilerplate, easy iteration, modern industry standard as well
* Sidebar based navigation for user convenience.
    - Links to previous chats are present there for easy revisiting.
    - Dark mode toggle and link to history is also present there for easy, seamless access.
    - It's automatically minimized on mobile devices, and becomes an overlay when triggered to avoid complex UI shifting.
* Single layout used for all pages containing the sidebar and header navigation.
* Single component for ChatForm used in both "New Chat" page and individual chats page.
* Various small and large choices across the app to enable good UI/UX/performance/maintainability/testability

## Things left out

1. Individual chats page can be a dynamic page rather than using search params to find id.
2. Could show text-streaming effect when model responds.
3. Test suite to ensure app's functionality doesn't break upon iteration.
4. Clearer loading indicator when navigating between pages.