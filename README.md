# Champs Construction

Website for Champs Construction (Harare): turnkey home construction for Zimbabweans
in the diaspora and at home. Live at https://champs.digitsdigital.co.zw

Frontend from the Fabish House Finishings site (same layout, fonts and animations,
rebranded charcoal + yellow). Backend from Elite Gutters ZW: TanStack Start on a
Cloudflare Worker with D1 (data) and R2 (photo uploads), plus an owner dashboard at
`/admin` (see `docs/admin-access.md`).

## Where to edit things

| What | Where |
| --- | --- |
| Enquiries, project photos, testimonials, phones, email, founder, stats, The Burbs details | Owner dashboard, `/admin` (no redeploy) |
| Site copy, services, process, FAQs, trust pillars | `src/lib/site-data.ts` |
| Fallback values when D1 is unreachable | `src/data/site-data.ts` |
| Brand colours | `src/styles.css` → `:root` |
| Logo / favicon / OG image | `src/assets/champs-logo.svg`, `public/` |

Every photo on the site is a real Champs photo. The section backgrounds and hero use
the project photos in `public/images/projects/`; project pages, the team and the
Before/During/After strip are managed from the dashboard.

## Commands

```sh
bun install
bun run dev        # UI only (D1 not available, fallback content is shown)
bun run local      # full stack locally: build + local D1/R2 (needs .dev.vars ADMIN_SECRET=...)
bun run deploy     # build + deploy to champs.digitsdigital.co.zw
npx wrangler d1 migrations apply champs-construction --remote -c .output/server/wrangler.json
node scripts/set-password.mjs "new password"   # reset the dashboard password
```
