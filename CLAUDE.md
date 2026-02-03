# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Mission Control is a library that provides macOS Mission Control-like experiences for web applications. This is a monorepo using:

- **Turborepo** for build orchestration and caching
- **pnpm workspaces** for dependency management
- **Biome** for linting and formatting
- **tsdown** for modern, fast bundling

1. **Library** (`packages/react-expose/`): Core library package built with tsdown and TypeScript
2. **Playground** (`apps/playground/`): Demo application built with Next.js showcasing library features

## Development Commands

### Quick Start

```bash
# Install dependencies for all packages
pnpm install

# Start everything in development mode (with Turbo)
pnpm dev

# Build everything (with Turbo caching)
pnpm build

# Lint and format code (with Biome)
pnpm lint        # Check for issues
pnpm lint:fix    # Fix issues automatically
pnpm format      # Format code
```

### Library Development (`packages/react-expose/`)

```bash
# Start in watch mode
pnpm dev:lib

# Build the library
pnpm build:lib

# Type checking
pnpm typecheck
```

### Playground Development (`apps/playground/`)

```bash
# Start dev server
pnpm dev:playground

# Build playground
pnpm build:playground
```

## Architecture

### Monorepo Structure
```
react-mission-control/
├── packages/
│   └── react-expose/        # Main library (tsdown build)
├── apps/
│   └── playground/          # Demo app (Next.js)
├── pnpm-workspace.yaml      # Workspace configuration
└── package.json            # Root package scripts
```

### Core Components

- **MCProvider** (`packages/react-expose/src/context/MCProvider.tsx`): Main context provider that manages mission control state
- **MCWrapper** (`packages/react-expose/src/components/MCWrapper.tsx`): Wrapper component for elements to include in mission control
- **MCTrigger** (`packages/react-expose/src/components/MCTrigger.tsx`): Handles keyboard shortcuts for activation

### Key Patterns

1. **Zustand State Management**: The library uses Zustand store to manage global state and window registration
2. **Component Registration**: Each `MCWrapper` registers itself with the store using a unique ID
3. **Animation System**: CSS transforms and transitions handle the zoom-out effect when mission control is activated
4. **Monorepo with pnpm workspaces**: Enables efficient dependency management and cross-package development

### Build System

- **Turborepo**: Handles task orchestration, caching, and parallelization
- **Library**: Uses tsdown for bundling (outputs CJS, ESM, and TypeScript definitions)
- **Playground**: Uses Next.js for React development with SSR/SSG capabilities
- **Biome**: Provides fast linting and formatting for all code

## Important Files

- `turbo.json`: Turborepo pipeline configuration
- `biome.json`: Biome linting and formatting rules
- `packages/react-expose/tsdown.config.ts`: Library build configuration
- `packages/react-expose/tsconfig.json`: TypeScript configuration for library
- `packages/react-expose/src/index.ts`: Library entry point and exports
- `packages/react-expose/src/types.ts`: TypeScript type definitions
- `apps/playground/next.config.js`: Next.js configuration for demo app
- `pnpm-workspace.yaml`: Workspace packages definition

## Development Workflow

1. Make changes to library code in `packages/react-expose/src/`
2. Library auto-rebuilds in watch mode if running `pnpm dev`
3. Changes are immediately reflected in playground due to workspace linking
4. Build for production: `pnpm build`

## Testing Changes

The playground app automatically uses the local library version through pnpm workspace linking (`"react-mission-control": "workspace:*"`), so changes are reflected immediately during development.

## Code Search Guidelines

When searching for code patterns, functions, or components in this repository:

### Use ast-grep for Semantic Code Search

**Preferred**: Use `ast-grep` (sg) for searching code patterns, especially when looking for:
- Function definitions and calls
- Component usage patterns
- Import statements
- Type definitions
- Specific JSX/TSX patterns

```bash
# Examples:
sg --pattern 'const $NAME = $_' -l tsx  # Find const declarations
sg --pattern '<MCWrapper $$$>' -l tsx  # Find MCWrapper usage
sg --pattern 'import { $$ } from "react-mission-control"' -l tsx  # Find imports from library
```

**Avoid**: Basic grep/ripgrep for code structure searches (use only for simple text searches)

### Why ast-grep?

- **Semantic Understanding**: Understands code structure, not just text patterns
- **More Accurate**: Finds actual code usage, not comments or strings
- **Better for Refactoring**: Can identify all instances of a pattern regardless of formatting
- **Language-Aware**: Understands TypeScript/JavaScript/JSX syntax
