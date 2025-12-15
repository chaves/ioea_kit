# IOEA Website - SvelteKit

This is a modern rebuild of the IOEA (Institutional and Organizational Economics Academy) website, migrated from CodeIgniter to SvelteKit.

## Tech Stack

- **Framework**: SvelteKit with TypeScript
- **Styling**: Tailwind CSS
- **Database**: MySQL with Prisma ORM
- **Authentication**: Custom session-based auth

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL database (existing IOEA database)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DATABASE_URL="mysql://username:password@localhost:3306/ioea"
```

3. Generate Prisma client:

```bash
npx prisma generate
```

4. (Optional) If starting fresh, push schema to database:

```bash
npx prisma db push
```

Or if using existing database, introspect:

```bash
npx prisma db pull
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the site.

## Static Assets

Copy static assets from the old site to the appropriate directories:

- `static/images/` - General images, logos
- `static/images/lec/` - Lecturer photos
- `static/images/photos/` - Event photos by year
- `static/images/students/` - Student photos
- `static/images/semchairs/` - Seminar chair photos
- `static/images/sponsors/` - Sponsor logos
- `static/pdf/` - PDF documents (brochures, etc.)
- `uploads/` - User uploads (CVs, papers)

## Project Structure

```
src/
├── lib/
│   ├── components/     # Svelte components
│   ├── server/         # Server-only code (auth, db, email)
│   └── config.ts       # Site configuration
├── routes/
│   ├── admin/          # Admin panel
│   ├── call/           # Application form
│   ├── community/      # Community pages
│   ├── ioea/[year]/    # Annual edition pages
│   ├── project/        # Project pages
│   ├── students/       # Student portal
│   └── ...             # Other routes
└── app.css             # Global styles
```

## Features

### Public Pages

- Home page with video and content
- Project information (goals, research areas, organization)
- Community pages (faculty, testimonials, alumni)
- Archives of past editions
- Videos
- Sponsors

### Annual Edition Pages (`/ioea/[year]`)

- Call for applications
- Lectures
- Workshops
- Seminars
- Participants
- Practical information

### Call for Applications

Multi-step application form with:
- Personal information
- Affiliation and research project
- File uploads (CV, research paper)
- Email confirmation

### Admin Panel (`/admin`)

- **Manager**: View all applications, filter by status, see ratings
- **Reviewer**: Rate assigned applications

### Student Portal (`/students`)

- Dashboard with profile and paper info
- Travel survey

## Deployment

### Build for production:

```bash
npm run build
```

### Preview production build:

```bash
npm run preview
```

### Deploy to production:

The site uses `@sveltejs/adapter-auto` which will auto-detect the deployment platform. For specific platforms:

- **Vercel**: Works out of the box
- **Node.js server**: Use `@sveltejs/adapter-node`
- **Static hosting**: Use `@sveltejs/adapter-static` (limited functionality)

## Database Migration

If migrating from the old CodeIgniter database:

1. Ensure your MySQL server has the existing IOEA database
2. Set the `DATABASE_URL` in `.env` to point to it
3. Run `npx prisma db pull` to sync the schema
4. Compare with `prisma/schema.prisma` and adjust as needed
5. Run `npx prisma generate` to update the client

The Prisma schema includes models for all existing tables:
- `students`, `students_papers`, `students_groups`, `students_travels`
- `call_proposals`, `call_notes`, `call_comments`, `call_reviewers`
- `countries`, `chairs`
- `e_auteurs`, `e_presentation`, `e_themes`, `e_references`
- `newsletter`, `journees_form`, `ws_form`
- `sessions` (new table for auth)

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new code
3. Test changes locally before committing
4. Keep components small and focused

## License

Private - IOEA Academy
