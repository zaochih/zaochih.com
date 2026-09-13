/// <reference types="@cloudflare/workers-types" />
// Cloudflare Worker in front of the static build (see wrangler.jsonc's
// assets.run_worker_first: true — every request passes through here first).
// Handles four things static assets alone can't:
//   1. legacy hostnames -> about.zaochih.com (host canonicalization)
//   2. "/" -> best-matching locale route, based on Accept-Language
//   3. "/en" -> /en-US, "/zh" -> /zh-CN or /zh-TW based on Accept-Language
//   4. 404s -> trim the static 404 page down to the one language line that
//      matches Accept-Language, when one of the three actually matches
//
// The host check only matches the literal legacy hostnames, not "anything
// that isn't about.zaochih.com" — that keeps *.workers.dev preview/version
// URLs (and local `wrangler dev`) working unredirected.
//
// Legacy hosts split into two groups by how permanent the redirect is safe
// to be:
//   - PERMANENT_REDIRECT_HOSTS: dedicated "about" subdomains that will only
//     ever point here, so a 301 (cached indefinitely, full SEO signal
//     transfer) is safe. Locale is deliberately NOT folded into this hop —
//     baking today's Accept-Language pick into a permanently-cached redirect
//     would freeze the locale for anyone whose browser hard-caches the 301,
//     so this just lands on canonical "/" and lets the 307 branch below
//     pick the locale fresh on the second hop.
//   - TEMPORARY_REDIRECT_HOSTS: bare domains/`www` that might get
//     repurposed for something other than this redirect later, so they use
//     307 (not permanently cached) even though the redirect is expected to
//     be long-lived in practice. Since a 307 is never cached long-term
//     anyway, locale can be folded into the same hop with no downside.
type SupportedLocale = 'zh-CN' | 'zh-TW' | 'en-US';

const CANONICAL_HOST = 'about.zaochih.com';

const PERMANENT_REDIRECT_HOSTS = new Set(['about.caozhi.li', 'about.zhih.dev']);

const TEMPORARY_REDIRECT_HOSTS = new Set([
  'zaochih.com',
  'www.zaochih.com',
  'caozhi.li',
  'www.caozhi.li',
]);

function rankLanguages(acceptLanguage: string): string[] {
  return acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=');
      const weight = q ? parseFloat(q) : 1;
      return {
        tag: tag?.trim() ?? '',
        weight: Number.isNaN(weight) ? 1 : weight,
      };
    })
    .filter(({ tag }) => tag)
    .sort((a, b) => b.weight - a.weight)
    .map(({ tag }) => tag);
}

function chineseVariantFor(tag: string): 'zh-CN' | 'zh-TW' {
  return /TW|HK|Hant/i.test(tag) ? 'zh-TW' : 'zh-CN';
}

// Returns the first ranked tag that actually matches one of our three
// locales, or null if none of them do — distinct from pickLocale's
// always-guess-something behavior, needed below to tell "the visitor wants
// Chinese" apart from "no signal either way".
function matchLocale(rankedTags: string[]): SupportedLocale | null {
  for (const tag of rankedTags) {
    if (/^zh/i.test(tag)) return chineseVariantFor(tag);
    if (/^en/i.test(tag)) return 'en-US';
  }
  return null;
}

function pickLocale(acceptLanguage: string): SupportedLocale {
  return matchLocale(rankLanguages(acceptLanguage)) ?? 'en-US';
}

// For /zh specifically: the visitor already said "Chinese", so unlike
// matchLocale (which would rather answer "en-US" if English outranks every
// Chinese tag), this hunts specifically for the first Chinese-family tag —
// wherever it ranks — and only asks simplified-vs-traditional. No Chinese
// tag at all (e.g. Accept-Language: en, but the visitor typed /zh by hand)
// falls back to zh-CN, matching chineseVariantFor's own default.
function pickChineseVariant(rankedTags: string[]): 'zh-CN' | 'zh-TW' {
  const firstChinese = rankedTags.find((tag) => /^zh/i.test(tag));
  return firstChinese ? chineseVariantFor(firstChinese) : 'zh-CN';
}

interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    if (PERMANENT_REDIRECT_HOSTS.has(url.hostname)) {
      url.hostname = CANONICAL_HOST;
      return Response.redirect(url.toString(), 301);
    }

    if (TEMPORARY_REDIRECT_HOSTS.has(url.hostname)) {
      url.hostname = CANONICAL_HOST;
      if (url.pathname === '/') {
        url.pathname = `/${pickLocale(request.headers.get('accept-language') ?? '')}/`;
      }
      return Response.redirect(url.toString(), 307);
    }

    if (url.pathname === '/') {
      const locale = pickLocale(request.headers.get('accept-language') ?? '');
      return Response.redirect(new URL(`/${locale}/`, url), 307);
    }

    // Bare /en and /zh shorthands. Both 307, not 301 — unlike the legacy
    // hostnames above, the locale *codes* themselves (en-US, zh-CN, zh-TW)
    // aren't a permanent fact; if they're ever renamed (e.g. en-US ->
    // en-us), a permanently-cached 301 to the old code would be stuck in
    // visitors' browsers with no way to reissue it.
    if (url.pathname === '/en' || url.pathname === '/en/') {
      return Response.redirect(new URL('/en-US/', url), 307);
    }

    if (url.pathname === '/zh' || url.pathname === '/zh/') {
      const variant = pickChineseVariant(
        rankLanguages(request.headers.get('accept-language') ?? ''),
      );
      return Response.redirect(new URL(`/${variant}/`, url), 307);
    }

    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;

    // The 404 page's content depends on Accept-Language below (either
    // trimmed to one line or left as all three), so every 404 response —
    // not just the trimmed ones — needs to advertise that to any cache
    // sitting in front of it.
    const headers = new Headers(response.headers);
    headers.append('vary', 'Accept-Language');

    const matched = matchLocale(
      rankLanguages(request.headers.get('accept-language') ?? ''),
    );
    // The language list (<li>) shows all three when nothing matches — it's
    // a menu of options, so "we don't know" means "show them all". The QRU
    // gloss (<span>) is a single caption, not a menu, so it always resolves
    // to exactly one language, falling back to en-US like pickLocale does.
    const glossLocale = matched ?? 'en-US';

    const trimmed = new HTMLRewriter()
      .on('html', {
        element(el) {
          el.setAttribute('lang', glossLocale);
        },
      })
      // When exactly one locale matched, unwrap <ul>/<li> down to a plain
      // <p> — a list of one item is just the item, and a screen reader
      // shouldn't announce "list, 1 item" for a single line. Swapping in a
      // real <p> (rather than leaving the text/link loose) matters here:
      // <article> is a flex column, and a flex container blockifies *any*
      // direct element child, inline or not — loose text/<a> children would
      // each become their own full-width flex item instead of flowing as
      // one line. A single wrapping element keeps that stretching contained
      // to itself, with normal inline layout for its own content.
      // Left alone (real list, real items) when nothing matched, since
      // that's a genuine menu of three language options.
      .on('main ul', {
        element(el) {
          if (!matched) return;
          el.before('<p class="text-fg-muted">', { html: true });
          el.after('</p>', { html: true });
          el.removeAndKeepContent();
        },
      })
      .on('main li[lang]', {
        element(el) {
          if (!matched) return;
          if (el.getAttribute('lang') !== matched) {
            el.remove();
          } else {
            el.removeAndKeepContent();
          }
        },
      })
      .on('main span[lang]', {
        element(el) {
          if (el.getAttribute('lang') !== glossLocale) el.remove();
        },
      })
      .transform(response);

    return new Response(trimmed.body, { status: trimmed.status, headers });
  },
} satisfies ExportedHandler<Env>;
