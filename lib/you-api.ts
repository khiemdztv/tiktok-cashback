const SEARCH_API_URL = "https://ydc-index.io/v1/search";
const CONTENTS_API_URL = "https://ydc-index.io/v1/contents";
const ANSWER_API_URL = "https://api.you.com/v1/answer";
const REQUEST_TIMEOUT_MS = 15_000;

export type YouSearchResult = {
  title?: string;
  url?: string;
  description?: string;
  thumbnail_url?: string;
  favicon_url?: string;
  snippets?: string[];
  highlights?: string[];
  contents?: {
    highlights?: string[];
    markdown?: string;
    html?: string;
  };
};

export type YouSearchResponse = {
  results?: {
    web?: YouSearchResult[];
    news?: YouSearchResult[];
  };
  metadata?: Record<string, unknown>;
};

export type YouContentResult = {
  url?: string;
  title?: string;
  html?: string | null;
  markdown?: string | null;
  metadata?: Record<string, unknown>;
};

export type YouCitation = {
  source?: string;
  excerpts?: string[];
};

export type YouAnswerResponse = {
  answer: string;
  citations?: YouCitation[];
  results?: { web?: YouSearchResult[] };
};

export type SmartSearchResult = {
  id: string;
  productName: string;
  platform: string;
  platformName: string;
  price: number | null;
  voucherValue: number;
  voucherLabel: string;
  originalUrl: string;
  imageUrl?: string;
  cashbackRate: number;
  cashbackValue: number | null;
  effectivePrice: number | null;
  snippet: string;
  source: "you_api" | "internal";
};

export type SmartSearchResponse = {
  query: string;
  results: SmartSearchResult[];
  cached: boolean;
  searchedAt: string;
};

export type AIAnalysisResponse = {
  query: string;
  answer: string;
  citations: Array<{ url: string; title: string; excerpt?: string }>;
  cached: boolean;
};

export class YouApiError extends Error {
  constructor(
    message: string,
    public readonly status = 500,
  ) {
    super(message);
    this.name = "YouApiError";
  }
}

function apiKey() {
  const key = process.env.YOU_API_KEY?.trim();
  if (!key) throw new YouApiError("YOU_API_KEY chưa được cấu hình.", 503);
  return key;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestJson<T>(
  url: string,
  body: Record<string, unknown>,
  options: { timeoutMs?: number; attempts?: number } = {},
): Promise<T> {
  let lastError: unknown;
  const attempts = options.attempts ?? 2;
  const timeoutMs = options.timeoutMs ?? REQUEST_TIMEOUT_MS;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey(),
        },
        body: JSON.stringify(body),
        cache: "no-store",
        signal: controller.signal,
      });

      if (response.ok) return (await response.json()) as T;

      const retryable = response.status === 429 || response.status >= 500;
      let detail = "";
      try {
        const payload = (await response.json()) as { message?: string; error?: string };
        detail = payload.message ?? payload.error ?? "";
      } catch {
        // Keep the public error concise when the upstream response is not JSON.
      }

      const error = new YouApiError(
        detail || `You.com API trả về mã ${response.status}.`,
        response.status,
      );
      if (!retryable || attempt === attempts - 1) throw error;
      lastError = error;
    } catch (error) {
      lastError = error;
      if (error instanceof YouApiError && error.status < 500 && error.status !== 429) throw error;
      if (attempt === attempts - 1) {
        if (error instanceof YouApiError) throw error;
        if (error instanceof Error && error.name === "AbortError") {
          throw new YouApiError("You.com API phản hồi quá lâu.", 504);
        }
        throw new YouApiError("Không thể kết nối tới You.com API.", 502);
      }
    } finally {
      clearTimeout(timeout);
    }

    await wait(350 * (attempt + 1));
  }

  throw lastError instanceof Error
    ? lastError
    : new YouApiError("Không thể kết nối tới You.com API.", 502);
}

export function searchWeb(query: string, includeDomains: string[], count = 10) {
  return requestJson<YouSearchResponse>(SEARCH_API_URL, {
    query,
    count,
    include_domains: includeDomains,
    safesearch: "moderate",
    extraction: { extraction_mode: "highlights" },
  });
}

export function fetchContents(urls: string[]) {
  if (!urls.length) return Promise.resolve([] as YouContentResult[]);
  return requestJson<YouContentResult[]>(
    CONTENTS_API_URL,
    {
      urls,
      formats: ["markdown", "metadata"],
      crawl_timeout: 8,
      max_age: 3600,
    },
    { timeoutMs: 10_000, attempts: 1 },
  );
}

export function answerQuestion(query: string, includeDomains: string[]) {
  return requestJson<YouAnswerResponse>(ANSWER_API_URL, {
    query,
    include_domains: includeDomains,
    safesearch: "moderate",
  });
}
