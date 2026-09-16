import { createServerFn } from "@tanstack/react-start";
import {
  fallbackVisualDecompilation,
  normalizeVisualDecompilation,
  visualSpecimenToOrigin,
  type VisualDecompilation,
} from "@/lib/domain/visual-decompiler-core";
import {
  jurisdictionsForOutput,
  type VisualOutputKind,
} from "@/lib/domain/visual-schema";
import type { OrganismState } from "@/lib/manifold/types";

type VisualDecompileInput = {
  rawPrompt: string;
  output: VisualOutputKind;
};

type VisualDecompileOk = {
  ok: true;
  decompiled: VisualDecompilation;
  origin: OrganismState;
  usedAI: boolean;
};

type VisualDecompileErr = {
  ok: false;
  error: string;
};

function boundedMaxTokens(): number {
  const requested = Number(process.env.XAI_DECOMPILE_MAX_TOKENS ?? "900");
  if (!Number.isFinite(requested)) return 900;
  return Math.max(512, Math.min(1400, Math.round(requested)));
}

function fallbackResult(
  rawPrompt: string,
  output: VisualOutputKind,
  reason?: string,
): VisualDecompileOk {
  const decompiled = fallbackVisualDecompilation(rawPrompt, output);
  if (reason) {
    decompiled.warnings = [...decompiled.warnings, reason];
  }
  return {
    ok: true,
    decompiled,
    origin: visualSpecimenToOrigin(decompiled),
    usedAI: false,
  };
}

export const decompileVisualPrompt = createServerFn({ method: "POST" })
  .validator((input: VisualDecompileInput) => {
    const rawPrompt = String(input.rawPrompt ?? "").trim();
    if (!rawPrompt) throw new Error("Paste an image or video prompt first.");
    if (rawPrompt.length > 8_000) {
      throw new Error("Prompt specimen is too large to ingest in one pass (8,000 character limit).");
    }
    const output: VisualOutputKind = input.output === "video" ? "video" : "image";
    return { rawPrompt, output };
  })
  .handler(async ({ data }): Promise<VisualDecompileOk | VisualDecompileErr> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return fallbackResult(data.rawPrompt, data.output, "AI decompiler unavailable; used local operational parser.");
    }

    const jurisdictions = jurisdictionsForOutput(data.output);
    const system = `You are a PROMPT DECOMPILER for a path-dependent visual mutation instrument.
Your job is extraction, not rewriting and not prompt improvement.
Read the supplied ${data.output} prompt as a set of load-bearing operational rules.

STRICT RULES:
- Do not embellish, optimize, beautify, or add concepts absent from the source prompt.
- Do not reduce the source to keywords. Extract relationships, mechanisms, constraints, and preservation rules.
- A clause must be supported by the source prompt itself.
- identityAnchors are only subjects/properties that the prompt explicitly or strongly requires to stay recognizable.
- explicitInvariants are only preservation/negative constraints stated unambiguously by the source.
- Use only the allowed jurisdictions supplied by the user message.
- For image output, do not invent temporal/video laws.
- mutability: 0 means this rule should barely move; 1 means it may mutate freely.
- confidence measures confidence that your extracted clause is actually supported by the source.
- Keep clauses concise but operational: state what must happen or remain true, not an aesthetic label.
- Return JSON only.`;

    const user = `OUTPUT: ${data.output}
ALLOWED JURISDICTIONS:
${jurisdictions.join("|")}

SOURCE PROMPT:
<<<
${data.rawPrompt}
>>>

Return this JSON shape:
{
  "identity": "one factual sentence describing the specimen's persistent identity, without adding new content",
  "identityAnchors": ["explicit identity/property anchors from the source"],
  "explicitInvariants": ["explicit preserve/never/keep/exact constraints from the source"],
  "clauses": [
    {
      "text": "operational rule supported by the prompt",
      "jurisdiction": "one allowed jurisdiction",
      "role": "anchor|mechanism|constraint|rendering|temporal_law|negative_constraint",
      "confidence": 0.0,
      "mutability": 0.0
    }
  ],
  "features": {
    "semanticX": -1.0,
    "semanticY": -1.0,
    "structure": 0.0,
    "failure": 0.0,
    "memory": 0.0,
    "temporal": 0.0,
    "topology": 0.0,
    "energy": 0.0
  }
}

Prefer 4-12 clauses. Use fewer when the source is simple. Never create filler just to reach a count.`;

    const model = process.env.XAI_MODEL?.trim() || "grok-4.20-0309-non-reasoning";

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "x-grok-conv-id": "semantic-manifold-visual-decompiler-v1",
        },
        signal: AbortSignal.timeout(12_000),
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          temperature: 0.15,
          max_tokens: boundedMaxTokens(),
          response_format: { type: "json_object" },
        }),
      });

      if (!res.ok) {
        return fallbackResult(
          data.rawPrompt,
          data.output,
          `AI decompiler returned HTTP ${res.status}; used local operational parser.`,
        );
      }

      const body = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = body.choices?.[0]?.message?.content ?? "";
      let payload: unknown;
      try {
        payload = JSON.parse(text);
      } catch {
        return fallbackResult(
          data.rawPrompt,
          data.output,
          "AI decompiler returned invalid JSON; used local operational parser.",
        );
      }

      const decompiled = normalizeVisualDecompilation(
        data.rawPrompt,
        data.output,
        payload,
        "ai",
      );
      if (decompiled.specimen.clauses.length === 0) {
        return fallbackResult(
          data.rawPrompt,
          data.output,
          "AI decompiler returned no usable clauses; used local operational parser.",
        );
      }

      return {
        ok: true,
        decompiled,
        origin: visualSpecimenToOrigin(decompiled),
        usedAI: true,
      };
    } catch {
      return fallbackResult(
        data.rawPrompt,
        data.output,
        "AI decompiler request failed; used local operational parser.",
      );
    }
  });
