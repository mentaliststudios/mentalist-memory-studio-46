<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- App shell lives in `src/components/layout/AppShell.tsx`, rendered by the `src/routes/_authenticated/route.tsx` layout; pages never render their own nav and auth pages render without it — keeps one sidebar/bottom-nav source.
- Primary nav items come only from `src/config/navigation.ts`; sidebar (md rail, lg full) and mobile bottom nav both read it — add a section there plus its route file.
- `/` redirects to `/dashboard` in `src/routes/index.tsx` `beforeLoad` — the Dashboard is the canonical home URL.
- App sections live under `src/routes/_authenticated/` (client-only gate, redirects to `/login?redirect=…`); auth pages (`/login`, `/signup`, `/forgot-password`, `/reset-password`) are top-level — database row security stays the real protection.
- Auth state comes from the single `AuthProvider` (`src/lib/auth/`) in `__root.tsx`; no other `onAuthStateChange` listeners. Post-login targets always pass through `safeRedirectPath` — blocks open redirects and login loops.
- Profiles are created by the `on_auth_user_created` trigger; `ensure_my_profile()` reconciles missing ones on sign-in. Users never insert profiles directly — no client-trusted profile IDs.
- Auth errors shown to users go through `friendlyAuthError`; signup and password-reset responses stay identical for registered and unregistered emails — prevents account enumeration.
- Static content (techniques, training categories, palace rooms, assistant prompts) lives in `src/config/*.ts` so it can later be swapped for backend data without touching page layout.
- Shared UI building blocks live in `src/components/common/`; section accent colors go through `src/lib/accents.ts` — keeps accent usage consistent and Tailwind-visible.
- All colors, radii, shadows and fonts are tokens in `src/styles.css` (`panel`, `bg-hero`, `bg-dots` utilities included); components use semantic classes only.
- Metrics render through empty placeholders (`StatPlaceholder`, `ProgressIndicator value={null}`) until real data exists — never hardcode numbers.
- User-owned tables reference `public.profiles(id)` for `user_id` (profiles cascades from `auth.users`), never `auth.users` directly — Lovable Cloud schema rule; account deletion still cascades.
- Child tables reference parents through composite `(parent_id, user_id)` FKs onto `UNIQUE (id, user_id)` — the database, not the UI, prevents linking to another user's rows. Keep this pattern for new user-owned tables.
- Schema changes go through new migrations in `drizzle/migrations/`; the shared `public.set_updated_at()` trigger function is reused for every `updated_at` column.
