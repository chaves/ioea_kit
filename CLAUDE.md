# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Vite, port 5173)
npm run build        # Build for production (runs prisma generate first)
npm run check        # Type-check with svelte-check
npm start            # Run production server via server.js wrapper
npx prisma generate  # Regenerate Prisma client after schema changes
./scripts/deploy.sh  # Deploy to AlwaysData: pull + install + build over SSH, then restart via API (--restart: restart only)
```

No test framework is configured. Use `npm run check` to verify types.

## Architecture

This is an **IOEA (Institutional and Organizational Economics Academy)** website built with SvelteKit (Svelte 5, runes), Prisma + MySQL, deployed on AlwaysData with `adapter-node`.

### Key Directories

- `src/lib/server/auth.ts` — Sessions (in-memory Map), password hashing (bcryptjs), role checking, user CRUD, password reset tokens
- `src/lib/server/db.ts` — Prisma client singleton
- `src/lib/server/email.ts` — Email templates + nodemailer (dev: console log fallback)
- `src/lib/config.ts` — Static config: year, dates, emails, feature flags, menu, prices
- `src/lib/data/` — Static data exports (testimonials, sponsors, alumni, etc.)
- `src/lib/components/` — Shared components (Header, Footer, Sidebar, PageHeader, SEO)

### Route Structure (4 independent portals)

| Portal | Routes | Auth Guard | Roles |
|--------|--------|-----------|-------|
| Public site | `/`, `/[year]/*`, `/community/*`, `/news/*`, `/call/*` | None | — |
| Admin/Reviewer | `/auth/*` | `+layout.server.ts` checks admin/reviewer | admin, reviewer |
| Student | `/students/*` | `+layout.server.ts` checks student | student |
| Program Admin | `/program-admin/*` | `+layout.server.ts` checks program-admin | program-admin |

Public paths within `/auth/`: login, forgot-password, reset-password, change-password.

### Authentication Flow

1. `hooks.server.ts` loads session from `ioea_session` cookie into `event.locals.session` on every request
2. Sessions stored in-memory (`Map<string, Session>`), 24h expiry
3. Users have roles via `users → user_roles → roles` (many-to-many)
4. Role helpers: `hasRole()`, `hasAnyRole()`, `hasAllRoles()`
5. Password reset: SHA-256 hashed tokens stored in `password_reset_tokens`, 1h expiry

### Database

Prisma with MySQL. Schema in `prisma/schema.prisma`. Key model groups:
- **Auth**: `users`, `roles`, `user_roles`, `password_reset_tokens`
- **Call**: `call_submissions`, `call_notes`, `call_comments`, `call_reviewers`, `call_groups`
- **Students**: `students`, `students_papers`, `students_travels`, `students_groups`
- **Content**: `e_auteurs`, `e_presentation`, `e_themes`, `e_references`, `chairs`
- **News**: `news_article`, `news_file` — managed at `/auth/manager/news` (admin), same model as the SIOE site. Images (`/images/news/`) and PDFs (`/files/news/`) are written to `static/` and mirrored into `build/client/`; `server.js` serves those two folders from disk so uploads show without a restart

Migrations are raw SQL files in `prisma/migrations/` (applied manually, not via `prisma migrate`).

### Styling

Tailwind CSS with custom CSS variables defined in `src/app.css`. Color palette: purple primary (`#5d4a78`), teal accent (`#5a9fa2`). Admin pages use `.admin-page`, `.data-table`, `.stat-card` classes. Standalone auth pages use `.login-page` pattern.

## Conventions

- **Svelte 5 runes**: `$state`, `$derived`, `$props`, `$effect` — no legacy `$:` or `export let`
- **Indentation**: Real tabs in both `.svelte` and `.ts` files
- **File uploads**: PDF only, max 5MB, saved to `uploads/IOEA{year}_call/`
- **Email**: Template functions return `EmailOptions`, `sendEmail()` handles transport
- **Config**: All site-wide settings in `src/lib/config.ts` (year, deadlines, feature flags)

## Critical: Handle With Care

- `src/routes/call/*` — Public application form (production-critical). Changes are allowed but must be minimal and verified (check + build, test the form). Never block access to it (no robots/noindex/redirect added on the form itself).

## Production (AlwaysData)

`server.js` sets `BODY_SIZE_LIMIT=12582912`, `ORIGIN`, proxy headers before importing the SvelteKit handler. Graceful shutdown via `SIGUSR2`. Environment variables: `DATABASE_URL`, `SMTP_*`, `PROGRAM_ADMIN_PASSWORD`, `ORIGIN`.
