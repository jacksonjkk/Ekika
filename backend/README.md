# Ekika Backend

Zero-external-dependency Node API for the Ekika website. It uses Node's built-in SQLite module and creates `backend/data/ekika.db` automatically.

## Features

- Public site settings, experiences, and gallery APIs
- Server-calculated bookings with deposit or full-payment totals
- Hashed secure customer portal tokens
- Supabase email OTP login with booking-scoped HTTP-only sessions
- Payment sessions, idempotency, manual bank transfers, and signed webhooks
- Admin JWT authentication with scrypt password hashes
- Site, experience, booking, gallery, inquiry, and image-upload management
- Audit logging, CORS restrictions, rate limits, security headers, and input validation
- SQLite foreign keys, constraints, indexes, and WAL mode

## Setup

```bash
cp backend/.env.example backend/.env
npm run dev:backend
```

Change `ADMIN_PASSWORD`, `JWT_SECRET`, and `PAYMENT_WEBHOOK_SECRET` before any deployment. Unsafe defaults cause startup failure when `NODE_ENV=production`.

Default development admin email: `admin@ekikaexperience.ug`.

## Supabase email OTP with Brevo

1. In Supabase, open **Authentication > SMTP Settings** and enable Custom SMTP.
2. Enter the Brevo host `smtp-relay.brevo.com`, port `587`, your Brevo SMTP username, and your Brevo SMTP key.
3. Set a verified sender email and sender name.
4. In **Authentication > Email Templates**, edit the Magic Link template so it includes the six-digit token using `{{ .Token }}`.
5. Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `backend/.env`.
6. Adjust the Supabase authentication email rate limit for expected booking traffic.

Example template content:

```html
<h2>Your Ekika verification code</h2>
<p style="font-size: 32px; font-weight: bold; letter-spacing: 8px;">{{ .Token }}</p>
<p>This code opens your booking dashboard.</p>
```

Brevo credentials remain in Supabase and are not stored in this application.

## Main routes

Public:

- `GET /api/health`
- `GET /api/site`
- `GET /api/experiences`
- `GET /api/experiences/:id`
- `GET /api/gallery`
- `GET /api/uploads/:filename`
- `POST /api/contact`
- `POST /api/bookings`
- `POST /api/portal-auth/request-otp`
- `POST /api/portal-auth/verify-otp`
- `GET /api/customer/portal`
- `POST /api/customer/logout`
- `GET /api/customer/session`
- `GET /api/portal/:token`
- `POST /api/portal/:token/payments`
- `POST /api/webhooks/payments/:provider`

Admin bearer token required:

- `POST /api/admin/login`
- `GET|PUT /api/admin/site`
- `GET|POST /api/admin/experiences`
- `PUT|DELETE /api/admin/experiences/:id`
- `GET /api/admin/bookings`
- `GET|PATCH /api/admin/bookings/:id`
- `POST /api/admin/bookings/:id/portal-token`
- `GET|POST /api/admin/gallery`
- `PUT|DELETE /api/admin/gallery/:id`
- `POST /api/admin/uploads`
- `GET /api/admin/inquiries`
- `PATCH /api/admin/inquiries/:id`

## Booking request

```json
{
  "experienceId": "food-cooking",
  "guestName": "Guest Name",
  "email": "guest@example.com",
  "phone": "+256700000000",
  "guestCount": 2,
  "preferredDate": "2026-12-20",
  "specialRequests": "Vegetarian lunch",
  "paymentChoice": "deposit"
}
```

The API ignores client prices and calculates the total from the selected database experience.

## Payments

`PAYMENT_PROVIDER=mock` supports local end-to-end testing. Bank transfer creates a pending manual payment. Card and mobile-money production charging require implementing the provider call in `src/payment-provider.js` and configuring that provider's credentials.

Webhooks must include `X-Ekika-Signature`, an HMAC-SHA256 hex digest of the raw JSON body using `PAYMENT_WEBHOOK_SECRET`.

## Image uploads

Send authenticated JSON to `POST /api/admin/uploads`:

```json
{
  "mimeType": "image/webp",
  "contentBase64": "BASE64_DATA"
}
```

JPEG, PNG, and WebP files up to 15 MB are accepted, including high-resolution originals. File signatures are checked before storage.

## Deployment notes

- Persist the `backend/data` and `backend/uploads` directories.
- Put the API behind HTTPS and a reverse proxy.
- Set the exact frontend URL in `FRONTEND_ORIGIN`; comma-separate multiple allowed origins.
- When frontend and API use different HTTPS domains, production cookies use `SameSite=None; Secure` automatically.
- Back up the SQLite database and uploads together.
- Use a process manager or container restart policy.
- For multiple API instances or very high booking volume, replace SQLite and the in-memory rate limiter with PostgreSQL and a shared rate-limit store.
