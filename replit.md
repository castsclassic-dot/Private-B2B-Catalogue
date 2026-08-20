# Private Jewelry Catalogue

A private B2B jewellery catalogue for approved buyers, vendors, and administrators.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/jewelry-catalogue run dev` — run the catalogue website
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- Apply `supabase/schema.sql` in the Supabase SQL editor before creating users and catalogue records.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS
- API: Express 5
- Auth, database, and private storage: Supabase
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/jewelry-catalogue` — responsive catalogue, login, vendor, and admin UI
- `artifacts/api-server` — server-side Supabase token checks, catalogue endpoints, and signed image URLs
- `lib/api-spec/openapi.yaml` — API contract source of truth
- `supabase/schema.sql` — Supabase tables, RLS policies, private storage bucket, and auth profile trigger

## Architecture decisions

- The browser uses Supabase Auth for sign-in, but catalogue and admin data are only returned by API routes that verify the bearer token server-side.
- Product image files are stored in a private Supabase Storage bucket; the API returns short-lived signed URLs instead of public URLs.
- Admin authorization is enforced by the `profiles.role` value and repeated in Supabase RLS policies.

## Product

- Approved users can sign in, browse published products, search/filter the catalogue, and view product details.
- Vendors have a dedicated workspace view; administrators can review vendor and product inventory.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Supabase schema and RLS policies must be applied before API data requests can succeed.
- The first administrator must be assigned `role = 'admin'` in `public.profiles` after their auth account is created.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
