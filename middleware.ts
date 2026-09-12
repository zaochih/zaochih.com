// Vercel Edge Middleware — redirects "/" to the best-matching locale route
// based on the Accept-Language request header, before any static file is
// served. This is what makes the redirect work with JS disabled and without
// a client-side round trip; src/pages/index.astro's script is the fallback
// for environments that don't run this (local `astro dev`/`preview`, or the
// static output hosted somewhere other than Vercel).
type SupportedLocale = 'zh-CN' | 'zh-TW' | 'en-US';

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

export const config = {
  matcher: ['/'],
};

export default function middleware(request: Request) {
  const locale = pickLocale(request.headers.get('accept-language') ?? '');
  return Response.redirect(new URL(`/${locale}/`, request.url), 307);
}
