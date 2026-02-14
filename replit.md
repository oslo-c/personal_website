# Ethan Hamilton — Personal Website

## Overview

This is a personal portfolio and engineering notebook website for Ethan Hamilton. It serves as a portfolio, project documentation hub, resume page, and technical notebook. The site presents projects, lab notes, and generic site pages — all stored in a PostgreSQL database and rendered through a React frontend with a calm, technically minimal design aesthetic.

The site is read-only and content-first. There are no create/update/delete endpoints exposed through the UI — content is seeded into the database via a `seedIfEmpty()` method on the storage layer.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

- **Framework:** React 18 with TypeScript, bundled by Vite
- **Routing:** Wouter (lightweight client-side router)
- **State/Data Fetching:** TanStack React Query with custom hooks per resource (`use-projects`, `use-lab-notes`, `use-pages`)
- **UI Components:** shadcn/ui (new-york style) built on Radix UI primitives, styled with Tailwind CSS and CSS variables for theming
- **Command Palette:** `cmdk` library for a keyboard-accessible search/navigation palette (Cmd+K or `/`)
- **Validation:** Zod schemas used on the client to validate and coerce API responses (especially date fields from JSON)
- **Design Language:** Technical minimalism — dark mode default, terminal turquoise accent, DM Sans + Fira Code / Geist Mono fonts, generous spacing, minimal animation
- **Path aliases:** `@/` maps to `client/src/`, `@shared/` maps to `shared/`

**Key pages:**
- `/` — Home (hero, featured projects, latest lab notes)
- `/about` — About page with prose content
- `/projects` — Searchable, sortable project list
- `/projects/:slug` — Project detail with collapsible doc sections (overview, architecture, tech decisions, stack, links, lessons)
- `/lab-notes` — Chronological searchable list
- `/lab-notes/:slug` — Lab note detail
- `/resume` — Resume page with download PDF and print buttons
- `/p/:slug` — Generic site page detail

### Backend

- **Runtime:** Node.js with Express 5
- **Language:** TypeScript, executed with `tsx`
- **API Pattern:** RESTful JSON API under `/api/` prefix. Routes are defined declaratively in `shared/routes.ts` and registered in `server/routes.ts`
- **Storage Layer:** Interface-based (`IStorage`) with `DatabaseStorage` implementation using Drizzle ORM queries. The `seedIfEmpty()` method populates initial content
- **Dev Server:** Vite middleware is used in development for HMR; in production, static files are served from `dist/public`

**API Endpoints:**
- `GET /api/pages` — list site pages (optional `?search=` query)
- `GET /api/pages/:slug` — get page by slug
- `GET /api/projects` — list projects (optional `?search=`)
- `GET /api/projects/:slug` — get project by slug
- `GET /api/lab-notes` — list lab notes (optional `?search=`)
- `GET /api/lab-notes/:slug` — get lab note by slug

### Database

- **Database:** PostgreSQL (required via `DATABASE_URL` environment variable)
- **ORM:** Drizzle ORM with `drizzle-zod` for schema-to-Zod integration
- **Schema location:** `shared/schema.ts` — three tables:
  - `site_pages` — slug, title, summary, content, updatedAt
  - `projects` — slug, title, oneLiner, overview, architecture, technicalDecisions, techStack, links, lessonsLearned, updatedAt
  - `lab_notes` — slug, title, date, content, updatedAt
- **Migrations:** Managed via `drizzle-kit push` (schema push approach, not file-based migrations)
- **Connection:** `pg.Pool` in `server/db.ts`

### Shared Code

The `shared/` directory contains code used by both frontend and backend:
- `shared/schema.ts` — Drizzle table definitions, insert schemas, and TypeScript types
- `shared/routes.ts` — Declarative API route definitions with Zod schemas for inputs and responses, plus a `buildUrl` helper for parameterized paths

### Build System

- **Development:** `tsx server/index.ts` with Vite middleware for HMR
- **Production build:** Custom `script/build.ts` that runs Vite build for the client and esbuild for the server, outputting to `dist/`
- **Server bundle:** esbuild bundles key dependencies (listed in an allowlist) to reduce cold start syscalls; other deps are externalized

### Theming

- Dark mode is the default; light mode is toggled via a class on `<html>`
- CSS variables in `client/src/index.css` define the full color palette for both themes
- Tailwind config extends the default theme with these CSS variable-based colors

## External Dependencies

- **PostgreSQL** — Primary data store, connected via `DATABASE_URL` environment variable
- **Google Fonts** — DM Sans, Fira Code, Geist Mono, Architects Daughter loaded via CDN
- **No authentication** — The site is entirely public/read-only
- **No external APIs** — Content is self-contained in the database (though build script references OpenAI/Stripe/etc. in its allowlist, these appear to be template defaults not actively used)
- **Replit plugins** — `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, and `@replit/vite-plugin-dev-banner` are used in development on Replit