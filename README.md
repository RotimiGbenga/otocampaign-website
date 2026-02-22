# Otunba Campaign - Ogun State 2027

A production-ready political campaign website built with Next.js 15, Tailwind CSS, Prisma, and MySQL.

## Features

- **Homepage** - Hero section with candidate branding, vision, and CTAs
- **About** - Candidate biography and key priorities
- **Get Involved** - Volunteer sign-up form with database persistence
- **Contact** - Contact form with persistent message storage
- **Admin Dashboard** - View volunteers and contacts (password-protected)
- **API Routes** - Internal APIs for volunteer and contact submissions
- **Mobile Responsive** - Presidential campaign design, green/white/gold theme

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- MySQL

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and set your values:

```bash
cp .env.example .env
```

Required variables:

- `ADMIN_PASSWORD` - Password for admin dashboard access (use a strong password)
- `DATABASE_URL` - Database connection string (SQLite: `file:./dev.db` for dev; MySQL for production)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `ADMIN_EMAIL` - For volunteer & contact email notifications

### 3. Initialize database

```bash
npm run db:push
```

This creates the `volunteers` and `contacts` tables in your MySQL database.

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:migrate` | Run migrations |
| `npm run db:studio` | Open Prisma Studio |

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   │   ├── volunteers/
│   │   ├── contacts/
│   │   └── admin/
│   ├── about/
│   ├── get-involved/
│   ├── contact/
│   ├── admin/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── layout/        # Header, Footer
│   └── forms/         # VolunteerForm, ContactForm
└── lib/
    ├── prisma.ts      # Prisma client
    └── validations.ts # Zod schemas
```

## Admin Dashboard

Access at `/admin` (redirects to `/admin/login`). Use the value of `ADMIN_PASSWORD` from your `.env` as the password.

## Deployment

### Vercel (recommended)

1. Create a new GitHub repository (suggested name: **`otocampaign-website`**) and push this project
2. In [Vercel](https://vercel.com), click **Add New Project** → **Import Git Repository**
3. Connect GitHub and select the repository
4. Configure environment variables in Vercel project settings:
   - `ADMIN_PASSWORD`
   - `DATABASE_URL` (use MySQL for production, e.g. PlanetScale, Railway, Hostinger)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `ADMIN_EMAIL`
5. Deploy — Vercel runs `prisma generate` (postinstall) and `next build` automatically

### Manual deploy

1. Set `ADMIN_PASSWORD`, `DATABASE_URL`, and SMTP variables in your hosting environment
2. Run `npm run build`
3. Run `npm run start` or deploy to Node hosting

For MySQL (e.g. Hostinger), use: `mysql://username:password@hostname:3306/database_name`
# otocampaign-website
