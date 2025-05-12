# React Expose

A macOS Mission Control and Exposé-like experiences for web applications.

<div align="center">
  <h3>Exposé for your React app</h3>
  <p>Press Ctrl+Up to see all your components, then click to select.</p>
</div>

## Features

- **Exposé View**: Zoom out to see all UI components at once
- **Smooth Animations**: Beautiful zoom-in and zoom-out transitions
- **Keyboard Shortcuts**: Activate with a keyboard shortcut (default: Ctrl+Up)
- **Component Labels**: Display labels for each component in Exposé view
- **High Performance**: GPU-accelerated animations with minimal DOM manipulation
- **Simple API**: Just wrap your components with `<ExposeWrapper>`
- **Component Highlighting**: Highlight selected components with visual effects

## Installation

```bash
npm install react-expose
```

## Basic Usage

```jsx
import React from 'react';
import { ExposeProvider, ExposeWrapper, ExposeTrigger } from 'react-expose';

function App() {
  return (
    <ExposeProvider shortcut="Control+ArrowUp" blurAmount={10}>
      <ExposeTrigger />
      <div className="app">
        <ExposeWrapper label="Dashboard">
          <div className="dashboard-panel">
            {/* Dashboard content */}
          </div>
        </ExposeWrapper>
        
        <ExposeWrapper label="User Management">
          <div className="users-panel">
            {/* User management content */}
          </div>
        </ExposeWrapper>
        
        <ExposeWrapper label="Settings">
          <div className="settings-panel">
            {/* Settings content */}
          </div>
        </ExposeWrapper>
      </div>
    </ExposeProvider>
  );
}
```

## Components

### ExposeProvider

Wrap your application with the `ExposeProvider` to enable the Exposé functionality.

```jsx
<ExposeProvider
  shortcut="Control+ArrowUp" // Keyboard shortcut to trigger Exposé
  blurAmount={10} // Background blur amount in pixels
  onActivate={() => console.log('Exposé activated')}
  onDeactivate={() => console.log('Exposé deactivated')}
>
  {/* Your app content */}
</ExposeProvider>
```

### ExposeWrapper

Wrap individual components that you want to include in the Exposé view.

```jsx
<ExposeWrapper
  label="Component Label" // Label shown in Exposé view
  id="unique-id" // Optional unique ID (auto-generated if not provided)
  className="custom-class" // Additional CSS classes
  style={{ /* Custom styles */ }}
>
  {/* Your component content */}
</ExposeWrapper>
```

### ExposeTrigger

Optional component that handles keyboard shortcuts for activating the Exposé view.

```jsx
<ExposeTrigger />
```

## API

### useExpose Hook

Access and control the Exposé functionality programmatically.

```jsx
import React from 'react';
import { useExpose } from 'react-expose';

function ExposeButton() {
  const { isActive, activate, deactivate } = useExpose();
  
  return (
    <button onClick={() => isActive ? deactivate() : activate()}>
      {isActive ? 'Exit Exposé' : 'Show Exposé'}
    </button>
  );
}
```

## Development

See [DEVELOPMENT.md](DEVELOPMENT.md) for development setup instructions.

## License

MIT

---

Inspired by macOS Exposé.