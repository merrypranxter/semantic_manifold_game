import { t as createServerFn } from "./ssr.mjs";
import { r as slugFromLabel } from "./names-CAdCUBxM.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/transduce-BobbyUhL.js
var JURISDICTIONS = [
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
	"memory"
];
function fallbackConcept(label) {
	const slug = slugFromLabel(label);
	const donations = [{
		jurisdiction: "structure",
		name: "operational pressure",
		rule: `reorganize existing load-bearing so it can survive contact with the operational structure implied by the named region`
	}, {
		jurisdiction: "form",
		name: "encountered law",
		rule: `the current form must answer what this region does, not what it is called`
	}];
	const features = {
		semanticX: hash(label) % 200 / 100 - 1,
		semanticY: hash(label + "y") % 200 / 100 - 1,
		structure: .45,
		failure: .45,
		memory: .4,
		temporal: .4,
		topology: .4,
		energy: .45
	};
	return {
		id: slug,
		label: titleCase(label),
		aliases: [label.toLowerCase()],
		whatItDoes: `Applies an uncertain operational reading of ${titleCase(label)} onto whatever already exists. Confidence is low until a better transduction is made.`,
		clicheForbidden: [
			label.toLowerCase(),
			`${label.toLowerCase()} themed`,
			`sounds like ${label.toLowerCase()}`
		],
		donations,
		features,
		failureMode: "the reading stays decorative if not forced into a specific existing trait",
		fracturePlane: "structure",
		mass: .4,
		seeded: false
	};
}
function hash(s) {
	let h = 0;
	for (let i = 0; i < s.length; i++) h = h * 31 + s.charCodeAt(i) | 0;
	return Math.abs(h);
}
function titleCase(s) {
	return s.split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
function coerceConcept(label, raw) {
	if (!raw || typeof raw !== "object") return void 0;
	const o = raw;
	const whatItDoes = String(o.whatItDoes ?? o.selected_reading ?? "");
	if (!whatItDoes) return void 0;
	const donations = (Array.isArray(o.donations) ? o.donations : []).slice(0, 4).map((d) => {
		const row = d ?? {};
		const j = String(row.jurisdiction ?? "structure");
		return {
			jurisdiction: JURISDICTIONS.includes(j) ? j : "structure",
			name: String(row.name ?? "donated law").slice(0, 48),
			rule: String(row.rule ?? "").slice(0, 240),
			rewrite: row.rewrite ? String(row.rewrite).slice(0, 240) : void 0
		};
	}).filter((d) => d.rule);
	if (donations.length === 0) return void 0;
	const feat = o.features ?? {};
	const num = (k, d) => {
		const v = Number(feat[k]);
		return Number.isFinite(v) ? v : d;
	};
	const cliche = Array.isArray(o.clicheForbidden) ? o.clicheForbidden.map((x) => String(x)) : [label.toLowerCase()];
	const fracture = String(o.fracturePlane ?? donations[0]?.jurisdiction);
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
			structure: Math.max(0, Math.min(1, num("structure", .5))),
			failure: Math.max(0, Math.min(1, num("failure", .5))),
			memory: Math.max(0, Math.min(1, num("memory", .4))),
			temporal: Math.max(0, Math.min(1, num("temporal", .4))),
			topology: Math.max(0, Math.min(1, num("topology", .4))),
			energy: Math.max(0, Math.min(1, num("energy", .4)))
		},
		failureMode: String(o.failureMode ?? "reading collapses into decoration").slice(0, 240),
		fracturePlane: JURISDICTIONS.includes(fracture) ? fracture : "structure",
		mass: Math.max(.2, Math.min(.95, Number(o.mass) || .45)),
		seeded: false
	};
}
function boundedMaxTokens() {
	const requested = Number(process.env.XAI_MAX_TOKENS ?? "550");
	if (!Number.isFinite(requested)) return 550;
	return Math.max(256, Math.min(700, Math.round(requested)));
}
var transduceConcept_createServerFn_handler = createServerRpc({
	id: "f5a4b9aea795aa8a563c94bbc098c4c538a639e5218b45f18e18bca3adf90852",
	name: "transduceConcept",
	filename: "src/lib/xai/transduce.ts"
}, (opts) => transduceConcept.__executeServer(opts));
var transduceConcept = createServerFn({ method: "POST" }).validator((input) => input).handler(transduceConcept_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: true,
		concept: fallbackConcept(data.label),
		readings: ["local-uncertain"]
	};
	const mindBlock = data.mind ? `\n\nTEMPORARY COGNITIVE INSTALLATION: ${data.mind.full.slice(0, 160)}\nThis is a hidden generative constraint. Do not explain it. Do not name the procedure.\n${data.mind.transduce.slice(0, 700)}\n${data.mind.procedure.slice(0, 5).map((s, i) => `${i + 1}. ${s.slice(0, 220)}`).join("\n")}\nDonations must fail the validation tests in that procedure.` : "";
	const system = `You transduce a concept into OPERATIONAL STRUCTURE for a creative navigation instrument.
Forbidden: aesthetic adjectives, genre names, "sounds like", theme-smoothie, keyword soup.
Ask what the concept DOES as a mechanism: physics, procedure, failure, memory, topology.
The current organism is "${data.organismName.slice(0, 100)}": ${data.organismIdentity.slice(0, 320)}
You will donate 2-4 traits that can REWRITE existing musical/structural behavior. Prefer transforming what exists over adding new instruments.
Do not include the source word in trait rules (source-word-removal test).
Return JSON only.${mindBlock}`;
	const user = `Concept: ${data.label.slice(0, 120)}

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
	const model = process.env.XAI_MODEL?.trim() || "grok-4.20-0309-non-reasoning";
	try {
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
				"x-grok-conv-id": "semantic-manifold-transducer-v1"
			},
			signal: AbortSignal.timeout(12e3),
			body: JSON.stringify({
				model,
				messages: [{
					role: "system",
					content: system
				}, {
					role: "user",
					content: user
				}],
				temperature: .65,
				max_tokens: boundedMaxTokens(),
				response_format: { type: "json_object" }
			})
		});
		if (!res.ok) return {
			ok: true,
			concept: fallbackConcept(data.label),
			readings: ["fallback-api"]
		};
		const text = (await res.json()).choices[0]?.message.content ?? "";
		let parsed;
		try {
			parsed = JSON.parse(text);
		} catch {
			return {
				ok: true,
				concept: fallbackConcept(data.label),
				readings: ["fallback-parse"]
			};
		}
		const concept = coerceConcept(data.label, parsed);
		if (!concept) return {
			ok: true,
			concept: fallbackConcept(data.label),
			readings: ["fallback-shape"]
		};
		return {
			ok: true,
			concept,
			readings: Array.isArray(parsed.readings) ? parsed.readings.map((x) => String(x)).slice(0, 4) : [concept.whatItDoes]
		};
	} catch {
		return {
			ok: true,
			concept: fallbackConcept(data.label),
			readings: ["fallback-error"]
		};
	}
});
//#endregion
export { transduceConcept_createServerFn_handler };
