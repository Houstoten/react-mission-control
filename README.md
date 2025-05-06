# Fine-Bites - React Exposé

Fine-Bites is a lightweight React library that brings the macOS Exposé experience to your web applications. It allows your UI components to be organized into a grid view when activated, providing an elegant overview of all your app's sections.

<div align="center">
  <h3>Exposé for your React app</h3>
  <p>Press Ctrl+Up to see all your components, then click to select.</p>
</div>

## Features

- **Exposé View**: Zoom out to see all UI components at once
- **Smooth Animations**: Beautiful zoom-in and zoom-out transitions
- **Keyboard Shortcuts**: Activate with a keyboard shortcut (default: Ctrl+Up)
- **Window Titles**: Display titles for each component in Exposé view
- **High Performance**: GPU-accelerated animations with minimal DOM manipulation
- **Simple API**: Just wrap your components with `<ExposeWrapper>`

## Installation

```bash
npm install fine-bites
```

## Basic Usage

```jsx
import React from 'react';
import { ExposeProvider, ExposeWrapper } from 'fine-bites';

function App() {
  return (
    <ExposeProvider>
      <div className="app">
        <ExposeWrapper title="Dashboard">
          <div className="dashboard-panel">
            {/* Dashboard content */}
          </div>
        </ExposeWrapper>
        
        <ExposeWrapper title="User Management">
          <div className="users-panel">
            {/* User management content */}
          </div>
        </ExposeWrapper>
        
        <ExposeWrapper title="Settings">
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
  blurAmount={8} // Background blur amount in pixels
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
  title="Component Title" // Title shown in Exposé view
  id="unique-id" // Optional unique ID (auto-generated if not provided)
  className="custom-class" // Additional CSS classes
  style={{ /* Custom styles */ }}
>
  {/* Your component content */}
</ExposeWrapper>
```

## API

### useExpose Hook

Access and control the Exposé functionality programmatically.

```jsx
import React from 'react';
import { useExpose } from 'fine-bites';

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

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build the library
npm run build
```

## License

MIT

---

Inspired by macOS Exposé.