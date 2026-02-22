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

- `DATABASE_URL` - MySQL connection string (e.g. `mysql://user:password@host:3306/database`)
- `ADMIN_SECRET` - Secret for admin dashboard access (use a strong password)

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

Access at `/admin`. Use the value of `ADMIN_SECRET` from your `.env` as the password.

## Deployment

1. Set `DATABASE_URL` and `ADMIN_SECRET` in your hosting environment
2. Run `npm run build`
3. Run `npm run start` or deploy to Vercel/Node hosting

For Hostinger MySQL, use the connection string format:
`mysql://username:password@hostname:3306/database_name`
