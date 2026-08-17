# React Bridge

**From Ruby instincts to React confidence.**

React Bridge is a practical, adaptive React + TypeScript course built for a Ruby developer joining a production payments and invoices codebase. It works in two ways:

- **Course:** a guided repo-readiness path with explanations, Ruby comparisons, examples, quizzes, feedback and persistent progress.
- **Reference:** a searchable field guide for the moment you meet a hook or architectural pattern at work.

## What is covered

The curriculum follows the target repository rather than a generic tutorial:

1. Ruby → JavaScript and TypeScript
2. Components, props, rendering and state
3. `useEffect`, `useRef`, `useCallback`, `useMemo` and `useLayoutEffect`
4. React Router and URL-backed filter state
5. React Hook Form, `Controller`, schema validation and field arrays
6. React Query queries, keys, dependent queries and mutations
7. Context, custom hooks, services, DTOs, analytics and async rendering
8. Behaviour-focused tests and a production-change capstone

## Product features

- 28 complete concept lessons across eight modules
- Ruby-to-TypeScript code comparisons
- A learn → watch → do rhythm with official documentation and curated video sources
- Persistent in-lesson code scratchpads and browser workbench links
- Instant quiz feedback with explanations
- “I’m lost / about right / too easy” course adaptation
- Individual and module-level completion controls
- Device-persistent progress using local storage
- Fast-track and deep-dive learning modes
- Full-text reference search and topic filters
- Responsive, keyboard-friendly interface
- Automated render and curriculum checks

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Then open the local URL shown in the terminal.

## Validate

```bash
npm test
npm run lint
```

The `main` branch deploys automatically to GitHub Pages.

## How progress works

Progress, quiz answers, code scratchpads, learning pace and confidence feedback are saved only in the browser on the current device. No account or backend is required. Use **Reset progress** in the sidebar to start again.

## Built with

React 19, TypeScript, Next-compatible app routing through vinext, Vite and CSS. The site exports to static HTML for GitHub Pages.
