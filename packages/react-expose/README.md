# react-mission-control

A React library that provides macOS Mission Control / Exposé-like window management for web applications. Activate it to see all your components in a grid view, then click to navigate.

![npm version](https://img.shields.io/npm/v/react-mission-control)
![license](https://img.shields.io/npm/l/react-mission-control)

## Features

- macOS Mission Control-style grid view for React components
- Keyboard shortcut activation (customizable)
- Smooth animations with CSS transitions
- Mobile-friendly with touch support and vertical card stack
- Accessible with full keyboard navigation and ARIA support
- Respects `prefers-reduced-motion`
- Fully customizable via CSS variables
- TypeScript support

## Installation

```bash
npm install react-mission-control
# or
pnpm add react-mission-control
# or
yarn add react-mission-control
```

## Quick Start

```tsx
import { MCProvider, MCWrapper } from "react-mission-control";
import "react-mission-control/styles.css";

function App() {
  return (
    <MCProvider>
      <MCWrapper label="Header">
        <Header />
      </MCWrapper>

      <MCWrapper label="Main Content">
        <MainContent />
      </MCWrapper>

      <MCWrapper label="Sidebar">
        <Sidebar />
      </MCWrapper>
    </MCProvider>
  );
}
```

Press **Arrow Up** twice quickly (or your custom shortcut) to activate Mission Control. Press **Escape** to deactivate.

## Components

### `<MCProvider>`

Wrap your app with this provider to enable Mission Control functionality.

```tsx
<MCProvider
  shortcut="ArrowUp+ArrowUp"  // Default: double-tap Arrow Up
  blurAmount={10}              // Background blur in pixels
  onActivate={() => {}}        // Callback when activated
  onDeactivate={() => {}}      // Callback when deactivated
  ariaLabel="Mission Control"  // Accessible label
>
  {children}
</MCProvider>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `shortcut` | `string` | `"ArrowUp+ArrowUp"` | Keyboard shortcut to activate. Supports modifiers like `"Control+ArrowUp"` |
| `blurAmount` | `number` | `10` | Background blur amount in pixels |
| `onActivate` | `() => void` | - | Callback fired when Mission Control activates |
| `onDeactivate` | `() => void` | - | Callback fired when Mission Control deactivates |
| `ariaLabel` | `string` | `"Mission Control view"` | Accessible label for the dialog |

### `<MCWrapper>`

Wrap any component you want to appear in the Mission Control grid.

```tsx
<MCWrapper
  label="My Component"   // Label shown on hover
  id="unique-id"         // Optional custom ID
  className="custom"     // Additional CSS classes
  style={{ ... }}        // Inline styles
>
  <YourComponent />
</MCWrapper>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Label displayed on hover (desktop) or always visible (mobile) |
| `id` | `string` | auto-generated | Unique identifier for the component |
| `className` | `string` | `""` | Additional CSS classes |
| `style` | `CSSProperties` | `{}` | Inline styles |

### `<MCTrigger>`

A button component to manually trigger Mission Control.

```tsx
import { MCTrigger } from "react-mission-control";

<MCTrigger className="my-button">
  Open Mission Control
</MCTrigger>
```

## Hooks

### `useIsMCActive()`

Returns whether Mission Control is currently active.

```tsx
import { useIsMCActive } from "react-mission-control";

function MyComponent() {
  const isActive = useIsMCActive();
  return <div>{isActive ? "MC is open" : "MC is closed"}</div>;
}
```

### `useMCActions()`

Returns actions to control Mission Control programmatically.

```tsx
import { useMCActions } from "react-mission-control";

function MyComponent() {
  const { activate, deactivate, setActive } = useMCActions();

  return (
    <button onClick={activate}>
      Open Mission Control
    </button>
  );
}
```

### `mcActions`

Direct access to actions without hooks (useful outside React components).

```tsx
import { mcActions } from "react-mission-control";

// Can be called anywhere
mcActions.activate();
mcActions.deactivate();
```

## Customization

Customize the appearance using CSS variables:

```css
:root {
  /* Colors */
  --mc-highlight: rgba(64, 156, 255, 0.85);
  --mc-highlight-muted: rgba(64, 156, 255, 0.7);
  --mc-backdrop-bg: rgba(0, 0, 0, 0.3);
  --mc-label-bg: rgba(0, 0, 0, 0.75);
  --mc-label-color: white;
  --mc-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);

  /* Dimensions */
  --mc-border-radius: 8px;
  --mc-border-width: 3px;
  --mc-label-font-size: 12px;
  --mc-label-padding: 4px 8px;

  /* Animations */
  --mc-transition-duration: 0.2s;
  --mc-transition-easing: cubic-bezier(0.16, 1, 0.3, 1);
  --mc-backdrop-duration: 0.3s;
  --mc-blur-amount: 10px;

  /* Mobile */
  --mc-mobile-card-height: 20vh;
  --mc-mobile-card-width: 85vw;
  --mc-mobile-card-gap: 12px;
  --mc-mobile-card-radius: 12px;
}
```

## Mobile Support

On viewports smaller than 768px, Mission Control automatically switches to a vertical scrollable card stack (similar to Safari's tab switcher on iOS). Cards snap into place with smooth scrolling.

## Accessibility

- Full keyboard navigation with Tab/Shift+Tab
- Focus trap when active
- ARIA labels and roles
- Escape key to close
- Respects `prefers-reduced-motion` for users who prefer reduced animations

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

## Legacy API

For backward compatibility, the library also exports the previous API names:

```tsx
// These work the same as the MC* versions
import {
  ExposeProvider,    // = MCProvider
  ExposeWrapper,     // = MCWrapper
  ExposeTrigger,     // = MCTrigger
  useIsExposeActive, // = useIsMCActive
  useExposeActions,  // = useMCActions
  exposeActions,     // = mcActions
} from "react-mission-control";
```

## License

MIT
