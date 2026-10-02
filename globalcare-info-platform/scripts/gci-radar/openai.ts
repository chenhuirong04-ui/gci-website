import type { GeneratedBatch, RadarCandidate, RecentRadarContext } from "./types";
import type { RadarSearchDefinition } from "./sources";

const OPENAI_URL = "https://api.openai.com/v1/responses";
const OPENAI_MODEL = "gpt-5-mini";
const TIMEOUT_MS = 70_000;
const MAX_ATTEMPTS = 2;

const ITEM_PROPERTIES = {
  radar_date: { type: "string" },
  region: { type: "string", enum: ["SPAIN", "GCC / MIDDLE EAST", "AFRICA", "CHINA OUTBOUND"] },
  country: { type: "string" },
  city: { type: ["string", "null"] },
  sector: { type: "string" },
  title: { type: "string" },
  what_happened: { type: "string" },
  key_companies: { type: "array", items: { type: "string" } },
  why_it_matters: { type: "string" },
  gci_role: { type: "string" },
  next_action: { type: "string" },
  target_organisation: { type: "string" },
  source_name: { type: "string" },
  source_url: { type: "string" },
  opportunity_score: { type: "integer", minimum: 0, maximum: 100 },
  risk_level: { type: "string", enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
  milestone_type: { type: "string" },
  event_key: { type: "string" },
  semantic_duplicate: { type: "boolean" },
  duplicate_reason: { type: ["string", "null"] },
} as const;

const RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    items: {
      type: "array",
      maxItems: 2,
      items: {
        type: "object",
        additionalProperties: false,
        properties: ITEM_PROPERTIES,
        required: Object.keys(ITEM_PROPERTIES),
      },
    },
  },
  required: ["items"],
} as const;

function prompt(search: RadarSearchDefinition, today: string, recent: RecentRadarContext[]): string {
  return `You are the internal GCI Global Business Radar analyst.

Today is ${today}. Search for genuinely new, verifiable developments published today or within the previous 36 hours for ${search.region}.

Countries: ${search.countries.join(", ")}
Commercial focus:
- ${search.focus.join("\n- ")}

Prefer these official/high-quality domains, but use another reputable primary or major business source when necessary:
${search.prioritySources.join(", ")}

This is NOT a general news digest. Return at most 2 candidates that could create a realistic client lead, supplier lead, project, relationship, market-entry action or operational risk for GCI. Quality is more important than quantity; return an empty items array when nothing qualifies.

Priority: real investment > new project > tender/procurement > factory/expansion > JV > market entry > supplier requirement > logistics/supply-chain change > enterprise AI/digitalisation demand > trade/customs change. Reject routine politics, macro commentary and conference promotion.

Scoring:
- 90-100 immediate action
- 75-89 high priority
- 60-74 watch
- below 60 normally not pushable
- HIGH/CRITICAL logistics or trade risk may score below 60 when it plausibly affects shipping, customs, cost, delivery, sourcing, payment, market access or project execution.

Write analytical fields primarily in concise Simplified Chinese, retaining useful English company, institution, project and technical names. Never reveal chain-of-thought.

Deduplication context from the previous 7 days:
${JSON.stringify(recent.slice(0, 40))}

For a media repost of the same event and same commercial milestone, set semantic_duplicate=true and explain briefly. For the same project with a genuinely new milestone such as EPC tender, supplier tender, construction start, recruitment, JV or logistics contract, set semantic_duplicate=false and use a distinct milestone_type and event_key. event_key must identify the underlying project/company development consistently; milestone_type must identify the commercial node.

Requirements:
- source_url must be the usable HTTPS page supporting the claim, never a search-results URL.
- radar_date must be ${today}.
- region must be exactly ${search.region}.
- target_organisation must name who GCI should approach.
- Keep title under 180 characters; what_happened and why_it_matters under 700 each; next_action under 500; other analytical fields concise for mobile Telegram reading.
- Return structured JSON only.`;
}

function extractText(response: any): string {
  const message = (response.output || []).find((entry: any) => entry.type === "message");
  const part = (message?.content || []).find((entry: any) => typeof entry.text === "string");
  if (!part?.text) throw new Error("OpenAI response did not contain structured output text");
  return part.text;
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function generateRadarBatch(
  apiKey: string,
  search: RadarSearchDefinition,
  today: string,
  recent: RecentRadarContext[],
): Promise<GeneratedBatch> {
  const body = {
    model: OPENAI_MODEL,
    reasoning: { effort: "low" },
    tools: [{ type: "web_search", search_context_size: "low" }],
    parallel_tool_calls: false,
    max_output_tokens: 7000,
    input: prompt(search, today, recent),
    text: {
      format: {
        type: "json_schema",
        name: "gci_business_radar_candidates",
        strict: true,
        schema: RESPONSE_SCHEMA,
      },
    },
  };

  let lastError: Error | undefined;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetchWithTimeout(OPENAI_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(`OpenAI HTTP ${response.status}: ${detail.slice(0, 240)}`);
      }
      const json = await response.json();
      const parsed = JSON.parse(extractText(json)) as { items: RadarCandidate[] };
      return {
        candidates: parsed.items ?? [],
        usage: {
          calls: 1,
          inputTokens: Number(json.usage?.input_tokens || 0),
          outputTokens: Number(json.usage?.output_tokens || 0),
        },
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < MAX_ATTEMPTS) await new Promise((resolve) => setTimeout(resolve, 3000 * attempt));
    }
  }
  throw lastError ?? new Error("OpenAI generation failed");
}
