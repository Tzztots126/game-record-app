# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GameTrack — a personal game library tracker with a pixel-art themed UI. Users can manage games with cover images, screenshots, tags, ratings, play time, and status tracking.

## Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint (eslint-config-next/core-web-vitals + typescript)

npx prisma migrate dev    # Run database migrations
npx prisma studio         # Open Prisma Studio (DB browser)
npx prisma generate       # Regenerate Prisma client
```

No test framework is configured.

## Architecture

**Next.js 16 App Router** with React 19 and TypeScript. The AGENTS.md warning applies: this Next.js version has breaking changes — check `node_modules/next/dist/docs/` before writing code.

### Key directories

- `app/api/games/` — REST API: `route.ts` (list/create), `[id]/route.ts` (get/update/delete single game)
- `app/games/` — Pages: list (`page.tsx`), detail (`[id]/page.tsx`), add (`add/page.tsx`), edit (`[id]/edit/page.tsx`)
- `app/components/` — Shared UI components (GameCard, FilterBar, StatsPanel, ImageUpload, Lightbox, Navbar)
- `lib/db.ts` — Prisma client singleton (uses `@prisma/adapter-libsql` with SQLite)
- `lib/upload.ts` — File upload helpers: save/delete images, parse/stringify tags
- `prisma/schema.prisma` — Single `Game` model with SQLite datasource
- `public/uploads/games/` — Uploaded cover/screenshot images per game

### Data layer

Prisma 7 with libSQL adapter. The `Game` model stores `tags` and `screenshots` as JSON strings (arrays serialized via `JSON.stringify`). The API routes parse these back to arrays before returning to clients. The Prisma client is instantiated as a singleton in `lib/db.ts` to avoid connection exhaustion in dev.

### Styling

Tailwind CSS 4 with a pixel-art design system. Key conventions:
- Fonts: `Press_Start_2P` (headings, via `--font-pixel` / `.font-pixel`) and `VT323` (body, via `--font-pixel-body` / `.font-pixel-body`), plus a local `Ark Pixel` font
- Color palette defined as CSS variables in `globals.css`: `--pixel-bg` (#7617bf), `--pixel-surface` (#462a75), `--pixel-accent` (#ff6b9d), `--pixel-accent-2` (#4ecdc4), etc.
- Utility classes: `.pixel-btn`, `.pixel-card`, `.pixel-input`, `.pixel-badge`, `.badge-playing|completed|dropped|wishlist`
- All elements have `image-rendering: pixelated` globally
- Body background includes CRT scanline and vignette effects

### Image handling

Uploaded files go to `public/uploads/games/<gameId>/`. Images are saved via `lib/upload.ts` helpers. Default cover is `/uploads/default-cover.svg` when none uploaded. `sharp` is a dependency but currently images are saved as-is (no server-side compression implemented in the upload helpers).

### API patterns

- API routes use `NextRequest`/`NextResponse` from `next/server`
- Game creation uses `FormData` (multipart) for file uploads
- Filters/sorting are query params: `status`, `tag`, `sortBy`, `order`
- Game IDs are generated client-side via `uuid` before creation

### Client components

All page components use `'use client'` directive — data fetching happens client-side via `fetch('/api/games')`. No server components are used for data fetching currently.

## Environment

`DATABASE_URL` in `.env` defaults to `file:./dev.db` (SQLite file in project root).
