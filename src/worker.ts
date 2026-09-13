/// <reference types="@cloudflare/workers-types" />
// Cloudflare Worker in front of the static build (see wrangler.jsonc's
// assets.run_worker_first: true — every request passes through here first).
// Handles two things static assets alone can't:
//   1. www.zaochih.com / zaochih.com / caozhi.li / www.caozhi.li / about.caozhi.li
//      -> about.zaochih.com (host canonicalization)
//   2. "/" -> best-matching locale route, based on Accept-Language
//
// The host check only matches the literal legacy hostnames, not "anything
// that isn't about.zaochih.com" — that keeps *.workers.dev preview/version
// URLs (and local `wrangler dev`) working unredirected.
type SupportedLocale = 'zh-CN' | 'zh-TW' | 'en-US';

const CANONICAL_HOST = 'about.zaochih.com';
const REDIRECT_HOSTS = new Set([
  'zaochih.com',
  'www.zaochih.com',
  'caozhi.li',
  'www.caozhi.li',
  'about.caozhi.li',
]);

function pickLocale(acceptLanguage: string): SupportedLocale {
  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=');
      const weight = q ? parseFloat(q) : 1;
      return {
        tag: tag?.trim() ?? '',
        weight: Number.isNaN(weight) ? 1 : weight,
      };
    })
    .sort((a, b) => b.weight - a.weight);

  for (const { tag } of ranked) {
    if (!tag) continue;
    if (/^zh/i.test(tag)) {
      return /TW|HK|Hant/i.test(tag) ? 'zh-TW' : 'zh-CN';
    }
    if (/^en/i.test(tag)) {
      return 'en-US';
    }
  }
  return 'en-US';
}

interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    if (REDIRECT_HOSTS.has(url.hostname)) {
      url.hostname = CANONICAL_HOST;
      if (url.pathname === '/') {
        url.pathname = `/${pickLocale(request.headers.get('accept-language') ?? '')}/`;
      }
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === '/') {
      const locale = pickLocale(request.headers.get('accept-language') ?? '');
      return Response.redirect(new URL(`/${locale}/`, url), 307);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
