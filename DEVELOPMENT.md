# React Expose Development Guide

This document outlines the development process and architecture for the **react-expose** library, which provides a macOS Mission Control and Exposé-like experience for web applications.

## Project Structure

The project is organized into two main parts:

1. **Library (`react-expose/`)**: The core library that can be imported into any React project.
2. **Demo (`/`)**: A demonstration application showcasing the library's features.

### Library Structure

```
react-expose/
├── src/
│   ├── components/
│   │   ├── ExposeWrapper.tsx      # Main wrapper component for exposable elements
│   │   ├── ExposeTrigger.tsx      # Component for handling expose activation triggers
│   │   └── styles.css             # Component styles
│   ├── context/
│   │   └── ExposeContext.tsx      # React context for expose state management
│   ├── hooks/
│   │   └── index.ts               # Custom hooks
│   ├── utils/
│   │   └── index.ts               # Utility functions
│   ├── types.ts                   # TypeScript type definitions
│   └── index.ts                   # Main entry point for the library
├── package.json
├── tsconfig.json
└── README.md
```

### Demo Structure

```
/
├── public/
│   └── index.html
├── src/
│   ├── demo.css
│   └── index.js                   # Demo application
├── package.json
└── tsconfig.json
```

## Setup Process

### 1. Library Setup

1. Initialize the library project:
   ```bash
   cd react-expose
   npm init -y
   ```

2. Install dependencies:
   ```bash
   npm install --save react react-dom
   npm install --save-dev typescript @types/react @types/react-dom rollup rollup-plugin-typescript2 rollup-plugin-css-only @rollup/plugin-node-resolve @rollup/plugin-commonjs rollup-plugin-terser
   ```

3. Configure TypeScript (`tsconfig.json`):
   ```json
   {
     "compilerOptions": {
       "target": "es5",
       "module": "esnext",
       "lib": ["dom", "dom.iterable", "esnext"],
       "jsx": "react",
       "declaration": true,
       "declarationDir": "dist",
       "sourceMap": true,
       "outDir": "dist",
       "strict": true,
       "moduleResolution": "node",
       "allowSyntheticDefaultImports": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true
     },
     "include": ["src"],
     "exclude": ["node_modules", "dist"]
   }
   ```

4. Configure Rollup (`rollup.config.js`):
   ```javascript
   import typescript from 'rollup-plugin-typescript2';
   import { nodeResolve } from '@rollup/plugin-node-resolve';
   import commonjs from '@rollup/plugin-commonjs';
   import css from 'rollup-plugin-css-only';
   import { terser } from 'rollup-plugin-terser';

   export default {
     input: 'src/index.ts',
     output: [
       {
         file: 'dist/index.js',
         format: 'cjs',
         sourcemap: true
       },
       {
         file: 'dist/index.esm.js',
         format: 'esm',
         sourcemap: true
       }
     ],
     external: ['react', 'react-dom'],
     plugins: [
       nodeResolve(),
       commonjs(),
       css({ output: 'styles.css' }),
       typescript({
         useTsconfigDeclarationDir: true,
         tsconfigOverride: {
           exclude: ['**/*.test.ts', '**/*.test.tsx', 'node_modules']
         }
       }),
       terser()
     ]
   };
   ```

5. Update `package.json`:
   ```json
   {
     "name": "react-expose",
     "version": "1.0.0",
     "description": "macOS Mission Control and Exposé-like experiences for web applications",
     "main": "dist/index.js",
     "module": "dist/index.esm.js",
     "types": "dist/index.d.ts",
     "scripts": {
       "build": "rollup -c",
       "prepare": "npm run build"
     },
     "files": [
       "dist"
     ],
     "peerDependencies": {
       "react": ">=16.8.0",
       "react-dom": ">=16.8.0"
     },
     "keywords": [
       "react",
       "mission-control",
       "expose",
       "ui",
       "animation"
     ],
     "license": "MIT"
   }
   ```

### 2. Demo Setup

1. Install dependencies in the root folder:
   ```bash
   npm install --save react-expose
   ```

2. Link the local library for development:
   ```bash
   npm link ./react-expose
   ```

## Core Components

### ExposeContext

The `ExposeContext` provides state management for the Exposé functionality:

```tsx
// src/context/ExposeContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';

interface ExposeContextType {
  isActive: boolean;
  activate: () => void;
  deactivate: () => void;
  registerWindow: (id: string, ref: React.RefObject<HTMLDivElement>) => void;
  unregisterWindow: (id: string) => void;
  windows: Map<string, React.RefObject<HTMLDivElement>>;
  highlightedComponent: string | null;
  setHighlightedComponent: (id: string | null) => void;
}

const ExposeContext = createContext<ExposeContextType>({
  isActive: false,
  activate: () => {},
  deactivate: () => {},
  registerWindow: () => {},
  unregisterWindow: () => {},
  windows: new Map(),
  highlightedComponent: null,
  setHighlightedComponent: () => {},
});

export const useExpose = () => useContext(ExposeContext);

export const ExposeProvider = ({ 
  children, 
  shortcut = "Control+ArrowUp",
  onActivate,
  onDeactivate, 
  blurAmount = 10 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [windows, setWindows] = useState<Map<string, React.RefObject<HTMLDivElement>>>(new Map());
  const [highlightedComponent, setHighlightedComponent] = useState<string | null>(null);

  // Implementation of methods...

  return (
    <ExposeContext.Provider
      value={{
        isActive,
        activate,
        deactivate,
        registerWindow,
        unregisterWindow,
        windows,
        highlightedComponent,
        setHighlightedComponent,
      }}
    >
      {children}
    </ExposeContext.Provider>
  );
};
```

### ExposeWrapper

The `ExposeWrapper` component is used to wrap any element that should be included in the Exposé view:

```tsx
// src/components/ExposeWrapper.tsx
import React, { useRef, useEffect, useState } from 'react';
import { useExpose } from '../context/ExposeContext';
import { createUniqueId } from '../utils';

interface ExposeWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}

export const ExposeWrapper = ({
  children,
  id: propId,
  className = "",
  style = {},
  label,
}: ExposeWrapperProps) => {
  // Generate a unique ID if none provided
  const componentId = useRef(propId || createUniqueId());
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { 
    isActive, 
    registerWindow, 
    unregisterWindow, 
    highlightedComponent,
    setHighlightedComponent 
  } = useExpose();

  // Register/unregister this window with the Expose context
  useEffect(() => {
    registerWindow(componentId.current, wrapperRef);
    return () => unregisterWindow(componentId.current);
  }, [registerWindow, unregisterWindow]);

  // Implementation of animation and layout effects...

  return (
    <div className="expose-container">
      <div
        ref={wrapperRef}
        className={`expose-window ${isActive ? "expose-window-active" : ""} ${className}`}
        onClick={isActive ? () => { /* Handle click during active expose */ } : undefined}
        style={{
          // Animation styles...
        }}
        data-expose-id={componentId.current}
      >
        {children}
      </div>
    </div>
  );
};
```

### ExposeTrigger

The `ExposeTrigger` component handles keyboard shortcuts for activating the Exposé view:

```tsx
// src/components/ExposeTrigger.tsx
import React, { useEffect } from 'react';
import { useExpose } from '../context/ExposeContext';

export const ExposeTrigger = () => {
  const { isActive, activate, deactivate } = useExpose();
  
  useEffect(() => {
    // Implement keyboard shortcut handling...
    
    return () => {
      // Clean up event listeners...
    };
  }, [isActive, activate, deactivate]);
  
  return null; // This component doesn't render anything
};
```

## API Reference

### Components

#### `<ExposeProvider>`

The top-level component that enables Exposé functionality.

Props:
- `children`: React nodes to be wrapped
- `shortcut`: Keyboard shortcut to activate Exposé (default: "Control+ArrowUp")
- `onActivate`: Callback when Exposé is activated
- `onDeactivate`: Callback when Exposé is deactivated
- `blurAmount`: Amount of backdrop blur when in Exposé mode (default: 10px)

#### `<ExposeWrapper>`

Wrapper for elements that should be included in the Exposé view.

Props:
- `children`: React nodes to be wrapped
- `id`: Optional unique identifier (generated if not provided)
- `className`: Additional CSS classes
- `style`: Additional inline styles
- `label`: Label to display when component is in Exposé mode

#### `<ExposeTrigger>`

Optional component to add keyboard trigger functionality.

### Hooks

#### `useExpose()`

Hook for accessing Exposé context and functionality.

Returns:
- `isActive`: Boolean indicating if Exposé view is active
- `activate`: Function to activate Exposé view
- `deactivate`: Function to deactivate Exposé view
- `highlightedComponent`: ID of currently highlighted component (if any)
- `setHighlightedComponent`: Function to set highlighted component

## Development Workflow

1. Work on the library in the `react-expose` directory
2. Build the library: `cd react-expose && npm run build`
3. Test in the demo app: `npm start`

## Release Process

1. Update version number in `react-expose/package.json`
2. Build the library: `cd react-expose && npm run build`
3. Publish to npm: `cd react-expose && npm publish`

## Testing

Add tests using Jest and React Testing Library. Configure in the future iterations.

## License

MIT