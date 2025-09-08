# React Expose

A macOS Mission Control and Exposé-like experience for React applications.

<div align="center">
  <h3>Expose for your React app</h3>
  <p>Press Ctrl+Up to see all your components, then click to select.</p>
</div>

## 📦 Monorepo Structure

This project uses a monorepo structure with pnpm workspaces:

```
react-expose/
├── packages/
│   └── react-expose/        # Main library package
├── apps/
│   └── playground/          # Demo application
└── package.json            # Root workspace configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Install pnpm if you haven't already
npm install -g pnpm

# Install dependencies
pnpm install

# Start development
pnpm dev
```

This will start both the library (in watch mode) and the playground app.

## 📚 Development

### Available Scripts

```bash
# Start everything in development mode
pnpm dev

# Build everything
pnpm build

# Run only the library in dev mode
pnpm dev:lib

# Run only the playground
pnpm dev:playground

# Type checking
pnpm typecheck

# Clean all build artifacts
pnpm clean
```

### Working on the Library

The library source code is in `packages/react-expose/`. It uses:
- **tsup** for bundling
- **TypeScript** for type safety
- Outputs both CommonJS and ESM formats

```bash
cd packages/react-expose
pnpm dev  # Start in watch mode
pnpm build # Build for production
```

### Working on the Playground

The playground is in `apps/playground/`. It uses:
- **Vite** for fast development
- **React 18**
- Hot module replacement

```bash
cd apps/playground
pnpm dev  # Start dev server
pnpm build # Build for production
```

## 🏗️ Architecture

### Technology Stack

- **Build Tools**: Vite (playground), tsup (library)
- **Package Manager**: pnpm with workspaces
- **Language**: TypeScript
- **Framework**: React 18+
- **Styling**: CSS modules

### Project Organization

- `packages/react-expose/` - Core library
  - `src/components/` - React components
  - `src/context/` - React context providers
  - `src/hooks/` - Custom hooks
  - `src/utils/` - Utility functions
  - `src/types.ts` - TypeScript definitions

- `apps/playground/` - Demo application
  - Showcases library features
  - Development testing ground
  - Documentation examples

## 📖 Library Usage

### Installation (when published)

```bash
npm install react-expose
# or
pnpm add react-expose
```

### Basic Usage

```jsx
import { ExposeProvider, ExposeWrapper, ExposeTrigger } from 'react-expose';

function App() {
  return (
    <ExposeProvider shortcut="Control+ArrowUp" blurAmount={10}>
      <ExposeTrigger />
      
      <ExposeWrapper label="Dashboard">
        <div>Your dashboard content</div>
      </ExposeWrapper>
      
      <ExposeWrapper label="Settings">
        <div>Your settings content</div>
      </ExposeWrapper>
    </ExposeProvider>
  );
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT

---

Built with ❤️ using modern React development practices.