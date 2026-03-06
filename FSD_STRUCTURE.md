# Feature-Sliced Design (FSD) Architecture

## Overview
The Nero Launcher frontend has been successfully migrated to Feature-Sliced Design architecture, providing clear separation of concerns and scalability for future features.

## Directory Structure

```
src/
├── app/                              # Next.js App Router layer
│   ├── layout.tsx                    # Root layout with theme & fonts
│   ├── page.tsx                      # Home route (renders HomeView)
│   ├── test/
│   │   └── page.tsx                  # Test route (renders TestView)
│   └── not-found.tsx                 # 404 page
│
├── views/                            # Page-level components (specific to routes)
│   ├── home/
│   │   ├── home-view.tsx             # Home page component
│   │   └── index.ts                  # Barrel export
│   └── test/
│       ├── test-view.tsx             # Test page component
│       └── index.ts                  # Barrel export
│
├── features/                         # Feature-specific slices (future use)
│   └── (organized by feature)
│
├── entities/                         # Domain entities (future use)
│   └── (business objects & types)
│
├── shared/                           # Reusable across entire app
│   ├── ui/                           # Shared UI components
│   │   ├── lamp/
│   │   │   ├── lamp.tsx              # LampContainer component
│   │   │   ├── lamp-demo.tsx         # LampDemo component
│   │   │   └── index.ts              # Exports: LampContainer, LampDemo
│   │   ├── theme-provider/
│   │   │   ├── theme-provider.tsx    # Theme provider wrapper
│   │   │   └── index.ts              # Exports: ThemeProvider
│   │   └── index.ts                  # Barrel export of all UI components
│   │
│   ├── lib/                          # Shared utilities
│   │   ├── utils/
│   │   │   ├── cn.ts                 # Class merging utility
│   │   │   └── index.ts              # Exports: cn
│   │   └── index.ts                  # Barrel export
│   │
│   ├── types/                        # Shared type definitions
│   │   └── index.ts                  # Global types
│   │
│   └── config/                       # Shared configuration
│       ├── fonts.ts                  # Font configurations
│       └── index.ts                  # Exports: Lexend, GeistSans, GeistMono
│
├── fonts/                            # Static font assets
│   ├── geist/
│   │   ├── geist-mono.woff2
│   │   └── geist-sans.woff2
│   └── lexend/
│       └── lexend.woff2
│
└── styles/                           # Global CSS
    └── globals.css                   # Tailwind + theme variables
```

## Key Changes

### Before
- Components scattered in `components/` with loose organization
- Utilities in `lib/`
- No clear layer separation
- No barrel exports

### After (FSD)
- **app/**: Next.js App Router configuration (metadata, layouts, routing)
- **views/**: Page-level component compositions (one view per route)
- **shared/**: Reusable components, utilities, config, types
  - `ui/`: Presentational components
  - `lib/`: Utility functions
  - `types/`: Type definitions
  - `config/`: Configuration objects
- **features/**: Feature slices (empty, ready for launcher features)
- **entities/**: Domain entities (empty, ready for game/launcher entities)

## Import Paths

All imports use the `@/` alias (configured in `tsconfig.json`):

```typescript
// Shared components
import { LampContainer, LampDemo } from '@/shared/ui/lamp'
import { ThemeProvider } from '@/shared/ui/theme-provider'

// Shared utilities
import { cn } from '@/shared/lib/utils'

// Shared config
import { Lexend, GeistSans, GeistMono } from '@/shared/config/fonts'

// Views
import { HomeView } from '@/views/home'
import { TestView } from '@/views/test'
```

## FSD Layer Rules

1. **app/**: Only Next.js-specific files (layout, routes, metadata)
2. **views/**: Components imported by routes (no cross-view imports)
3. **shared/**: Reusable across the entire application
4. **features/**: Self-contained feature slices (not yet populated)
5. **entities/**: Domain-specific business objects (not yet populated)

## Barrel Exports

Every folder has an `index.ts` file exporting its public API:
- Cleaner imports: `import { cn } from '@/shared/lib/utils'`
- Easy to refactor internals without breaking imports
- Clear public API boundaries

## Future Expansion

When adding new features:

```
features/
├── launcher/           # Launcher feature
│   ├── ui/            # Feature-specific components
│   ├── model/         # State & hooks
│   ├── api/           # API calls
│   └── index.ts       # Public API
│
└── settings/          # Settings feature
    ├── ui/
    ├── model/
    ├── api/
    └── index.ts
```

## Verification

✅ Build passes: `npm run build`
✅ No type errors: `npx tsc --noEmit`
✅ Routes work: `/` and `/test`
✅ Theme switching works
✅ Components render correctly
