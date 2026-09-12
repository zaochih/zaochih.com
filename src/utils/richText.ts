export type RichTextToken =
  | { kind: 'text'; text: string }
  | { kind: 'bold'; text: string }
  | { kind: 'code'; text: string }
  | { kind: 'rainbow'; text: string }
  | { kind: 'link'; text: string; href: string };

const TAG_PATTERN = /<(b|code|rainbow|a)(?: href="([^"]*)")?>(.*?)<\/\1>/g;

const KIND_BY_TAG = {
  b: 'bold',
  code: 'code',
  rainbow: 'rainbow',
  a: 'link',
} as const;

/**
 * Turns a string of plain text plus `<b>…</b>` / `<code>…</code>` /
 * `<rainbow>…</rainbow>` / `<a href="…">…</a>` runs (for the parts that need
 * special display) into a flat list of tokens for rendering.
 */
export function parseRichText(template: string): RichTextToken[] {
  const tokens: RichTextToken[] = [];
  let lastIndex = 0;

  for (const match of template.matchAll(TAG_PATTERN)) {
    const [full, tag, href, text] = match as unknown as [
      string,
      keyof typeof KIND_BY_TAG,
      string | undefined,
      string,
    ];
    const index = match.index ?? 0;
    if (index > lastIndex) {
      tokens.push({ kind: 'text', text: template.slice(lastIndex, index) });
    }
    const kind = KIND_BY_TAG[tag];
    tokens.push(
      kind === 'link' ? { kind, text, href: href ?? '' } : { kind, text },
    );
    lastIndex = index + full.length;
  }
  if (lastIndex < template.length) {
    tokens.push({ kind: 'text', text: template.slice(lastIndex) });
  }

  return tokens;
}
