import { z } from "zod";

const browserPageArgumentsSchema = z.object({
  url: z.string().trim().url(),
  maxChars: z.coerce.number().int().min(200).max(20_000).default(4_000),
  includeLinks: z.coerce.boolean().default(true),
  maxLinks: z.coerce.number().int().min(1).max(25).default(8),
  includeHtml: z.coerce.boolean().default(false),
});

export type BrowserPageArguments = z.infer<typeof browserPageArgumentsSchema>;

function normalizeBrowserPageArgumentsInput(input: unknown) {
  if (typeof input !== "string") {
    return input;
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return input;
  }

  if (trimmed.startsWith("{")) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return input;
    }
  }

  return {
    url: trimmed,
  };
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function collapseWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function extractTitle(html: string) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? collapseWhitespace(decodeHtmlEntities(match[1])) : null;
}

function extractMetaContent(html: string, name: string) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const directMatch = html.match(
    new RegExp(
      `<meta[^>]+(?:name|property)=["']${escapedName}["'][^>]+content=["']([^"']+)["'][^>]*>`,
      "i",
    ),
  );

  if (directMatch) {
    return collapseWhitespace(decodeHtmlEntities(directMatch[1]));
  }

  const reversedMatch = html.match(
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${escapedName}["'][^>]*>`,
      "i",
    ),
  );

  return reversedMatch
    ? collapseWhitespace(decodeHtmlEntities(reversedMatch[1]))
    : null;
}

function stripHtml(html: string) {
  const withoutScripts = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, " ")
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, " ");

  const withBreaks = withoutScripts
    .replace(/<\/(p|div|section|article|li|h1|h2|h3|h4|h5|h6)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n");

  const text = withBreaks.replace(/<[^>]+>/g, " ");
  return collapseWhitespace(decodeHtmlEntities(text));
}

function extractLinks(html: string, baseUrl: string, maxLinks: number) {
  const results: Array<{ href: string; text: string }> = [];
  const seen = new Set<string>();
  const linkPattern = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

  for (const match of html.matchAll(linkPattern)) {
    const rawHref = match[1]?.trim();
    if (!rawHref) {
      continue;
    }

    try {
      const href = new URL(rawHref, baseUrl).toString();
      if (seen.has(href)) {
        continue;
      }

      seen.add(href);
      const text = collapseWhitespace(stripHtml(match[2] ?? ""));
      results.push({
        href,
        text,
      });

      if (results.length >= maxLinks) {
        break;
      }
    } catch {
      continue;
    }
  }

  return results;
}

function truncate(value: string, maxChars: number) {
  if (value.length <= maxChars) {
    return value;
  }

  return `${value.slice(0, maxChars)}...`;
}

export function parseBrowserPageArguments(input: unknown) {
  const normalizedInput = normalizeBrowserPageArgumentsInput(input);
  const parsed = browserPageArgumentsSchema.safeParse(normalizedInput);

  if (parsed.success) {
    return parsed.data;
  }

  throw new Error(
    'Browser Page tool expects either a URL string or a JSON object like {"url":"https://example.com","maxChars":4000,"includeLinks":true}.',
  );
}

export async function executeBrowserPageTool(input: BrowserPageArguments) {
  const response = await fetch(input.url, {
    method: "GET",
    headers: {
      "user-agent":
        "NodebaseBrowserTool/1.0 (+https://localhost; workflow browser fetch)",
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(20_000),
  });

  const rawBody = await response.text();
  const contentType = response.headers.get("content-type") ?? "text/plain";

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      finalUrl: response.url,
      contentType,
      result: null,
      body: truncate(rawBody, input.maxChars),
    };
  }

  if (!contentType.toLowerCase().includes("html")) {
    const plainText = truncate(collapseWhitespace(rawBody), input.maxChars);

    return {
      ok: true,
      status: response.status,
      finalUrl: response.url,
      contentType,
      title: null,
      description: null,
      excerpt: plainText.slice(0, 280),
      text: plainText,
      links: [],
      body: plainText,
      result: plainText,
    };
  }

  const title = extractTitle(rawBody);
  const description =
    extractMetaContent(rawBody, "description") ??
    extractMetaContent(rawBody, "og:description");
  const text = truncate(stripHtml(rawBody), input.maxChars);
  const excerpt = description ?? text.slice(0, 280);
  const links = input.includeLinks
    ? extractLinks(rawBody, response.url, input.maxLinks)
    : [];

  return {
    ok: true,
    status: response.status,
    finalUrl: response.url,
    contentType,
    title,
    description,
    excerpt,
    text,
    links,
    html: input.includeHtml ? truncate(rawBody, input.maxChars) : null,
    result: text,
  };
}
