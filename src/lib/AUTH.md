# Admin Authentication (Next.js 15)

## Architecture

- **Cookie**: `admin_auth` (HMAC-signed JSON, 24h expiry)
- **Cookie rules**: `set()` and `delete()` **only** in Route Handlers.

## Files

| File | Role |
|------|------|
| `auth.ts` | Token create/verify, session read. No cookie mutations. |
| `auth-edge.ts` | Edge-compatible verification for middleware. |
| `api/admin/login/route.ts` | Sets `admin_auth` cookie on successful login. |
| `api/admin/logout/route.ts` | Deletes `admin_auth` cookie. |
| `middleware.ts` | Validates token, protects `/admin/*` (except login). |

## Flow

- **Login**: POST `/api/admin/login` → verify password → create token → `cookies().set()` in route.
- **Logout**: POST `/api/admin/logout` → `cookies().delete()` in route → client redirects to `/admin/login`.
- **Protection**: Middleware runs `verifyAdminSession()` (signature + expiry) before allowing `/admin` access.

## Security

- httpOnly, sameSite=lax, secure in production
- HMAC-SHA256 signed tokens
- No cookie mutations in Server Components or shared utilities
