---
name: Supabase catalogue security
description: Authentication and private image access conventions for this product
---

The browser uses Supabase Auth for the session, but catalogue/admin data must flow through the API so bearer tokens are verified server-side. Product images remain in a private Storage bucket and are exposed only through short-lived signed URLs. The public Supabase client configuration is served by the API because secret-backed environment values are not reliably injected into the Vite browser bundle.

**Why:** Frontend-only route guards are not sufficient for a private catalogue, and direct public image URLs would bypass the intended access boundary.

**How to apply:** Keep RLS enabled on profiles, vendors, products, and storage objects; enforce admin access from the profile role on the server and in database policies.