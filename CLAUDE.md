# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React TypeScript work management application built with Vite and modern web technologies. The app features authentication, project management, task tracking, reporting, and team collaboration tools.

## Common Commands

### Development
- `npm run dev` - Start development server with Vite and hot reload
- `npm run build` - Build for production (runs TypeScript compilation then Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on the codebase

### Package Management
- Uses npm with package-lock.json
- Also has pnpm-lock.yaml indicating pnpm compatibility

## Architecture Overview

### Core Technologies
- **React 19** with TypeScript and Vite
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **State Management**: TanStack Query for server state, Context providers for client state
- **Routing**: React Router v7 with loader-based authentication
- **Icons**: Lucide React and Tabler Icons

### Project Structure
```
src/
├── components/        # Reusable UI components
│   └── ui/           # shadcn/ui components
├── pages/            # Route components
├── layouts/          # Layout wrapper components (AppLayout, PublicLayout)
├── services/         # API service functions
├── lib/              # Utility functions and configurations
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
└── locales/          # Internationalization files
```

### Authentication System
- Token-based authentication with access/refresh token pattern
- Route protection via loader functions (`authLoader`, `loginLoader`, `publicLoader`)
- Automatic token refresh using custom logic
- Protected and public layouts for different route access levels

### Key Features
- **Multi-page application** with dashboard, projects, reports, tasks, days-off, and chats
- **Theme system** with dark/light mode and customizable primary colors
- **Internationalization** support with language switching
- **Toast notifications** using Sonner (positioned bottom-right, 4s duration)
- **Drag & drop** functionality with dnd-kit
- **Data tables** with TanStack Table
- **Form handling** with proper validation

### Component Architecture
- Uses shadcn/ui component library (New York style)
- Path aliases configured: `@/*` maps to `src/*`
- Provider pattern for themes, languages, colors, and titles
- Compound component patterns for complex UI elements

### API Integration
- Axios for HTTP requests with separate clients for authenticated and public endpoints
- TanStack Query for caching, synchronization, and background updates
- Service layer pattern in `src/services/` for API abstraction

### Development Notes
- Uses SWC for fast compilation
- ESLint configuration with React and TypeScript rules
- Vite configured with path resolution and ngrok support for development
- No test framework currently configured
- Custom toast system documented in TOAST_GUIDE.md (in Uzbek language)