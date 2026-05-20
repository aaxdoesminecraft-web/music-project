This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Backend Scaffold

The repo now includes a provider-agnostic backend scaffold under `lib/server`
and `lib/types` for the four current screen flows in the designs:

- dashboard
- library
- artist spotlight
- discovery map

The music source is locked to `Jamendo` through `lib/server/jamendo`, but the
rest of the app depends on app-level models and service contracts instead of
Jamendo response fields directly.

Environment variables:

```bash
JAMENDO_CLIENT_ID=
JAMENDO_BASE_URL=https://api.jamendo.com/v3.0
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_SCHEMA=public
DEV_USER_ID=
```

Concrete repository implementations now live in:

- `lib/server/repositories/supabase-user-library-repository.ts`
- `lib/server/repositories/static-discovery-repository.ts`

`lib/server/sql/schema.sql` contains the initial Supabase table layout expected
by the repository layer.

The backend also exposes `app/api/...` route handlers for:

- `GET /api/dashboard`
- `GET /api/library`
- `GET /api/discovery`
- `GET /api/artists/:artistId`
- `POST|DELETE /api/artists/:artistId/follow`
- `GET|POST /api/playlists`
- `GET|POST|DELETE /api/playlists/:playlistId/tracks`
- `POST|DELETE /api/tracks/:trackId/favorite`
- `GET|POST /api/player/queue`
- `POST /api/player/recently-played`

For development, provide the user through the `x-user-id` header or set
`DEV_USER_ID` in `.env.local`.
