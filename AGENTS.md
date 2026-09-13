# AGENTS.md

You are an expert in Astro, TypeScript, Tailwind CSS, and static web development. You write maintainable, performant, and accessible code.

## Project Overview

This is a static personal profile site built with Astro. The project uses:

- **Build Tool / Framework**: Astro (static output, no client-side framework runtime)
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite`), plus a small set of CSS custom properties for theme tokens
- **Internationalization**: hand-rolled, path-based (`/zh-CN/`, `/zh-TW/`, `/en-US/`), content lives in `src/data/index.ts`
- **Type Safety**: TypeScript with Astro's strict tsconfig preset

## Architecture

### Project Structure

- `src/data/index.ts` - all page content for every locale (tagline, bio, contact, tags, languages, visited regions); edit here for copy changes
- `src/utils/richText.ts` - parses the small inline-tag syntax (`<b>`, `<code>`, `<a href="…">`, `<rainbow>`) used inside `bio.template` and tag strings
- `src/icons.ts` - two icon registries: `ICONS` (neutral lucide-derived stroke icons, tinted via `currentColor`) and `BRAND_ICONS` (self-colored brand marks: X/Twitter, LinkedIn)
- `src/layouts/Base.astro` - HTML shell: head/meta (SEO, Open Graph/Twitter, hreflang), `ClientRouter` for view-transition page swaps, theme-flash-prevention script, page container
- `src/components/Profile.astro` - renders the whole profile page body for a given locale
- `src/components/RichText.astro` - renders one `parseRichText` token stream (bold/code/rainbow/link) as markup
- `src/components/Icon.astro` - renders one icon from either registry in `src/icons.ts`
- `src/components/ThemeToggle.astro` - client-side theme cycle (auto/light/dark), persisted to `localStorage`, crossfades via the View Transitions API
- `src/components/LangToggle.astro` - locale switcher (native `<details>`, links to the other locale routes)
- `src/pages/zh-CN/index.astro`, `src/pages/zh-TW/index.astro`, `src/pages/en-US/index.astro` - one static page per locale
- `src/pages/index.astro` - `/` root: client-side redirect to the browser's preferred locale, with a no-JS link fallback (used locally and on non-Vercel hosts)
- `middleware.ts` - Vercel Edge Middleware: redirects `/` to the best-matching locale based on the `Accept-Language` header, before any static file is served (the primary path in production; `src/pages/index.astro` is the fallback)
- `src/styles/global.css` - Tailwind entrypoint + theme CSS variables (`--bg`, `--fg`, etc.) switched via `[data-theme]` / `prefers-color-scheme`, plus the `.rich-link` hover effect and the `::details-content` dropdown transition

### Key Features

- Multi-language support (English, Simplified Chinese, Traditional Chinese) via static per-locale routes, with an edge-side `Accept-Language` redirect at `/`
- Client-side navigation between locale/pages via Astro's `ClientRouter` (View Transitions), falling back to a normal full navigation without JS
- Theme mode: auto (follows system) / light / dark, no flash-of-wrong-theme on load, crossfades on toggle
- No client-side framework or hydration — every page is static HTML; the only JS is the toggle scripts and the outside-click-to-close handler

## Commands

- `npm run dev` - start the Astro dev server
- `npm run build` - build the static site to `dist/`
- `npm run preview` - preview the production build locally (static files only — does not run `src/worker.ts`)
- `npm run preview:worker` - build, then preview through the actual Cloudflare Worker (`wrangler dev`) — needed to test anything in `src/worker.ts` (host redirects, locale redirects, 404 handling)
- `npm run lint` - lint with ESLint (`eslint-plugin-astro` + `typescript-eslint`)
- `npm run format` - format with Prettier

## Development Guidelines

### Code Style

- Prefer plain Astro components (`.astro`) over client-side JS; only reach for a `<script>` block when the interaction genuinely needs to run in the browser (theme/locale toggles)
- Style with Tailwind utility classes; use the semantic color tokens (`bg`, `bg-muted`, `fg`, `fg-muted`, `fg-subtle`, `border`, `border-strong`, `ring`) defined in `src/styles/global.css` instead of raw hex values, so light/dark stay in sync
- Keep content (copy, contact info, visited regions) in `src/data/index.ts`, not hardcoded in components
- For copy that needs inline bold/link/code/rainbow styling, use the `<b>`/`<a href="…">`/`<code>`/`<rainbow>` tags supported by `parseRichText`, not ad hoc markup in the component
- Follow ESLint and Prettier configurations

### Astro view transitions

- `Base.astro` includes `<ClientRouter fallback="swap" />`, so any inline `<script>` whose content is byte-identical across pages (which is every per-component script here, since they're not templated per-locale) only ever executes once — see the comments in `ThemeToggle.astro` and `LangToggle.astro`. New per-page scripts must re-query the DOM at call time (not cache element references) and bind listeners on `document`/`window` (which persist across transitions) rather than on the element itself
- Transition swaps also reset any runtime-set `<html>`/`<body>` attribute that isn't part of the incoming page's static markup (e.g. `data-theme`) — reapply such state on the `astro:after-swap` event

### Internationalization

- All three locales (`zh-CN`, `zh-TW`, `en-US`) are entries in the single `profile` record in `src/data/index.ts` — when adding a field, add it for all three locales in the same edit
- zh-TW is written for a Taiwan-reading audience, not a straight simplified→traditional character conversion — mainland-specific terms and phrasing get re-localized (e.g. the major name), while real proper nouns (place names, the university's actual name) are just script-converted
- Locale routing is static/path-based; there is no runtime language switch, only navigation between `/zh-CN/`, `/zh-TW/`, `/en-US/`

### Design constraints (carried over from the redesign)

- No card containers, no badge walls, no gradients/glows, no emoji
- Neutral zinc-scale palette; almost no brand/accent color, except the two intentional exceptions: the `@handle` badge (brand blue) and the X/LinkedIn brand marks in the contact row
- Body text font stack leads with `'Google Sans Flex'` but with no `@font-face`/webfont backing it at all — no url() src, no file, no Google Fonts link. It's there only for visitors who happen to have it installed locally; everyone else falls through immediately to the system stack (`-apple-system`/`BlinkMacSystemFont`/`Segoe UI`, per-locale PingFang SC/TC / Microsoft YaHei/JhengHei UI for CJK). A self-hosted webfont (even base64-inlined, with `font-display` tuned every which way) reliably still reflowed text once/if it swapped in — visibly shifting the tagline's line wrap and the contact-row icons — so there is deliberately no async font load of any kind to avoid at all; system monospace stack for eyebrows/labels, same reasoning
- Every section below the hero (languages/tags/visited regions) reads as the same plain "label / label / label" flowing list — no section is more table-like or boxed than another

### File Operations

- **NEVER use `rm` command** - It permanently deletes files without recovery
- Use `trash` command on macOS to move files to Trash (install via `brew install trash`)
- Alternative: Use `mv` to move files to a safe location before deletion
- For safe file removal: `trash <file>` instead of `rm <file>`

## Docs

- Astro: <https://docs.astro.build/>
- Tailwind CSS: <https://tailwindcss.com/docs>
