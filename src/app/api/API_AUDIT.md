# API Route Audit

## Current Architecture (Production-Ready)

| Endpoint | Method | Used By | Purpose |
|----------|--------|---------|---------|
| `/api/volunteer` | POST | VolunteerForm | Volunteer sign-up |
| `/api/contact` | POST | ContactForm | Contact form submission |
| `/api/admin/login` | POST | Admin login page | Admin authentication |
| `/api/admin/logout` | POST | Admin logout page | Clear session cookie |

## Data Flow

- **Volunteer & Contact forms**: Submit via fetch to `/api/volunteer` and `/api/contact`
- **Admin dashboard**: Uses Prisma directly in Server Component (no API calls)
- **Admin auth**: Login sets cookie via `/api/admin/login`; logout clears via `/api/admin/logout`

## Removed (Orphaned)

- `/api/admin/volunteers` – Not used; admin dashboard fetches via Prisma
- `/api/admin/contacts` – Not used; admin dashboard fetches via Prisma
