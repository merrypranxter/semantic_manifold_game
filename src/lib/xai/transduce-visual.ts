import { createServerFn } from "@tanstack/react-start";
import {
  fallbackVisualConcept,
  normalizeVisualConcept,
} from "@/lib/domain/visual-transducer-core";
import {
  failureSurfacesForOutput,
  jurisdictionsForOutput,
  type VisualOutputKind,
} from "@/lib/domain/visual-schema";
import type { Trait } from "@/lib/manifold/types";

type VisualTraitInput = Pick<
  Trait,
  | "name"
  | "rule"
  | "jurisdiction"
  | "strength"
  | "mutability"
  | "locked"
  | "lost"
  | "suppressed"
>;

type TransduceVisualInput = {
  label: string;
  output: VisualOutputKind;
  organismName: string;
  organismIdentity: string;
  traits: VisualTraitInput[];
  invariants: string[];
  mind?: {
    id: string;
    full: string;
    transduce: string;
    procedure: string[];
  };
};

type TransduceVisualOk = {
  ok: true;
  concept: ReturnType<typeof fallbackVisualConcept>["concept"];
  readings: string[];
  warnings: string[];
  source: "ai" | "fallback";
};

type TransduceVisualErr = { ok: false; error: string };

function boundedVisualMaxTokens(): number {
  const requested = Number(process.env.XAI_VISUAL_MAX_TOKENS ?? "560");
  if (!Number.isFinite(requested)) return 560;
  return Math.max(320, Math.min(720, Math.round(requested)));
}

function traitContext(traits: VisualTraitInput[]): string {
  return traits
    .filter((trait) => !trait.lost && !trait.suppressed)
    .sort((a, b) => Number(Boolean(a.locked)) - Number(Boolean(b.locked)))
    .slice(0, 12)
    .map(
      (trait) =>
        `[${trait.jurisdiction}] ${trait.name}: ${trait.rule.slice(0, 180)} ` +
        `(mutability ${trait.mutability.toFixed(2)}${trait.locked ? ", LOCKED" : ""})`,
    )
    .join("\n");
}

export const transduceVisualConcept = createServerFn({ method: "POST" })
  .validator((input: TransduceVisualInput) => input)
  .handler(
    async ({ data }): Promise<TransduceVisualOk | TransduceVisualErr> => {
      const label = data.label.trim().slice(0, 120);
      if (!label) return { ok: false, error: "Visual transduction needs a concept." };

      const output: VisualOutputKind = data.output === "video" ? "video" : "image";
      const traits = data.traits.slice(0, 18) as Trait[];
      const fallback = () => {
        const result = fallbackVisualConcept(label, output, traits);
        return {
          ok: true as const,
          concept: result.concept,
          readings: result.readings,
          warnings: result.warnings,
          source: result.source,
        };
      };

      const apiKey = process.env.XAI_API_KEY;
      if (!apiKey) return fallback();

      const jurisdictions = jurisdictionsForOutput(output).join("|");
      const failureSurfaces = failureSurfacesForOutput(output)
        .slice(0, 14)
        .map(
          (surface) =>
            `${surface.id}[${surface.pressureJurisdictions.join(",")}]: ${surface.description}`,
        )
        .join("\n");
      const invariants = data.invariants
        .slice(0, 8)
        .map((invariant) => `- ${invariant.slice(0, 180)}`)
        .join("\n");
      const activeTraits = traitContext(data.traits);
      const mindBlock = data.mind
        ? `\nTEMPORARY COGNITIVE INSTALLATION:\n${data.mind.full.slice(0, 160)}\n${data.mind.transduce.slice(0, 650)}\n${data.mind.procedure
            .slice(0, 4)
            .map((step, i) => `${i + 1}. ${step.slice(0, 180)}`)
            .join("\n")}\nTreat this as a hidden generative constraint; do not name it in donations.`
        : "";

      const system = `You transduce a destination concept into OPERATIONAL PRESSURE on an existing visual prompt organism.
You are not writing an image prompt. You are not describing the concept. You are deciding what the concept DOES to rules that already exist.

ABSOLUTE PROHIBITIONS:
- no aesthetic adjective soup
- no literal iconography merely associated with the destination concept
- no "X-themed" output
- no adding a new subject just to represent the concept
- do not use the source concept word inside donation rule/rewrite text
- do not rewrite locked identity constraints

PREFER REWRITING EXISTING JURISDICTIONS over adding unrelated ones. A donation is useful when the manifold operator can mutate a current trait in the same jurisdiction.
The output target is ${output}. Use only these jurisdictions: ${jurisdictions}.

Known representation failure surfaces:
${failureSurfaces}

Return compact JSON only.${mindBlock}`;

      const user = `Destination concept: ${label}
Current organism: ${data.organismName.slice(0, 100)}
Identity: ${data.organismIdentity.slice(0, 280)}

Protected invariants:
${invariants || "(none explicit)"}

Current active visual rules:
${activeTraits || "(no decompiled traits available)"}

Produce 2-4 operational donations. Aim at mutable existing jurisdictions first. Make each rule causal/relational/procedural: transfer, delay, conservation, inversion, recursion, suppression, correspondence failure, boundary reassignment, topology change, rate law, or another mechanism. The result should still be traceably descended from the current organism.

JSON shape:
{
  "readings": ["operational reading A", "operational reading B", "operational reading C"],
  "whatItDoes": "selected mechanism, not appearance",
  "clicheForbidden": ["cheap literal/aesthetic readings"],
  "donations": [
    {
      "jurisdiction": "one allowed jurisdiction",
      "name": "short structural name",
      "rule": "new operational law; source concept word forbidden",
      "rewrite": "how the CURRENT rule in this jurisdiction changes; source concept word forbidden",
      "mass": 0.2
    }
  ],
  "failureMode": "how this transduction collapses into decoration or incoherence",
  "fracturePlane": "allowed jurisdiction most likely to fail first",
  "mass": 0.2,
  "features": {
    "semanticX": -1,
    "semanticY": 0,
    "structure": 0.5,
    "failure": 0.5,
    "memory": 0.5,
    "temporal": 0.5,
    "topology": 0.5,
    "energy": 0.5
  }
}`;

      const model =
        process.env.XAI_MODEL?.trim() || "grok-4.20-0309-non-reasoning";

      try {
        const res = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "x-grok-conv-id": "semantic-manifold-visual-transducer-v1",
          },
          signal: AbortSignal.timeout(12_000),
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: system },
              { role: "user", content: user },
            ],
            temperature: 0.72,
            max_tokens: boundedVisualMaxTokens(),
            response_format: { type: "json_object" },
          }),
        });
        if (!res.ok) return fallback();

        const body = (await res.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };
        const text = body.choices?.[0]?.message?.content ?? "";
        let parsed: unknown;
        try {
          parsed = JSON.parse(text);
        } catch {
          return fallback();
        }

        const result = normalizeVisualConcept(
          label,
          output,
          traits,
          parsed,
          "ai",
        );
        if (result.concept.donations.length === 0) return fallback();
        return {
          ok: true,
          concept: result.concept,
          readings: result.readings,
          warnings: result.warnings,
          source: result.source,
        };
      } catch {
        return fallback();
      }
    },
  );
