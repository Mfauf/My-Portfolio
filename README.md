# mmfauf.com

Personal portfolio for **Muhammad Auf** — Computer Engineering student at Qatar University
and freelance web developer.

Built with **React 19 + TypeScript + Tailwind CSS v4**, animated with Framer Motion and
Lenis. Fully bilingual (English / العربية with RTL mirroring) and themed light / dark
following the operating system by default.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build locally
npm run cms      # Keystatic admin UI — http://localhost:3000/keystatic
```

---

## Editing the content

**You should almost never need to touch a component.** Everything the site displays lives
in `src/data/*.json`. Each file is plain JSON, and every visible string is a pair:

```json
{ "en": "English text", "ar": "النص العربي" }
```

Edit the JSON by hand, or through the **Keystatic CMS** (see below) — either way, save and
the page updates. Types for every file live in `src/types/content.ts` — if you add a field
there, TypeScript will tell you where it needs to be used.

| File | What it controls |
| --- | --- |
| `src/data/profile.json` | Name, roles in the hero rotator, bio, location, availability pill, contact details, CV link, languages, the four stat counters |
| `src/data/social.json` | Social links (WhatsApp, LinkedIn, GitHub, email) with their brand colours |
| `src/data/services.json` | The three service packages: price, delivery time, feature list, live example |
| `src/data/addons.json` | Paid add-ons, free inclusions, and the working terms |
| `src/data/skills.json` | Skill groups and their icons |
| `src/data/projects.json` | Project showcase: title, description, screenshot, tags, links |
| `src/data/certificates.json` | Certificates grid contents |
| `src/data/experience.json` | Work and volunteering timeline |
| `src/data/education.json` | Education entries with grades |
| `src/data/process.json` | The four "how it works" steps |

Interface labels (nav, buttons, form fields, section headings) live separately in
`src/i18n/en.json` and `src/i18n/ar.json`.

### Adding a project

1. Drop the screenshot into `public/projects/`.
2. Append an entry to `src/data/projects.json`:

```json
{
  "id": "unique-slug",
  "title": { "en": "Project name", "ar": "اسم المشروع" },
  "tagline": { "en": "One line", "ar": "سطر واحد" },
  "description": { "en": "…", "ar": "…" },
  "image": "/projects/your-screenshot.png",
  "url": "https://example.com",
  "repo": "",
  "year": 2026,
  "featured": true,
  "tags": ["React", "Supabase"],
  "category": { "en": "Web App", "ar": "تطبيق ويب" }
}
```

Both Projects and Certificates only render the first 3 entries by default, with a "View
more" button to reveal the rest — the constant to change is `DEFAULT_VISIBLE` at the top of
`src/sections/Projects.tsx` / `src/sections/Certificates.tsx`.

### Adding a certificate

Append to `src/data/certificates.json`. `category` must be one of `ai`, `engineering`,
`academic`, `leadership`, `volunteer`, `quran` — the filter chips are generated from
whichever categories are actually present. Set `image` to a path under `public/` once you
have a scan; entries with an empty `image` sit out of the gallery entirely until they do.

---

## Content CMS (Keystatic)

`cms/` is a small [Keystatic](https://keystatic.com) admin — a form UI over the exact same
`src/data/*.json` files described above. It's a fully separate Next.js project (own
`package.json`, `node_modules`, `tsconfig.json`) kept isolated from the Vite app on purpose,
and it's deployed independently too — as its own Cloudflare Worker, not bundled with the
static site build.

**Production:** [https://mmfauf-cms.mmfauf.workers.dev](https://mmfauf-cms.mmfauf.workers.dev)
— log in with GitHub, edit, save. Every save commits straight to this repo over the GitHub
API (`storage: { kind: 'github' }` in `cms/keystatic.config.ts`), which triggers the
portfolio's existing Cloudflare Pages build automatically — no local checkout, no manual
git push required.

**Local dev**, for previewing changes before they go live:

```bash
npm run cms   # http://localhost:3000/keystatic — also commits to GitHub, same as production
```

Each JSON file appears as a "singleton" in the sidebar — `profile`, `addons`,
`certificates`, `education`, `experience`, `process`, `projects`, `services`, `skills`,
`social` — matching the table above one-to-one. Array-shaped files (certificates, projects,
experience, …) show up as a repeater list you can add, remove, reorder and edit inline; the
underlying JSON stores that list under an `"items"` key.

### How it's wired up

- **GitHub App**: [github.com/apps/mauf-keystatic](https://github.com/apps/mauf-keystatic)
  handles authentication and grants write access to `Mfauf/Portoflio`. Its Client ID/Secret
  and the `KEYSTATIC_SECRET` session key live in `cms/.env` locally (gitignored — copy
  `cms/.env.example` and fill in real values, or re-run the "Create GitHub App" flow from
  `/keystatic` if you need fresh ones) and as Worker secrets in production.
- **Cloudflare Worker**: deployed with [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare),
  configured in `cms/wrangler.jsonc`. To redeploy after code changes:
  ```bash
  cd cms
  npm run deploy
  ```
- **Worker secrets** (`KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`,
  `KEYSTATIC_SECRET`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`) are set via
  `wrangler secret put <NAME>` from inside `cms/`, one at a time — **not** in the Cloudflare
  dashboard's Pages project for the portfolio site itself. Those are two separate Cloudflare
  projects; the portfolio's Pages project only ever serves the static `dist/` build and has
  no use for Keystatic's env vars.
- **Domain**: currently the default `*.workers.dev` URL. A `cms.mmfauf.com` custom domain
  needs `mmfauf.com`'s nameservers pointed at Cloudflare first (`mmfauf.com` isn't a
  Cloudflare zone today — the existing `www.mmfauf.com` / `qfl.mmfauf.com` subdomains work
  via Cloudflare Pages' external-DNS custom domains, which don't require that; Workers
  custom domains do). If that ever changes, add `"routes": [{ "pattern": "cms.mmfauf.com",
  "custom_domain": true }]` to `cms/wrangler.jsonc` and redeploy.

Image and file paths (avatars, project screenshots, certificate scans, tech icons) are
edited as plain text paths into `public/`, e.g. `/projects/example.webp` — the CMS does not
upload or manage those files for you.

---

## Project structure

```
cms/               Keystatic admin UI — a separate Next.js project, see "Content CMS" above
public/            Static assets served as-is (images, tech icons, CV + services PDFs)
src/
  data/            ← all site content, plain JSON
  i18n/            ← UI strings per language
  types/           TypeScript shapes for the JSON
  lib/             content loader, motion presets, preferences, helpers
  providers/       ThemeProvider (light/dark/system), I18nProvider (en/ar + RTL)
  hooks/           smooth scroll, active section, media queries, count-up
  components/
    ui/            Section, Button, Card, Badge, Marquee, Reveal, SplitText, Icon, …
    effects/       AuroraBackground, CursorGlow, ScrollProgress, NameParticles
    layout/        Header, Footer, FloatingActions, theme + language toggles
  sections/        Hero, About, Services, Skills, Journey, Projects,
                   Certificates, Process, Contact
```

### Theme and language

Both preferences persist to `localStorage` (`mmfauf:theme`, `mmfauf:lang`). A small inline
script in `index.html` applies them **before first paint** so there is no flash of the wrong
theme or text direction — if you change the storage keys in `src/lib/preferences.ts`, change
them there too.

The theme toggle cycles `system → light → dark`. On `system` the site follows the OS and
keeps following it if it changes while the page is open.

### The footer signature

`src/components/effects/NameParticles.tsx` rasterises the name into an offscreen canvas,
samples its opaque pixels onto a grid, and turns each one into a gold particle held in place
by a spring. Move the pointer over it to scatter the letters; click for a burst. It only
animates while it is on screen, and it renders a single static frame when the visitor has
asked for reduced motion.

---

## Accessibility & motion

- Every animation is transform/opacity based and honours `prefers-reduced-motion`; Lenis
  smooth scrolling is skipped entirely for those visitors.
- There is a skip link, visible focus rings, and the nav marks the current section with
  `aria-current`.

## Contact form

The form posts JSON to [Web3Forms](https://web3forms.com) and reports success or failure
inline instead of navigating away. The access key in `src/sections/Contact.tsx` is public by
design. A hidden `botcheck` honeypot field filters out basic spam.

## Deploying

`npm run build` emits a static site into `dist/`.

- **Cloudflare Pages** — build command `npm run build`, output directory `dist`.
  `public/_redirects` is included so deep links fall back to `index.html`.
- Any static host works the same way; just serve `dist/`.
