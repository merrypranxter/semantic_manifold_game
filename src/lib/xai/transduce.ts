import { createServerFn } from "@tanstack/react-start";
import { slugFromLabel } from "@/lib/manifold/concepts";
import type { Concept, Donation, Features, Jurisdiction } from "@/lib/manifold/types";

const JURISDICTIONS: Jurisdiction[] = [
  "time",
  "meter",
  "rhythm",
  "pulse",
  "pitch",
  "harmony",
  "melody",
  "texture",
  "timbre",
  "instrumentation",
  "vocal",
  "articulation",
  "dynamics",
  "production",
  "form",
  "motif",
  "repetition",
  "performance",
  "spatial",
  "structure",
  "memory",
];

type TransduceInput = {
  label: string;
  organismName: string;
  organismIdentity: string;
};

type TransduceOk = {
  ok: true;
  concept: Concept;
  readings: string[];
};

type TransduceErr = { ok: false; error: string };

function fallbackConcept(label: string): Concept {
  const slug = slugFromLabel(label);
  const donations: Donation[] = [
    {
      jurisdiction: "structure",
      name: "operational pressure",
      rule: `reorganize existing load-bearing so it can survive contact with the operational structure implied by the named region`,
    },
    {
      jurisdiction: "form",
      name: "encountered law",
      rule: `the current form must answer what this region does, not what it is called`,
    },
  ];
  const features: Features = {
    semanticX: (hash(label) % 200) / 100 - 1,
    semanticY: (hash(label + "y") % 200) / 100 - 1,
    structure: 0.45,
    failure: 0.45,
    memory: 0.4,
    temporal: 0.4,
    topology: 0.4,
    energy: 0.45,
  };
  return {
    id: slug,
    label: titleCase(label),
    aliases: [label.toLowerCase()],
    whatItDoes: `Applies an uncertain operational reading of ${titleCase(label)} onto whatever already exists. Confidence is low until a better transduction is made.`,
    clicheForbidden: [
      label.toLowerCase(),
      `${label.toLowerCase()} themed`,
      `sounds like ${label.toLowerCase()}`,
    ],
    donations,
    features,
    failureMode: "the reading stays decorative if not forced into a specific existing trait",
    fracturePlane: "structure",
    mass: 0.4,
    seeded: false,
  };
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function titleCase(s: string): string {
  return s
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function coerceConcept(label: string, raw: unknown): Concept | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const whatItDoes = String(o.whatItDoes ?? o.selected_reading ?? "");
  if (!whatItDoes) return undefined;
  const donationsRaw = Array.isArray(o.donations) ? o.donations : [];
  const donations: Donation[] = donationsRaw.slice(0, 4).map((d) => {
    const row = (d ?? {}) as Record<string, unknown>;
    const j = String(row.jurisdiction ?? "structure") as Jurisdiction;
    return {
      jurisdiction: JURISDICTIONS.includes(j) ? j : "structure",
      name: String(row.name ?? "donated law").slice(0, 48),
      rule: String(row.rule ?? "").slice(0, 240),
      rewrite: row.rewrite ? String(row.rewrite).slice(0, 240) : undefined,
    };
  }).filter((d) => d.rule);
  if (donations.length === 0) return undefined;
  const feat = (o.features ?? {}) as Record<string, unknown>;
  const num = (k: string, d: number) => {
    const v = Number(feat[k]);
    return Number.isFinite(v) ? v : d;
  };
  const cliche = Array.isArray(o.clicheForbidden)
    ? o.clicheForbidden.map((x) => String(x))
    : [label.toLowerCase()];
  const fracture = String(o.fracturePlane ?? donations[0]?.jurisdiction) as Jurisdiction;
  return {
    id: slugFromLabel(label),
    label: titleCase(label),
    aliases: [label.toLowerCase()],
    whatItDoes: whatItDoes.slice(0, 400),
    clicheForbidden: cliche.slice(0, 8),
    donations,
    features: {
      semanticX: Math.max(-1, Math.min(1, num("semanticX", 0))),
      semanticY: Math.max(-1, Math.min(1, num("semanticY", 0))),
      structure: Math.max(0, Math.min(1, num("structure", 0.5))),
      failure: Math.max(0, Math.min(1, num("failure", 0.5))),
      memory: Math.max(0, Math.min(1, num("memory", 0.4))),
      temporal: Math.max(0, Math.min(1, num("temporal", 0.4))),
      topology: Math.max(0, Math.min(1, num("topology", 0.4))),
      energy: Math.max(0, Math.min(1, num("energy", 0.4))),
    },
    failureMode: String(o.failureMode ?? "reading collapses into decoration").slice(0, 240),
    fracturePlane: JURISDICTIONS.includes(fracture) ? fracture : "structure",
    mass: Math.max(0.2, Math.min(0.95, Number(o.mass) || 0.45)),
    seeded: false,
  };
}

export const transduceConcept = createServerFn({ method: "POST" })
  .validator((input: TransduceInput) => input)
  .handler(async ({ data }): Promise<TransduceOk | TransduceErr> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: true, concept: fallbackConcept(data.label), readings: ["local-uncertain"] };
    }

    const system = `You transduce a concept into OPERATIONAL STRUCTURE for a creative navigation instrument.
Forbidden: aesthetic adjectives, genre names, "sounds like", theme-smoothie, keyword soup.
Ask what the concept DOES as a mechanism: physics, procedure, failure, memory, topology.
The current organism is "${data.organismName}": ${data.organismIdentity}
You will donate 2-4 traits that can REWRITE existing musical/structural behavior. Prefer transforming what exists over adding new instruments.
Do not include the source word in trait rules (source-word-removal test).
Return JSON only.`;

    const user = `Concept: ${data.label}

JSON shape:
{
  "readings": ["operational reading A", "operational reading B", "operational reading C"],
  "whatItDoes": "one selected operational reading, 1-2 sentences",
  "clicheForbidden": ["phrases that would be a cheap aesthetic reading"],
  "donations": [
    { "jurisdiction": "one of time|meter|rhythm|pulse|pitch|harmony|melody|texture|timbre|instrumentation|vocal|articulation|dynamics|production|form|motif|repetition|performance|spatial|structure|memory", "name": "short name", "rule": "rule-over-adjective, no source word", "rewrite": "how this rewrites an existing trait in that jurisdiction" }
  ],
  "failureMode": "how this region collapses",
  "fracturePlane": "jurisdiction that breaks first",
  "mass": 0.2-0.95,
  "features": { "semanticX": -1..1, "semanticY": -1..1, "structure": 0-1, "failure": 0-1, "memory": 0-1, "temporal": 0-1, "topology": 0-1, "energy": 0-1 }
}`;

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          temperature: 0.7,
          max_tokens: 900,
          response_format: { type: "json_object" },
        }),
      });
      if (!res.ok) {
        return { ok: true, concept: fallbackConcept(data.label), readings: ["fallback-api"] };
      }
      const body = (await res.json()) as {
        choices: { message: { content: string } }[];
      };
      const text = body.choices[0]?.message.content ?? "";
      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        return { ok: true, concept: fallbackConcept(data.label), readings: ["fallback-parse"] };
      }
      const concept = coerceConcept(data.label, parsed);
      if (!concept) {
        return { ok: true, concept: fallbackConcept(data.label), readings: ["fallback-shape"] };
      }
      const readings = Array.isArray((parsed as { readings?: unknown }).readings)
        ? ((parsed as { readings: unknown[] }).readings).map((x) => String(x)).slice(0, 4)
        : [concept.whatItDoes];
      return { ok: true, concept, readings };
    } catch {
      return { ok: true, concept: fallbackConcept(data.label), readings: ["fallback-error"] };
    }
  });
