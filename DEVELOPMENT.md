# React Expose Development Guide

This document outlines the development process, architecture, and roadmap for **React Expose** - a library providing macOS Mission Control and Exposé-like experiences for web applications.

## 🏗️ Modern Stack Overview

### Build & Development Tools
- **Turborepo**: Task orchestration with intelligent caching
- **pnpm workspaces**: Efficient monorepo dependency management
- **tsdown**: Modern, fast TypeScript bundler (Rolldown-based)
- **Vite**: Lightning-fast playground development
- **Biome**: Fast, unified linting and formatting
- **TypeScript 5.3+**: Type safety and modern features

## 📁 Monorepo Structure

```
react-expose/
├── packages/
│   └── react-expose/              # Core library package
│       ├── src/
│       │   ├── components/        # React components
│       │   │   ├── ExposeWrapper.tsx
│       │   │   ├── ExposeTrigger.tsx
│       │   │   └── styles.css
│       │   ├── context/           # State management
│       │   │   └── ExposeContext.tsx
│       │   ├── hooks/             # Custom React hooks
│       │   ├── utils/             # Utility functions
│       │   ├── types.ts           # TypeScript definitions
│       │   └── index.ts           # Main entry point
│       ├── tsdown.config.ts       # Bundler configuration
│       └── package.json
├── apps/
│   └── playground/                # Demo application
│       ├── src/
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── vite.config.ts
│       └── package.json
├── turbo.json                     # Turborepo configuration
├── biome.json                     # Linting/formatting rules
├── pnpm-workspace.yaml            # Workspace configuration
└── package.json                   # Root package scripts
```

## 🚀 Development Workflow

### Initial Setup

```bash
# Install pnpm globally (if not already installed)
npm install -g pnpm

# Clone and install dependencies
git clone <repository>
cd react-expose
pnpm install
```

### Daily Development

```bash
# Start everything in watch mode
pnpm dev

# Or run specific packages
pnpm dev:lib        # Library only
pnpm dev:playground # Playground only

# Run builds (with caching)
pnpm build

# Lint and format
pnpm lint:fix      # Auto-fix issues
pnpm format        # Format code
```

### Testing & Quality

```bash
# Type checking
pnpm typecheck

# Run tests (when implemented)
pnpm test

# Check bundle size
cd packages/react-expose && pnpm build
# Check dist/ folder for sizes
```

## 🎯 MVP scope (what ships now)

- Activation: `ArrowUp` double-tap and `mod+E` to toggle Exposé.
- Backdrop: tasteful scrim with optional blur (`blurAmount`), reduced-motion friendly.
- ExposeWrapper: transform-based grid layout, border/label overlay, click to select → close + scroll + highlight pulse.
- Accessibility: backdrop `role="dialog"` + `aria-modal`, focus trap, Arrow/Home/End navigation, Enter selects, Esc closes, visible focus ring.
- Search MVP: simple input on backdrop filtering wrappers by `label`.
- Playground demo + README showing minimal integration.

## 🚫 Non-goals for MVP

- No DOM cloning/portals or cross-hierarchy reparenting.
- No Framer Motion or spring physics.
- No grouping, custom layouts, or masonry.
- No fuzzy search/tags, analytics, DevTools, or theming system.
- No advanced tests beyond lint/typecheck and manual QA in playground.

## 🎨 UX/UI polish checklist

- Smooth 160–240ms transforms; consistent easing.
- Balanced grid spacing; stable z-index; neat labels and hover states.
- Backdrop blur degrades to opacity when unsupported or reduced motion.
- Keyboard-first usable; focus restored on close.
- Works on Safari/Chromium/Firefox at typical grid sizes.

## 📅 Next-week plan (3h/day, ~21h total)

Goal: Ship an MVP using the current animation system (CSS transforms + existing JS layout), with polished UX/UI and accessibility. No complex reparenting/portals, no Framer Motion.

| Day | Focus | Tasks | Deliverable |
| --- | --- | --- | --- |
| Day 1 (3h) | Keyboard + activation | Unify shortcut handling in `ExposeProvider`; support `mod+E` and ArrowUp+ArrowUp; update playground/docs; keep `ExposeTrigger` as optional sugar only | Reliable activation across browsers; single source of truth |
| Day 2 (3h) | Backdrop look & feel | Apply `blurAmount` via CSS var + `backdrop-filter` (with `-webkit-` fallback); refine scrim color/opacity; honor `prefers-reduced-motion` (reduced blur/durations) | Tunable, tasteful backdrop that degrades gracefully |
| Day 3 (3h) | Grid tuning (current algo) | Tweak padding/spacing, column/row calc, and scale caps; smooth transitions; stable DOM-order; consistent z-index; polish tile hover/labels | Balanced layout with crisp timing and no jitter |
| Day 4 (3h) | A11y shell | Backdrop gets `role="dialog"` + `aria-modal`; focus trap while active; restore focus on close; wrappers expose `aria-label` from `label` prop | Accessible modal-like overview |
| Day 5 (3h) | Keyboard navigation | Roving focus between tiles with Arrow keys; Home/End jump; Enter selects; Esc closes; visible focus ring aligned with label/border | Full keyboard operability |
| Day 6 (3h) | Search MVP | Simple input on backdrop; type-to-filter tiles by `label` (case-insensitive); integrate with keyboard nav on filtered set | Fast visual filtering without heavy infra |
| Day 7 (3h) | Final polish & docs | Click-outside behavior; pointer/hover states; minor perf passes (throttle resize, coalesce rAF per wrapper); update README/playground and capture feedback checklist | Demo-quality MVP ready for user feedback |

Scope and constraints this week:
- Stick to current transform-based approach; no DOM cloning/portals or cross-hierarchy reparenting.
- Keep store shape largely as-is; avoid central transform maps—only light tuning and small helpers.

Risks and mitigations:
- Safari blur/fixed quirks: test and use `-webkit-backdrop-filter`; fallback to opacity-only scrim.
- Large grid perf: throttle resize handlers; avoid repeated layout thrash; reuse created overlay DOM nodes per wrapper.

---

*This document is a living guide and will be updated as the project evolves.*