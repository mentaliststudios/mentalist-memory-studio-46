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

- App shell lives in `src/components/layout/AppShell.tsx`, wrapped around `<Outlet />` in `__root.tsx`; pages never render their own nav — keeps one sidebar/bottom-nav source.
- Primary nav items come only from `src/config/navigation.ts`; sidebar (md rail, lg full) and mobile bottom nav both read it — add a section there plus its route file.
- `/` redirects to `/dashboard` in `src/routes/index.tsx` `beforeLoad` — the Dashboard is the canonical home URL.
- Static content (techniques, training categories, palace rooms, assistant prompts) lives in `src/config/*.ts` so it can later be swapped for backend data without touching page layout.
- Shared UI building blocks live in `src/components/common/`; section accent colors go through `src/lib/accents.ts` — keeps accent usage consistent and Tailwind-visible.
- All colors, radii, shadows and fonts are tokens in `src/styles.css` (`panel`, `bg-hero`, `bg-dots` utilities included); components use semantic classes only.
- Metrics render through empty placeholders (`StatPlaceholder`, `ProgressIndicator value={null}`) until real data exists — never hardcode numbers.
