# react-mission-control

[![npm version](https://img.shields.io/npm/v/react-mission-control.svg)](https://www.npmjs.com/package/react-mission-control)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-mission-control)](https://bundlephobia.com/package/react-mission-control)
[![license](https://img.shields.io/npm/l/react-mission-control.svg)](https://github.com/Houstoten/react-mission-control/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

macOS Mission Control-like experience for React applications.

## Installation

```bash
npm install react-mission-control
```

```bash
pnpm add react-mission-control
```

## Quick Start

```tsx
import { MCProvider, MCWrapper } from "react-mission-control";
import "react-mission-control/css";

function App() {
  return (
    <MCProvider>
      <MCWrapper label="Dashboard">
        <Dashboard />
      </MCWrapper>

      <MCWrapper label="Settings">
        <Settings />
      </MCWrapper>
    </MCProvider>
  );
}
```

Press `↑ ↑` (double tap Arrow Up) to activate. Press `Escape` to close.

## API

### MCProvider

Wrap your app with the provider to enable mission control functionality.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `shortcut` | `string` | `"ArrowUp+ArrowUp"` | Activation shortcut |
| `blurAmount` | `number` | `10` | Background blur in pixels |
| `onActivate` | `() => void` | - | Called when activated |
| `onDeactivate` | `() => void` | - | Called when deactivated |

### MCWrapper

Wrap components you want to include in mission control.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Label shown on hover |
| `id` | `string` | auto | Unique identifier |

### MCTrigger

Button component to activate programmatically.

```tsx
<MCTrigger className="btn">
  Show All
</MCTrigger>
```

### Hooks

```tsx
import { useMCActions, useIsMCActive } from "react-mission-control";

const { activate, deactivate } = useMCActions();
const isActive = useIsMCActive();
```

## Customization

Override CSS variables to customize appearance:

```css
:root {
  --mc-highlight: rgba(64, 156, 255, 0.85);
  --mc-backdrop-bg: rgba(0, 0, 0, 0.3);
  --mc-border-radius: 8px;
  --mc-transition-duration: 0.2s;
}
```

## Features

- Keyboard shortcut activation (configurable)
- Mobile support with Safari-like tab switcher
- Accessible (ARIA labels, focus management, reduced motion)
- SSR compatible (Next.js, Remix)
- Customizable via CSS variables
- TypeScript support
- Zero config required

## License

MIT
