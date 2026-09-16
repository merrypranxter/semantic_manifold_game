export type OperatorId =
  | "DIRECT"
  | "VIA"
  | "THROUGH"
  | "GEODESIC"
  | "PARALLEL"
  | "COLLISION"
  | "OVERSHOOT"
  | "HOVER"
  | "KEEP_GOING";

export type MetricId =
  | "SEMANTIC"
  | "FAILURE"
  | "MEMORY"
  | "TEMPORAL"
  | "TOPOLOGICAL";

export type TraitSource =
  | "ORIGIN"
  | "USER"
  | "CONCEPT_INTERPRETATION"
  | "WAYPOINT"
  | "COLLISION"
  | "SCAR"
  | "RECALL"
  | "SEMANTIC_RECOIL"
  | "ROUTE_OPERATOR"
  | "METRIC_DERIVATION"
  | "MIND";

export type Jurisdiction =
  | "time"
  | "meter"
  | "rhythm"
  | "pulse"
  | "pitch"
  | "harmony"
  | "melody"
  | "texture"
  | "timbre"
  | "instrumentation"
  | "vocal"
  | "articulation"
  | "dynamics"
  | "production"
  | "form"
  | "motif"
  | "repetition"
  | "performance"
  | "spatial"
  | "structure"
  | "memory";

export type InvariantLevel = "SOFT" | "STRONG" | "ABSOLUTE";

export type RelationKind =
  | "CAUSES"
  | "TRIGGERS"
  | "SUPPRESSES"
  | "PRESERVES"
  | "DEPENDS_ON"
  | "DESTABILIZES"
  | "TRANSFORMS_INTO"
  | "RETURNS_AFTER"
  | "REINTERPRETS";

export type Features = {
  semanticX: number;
  semanticY: number;
  structure: number;
  failure: number;
  memory: number;
  temporal: number;
  topology: number;
  energy: number;
};

export type Trait = {
  id: string;
  name: string;
  rule: string;
  jurisdiction: Jurisdiction;
  strength: number;
  confidence: number;
  persistence: number;
  mutability: number;
  source: TraitSource;
  sourceConceptId?: string;
  recency: number;
  locked?: boolean;
  suppressed?: boolean;
  lost?: boolean;
};

export type Scar = {
  id: string;
  cause: string;
  operator: OperatorId;
  sourceConceptId?: string;
  description: string;
  lostTraitNames: string[];
  survivorTraitNames: string[];
  debris: string[];
};

export type Debris = {
  id: string;
  label: string;
  rule: string;
  fromEventId: string;
  conceptId?: string;
};

export type Invariant = {
  id: string;
  text: string;
  level: InvariantLevel;
  traitId?: string;
};

export type Relationship = {
  id: string;
  from: string;
  to: string;
  kind: RelationKind;
};

export type Memory = {
  id: string;
  text: string;
  fromEventId: string;
};

export type Interpretation = {
  conceptId: string;
  reading: string;
};

export type PhoneticRule = {
  trigger: string;
  musicalEffect: string;
  strength: number;
};

export type MutationDiff = {
  added: string[];
  mutated: string[];
  suppressed: string[];
  lost: string[];
  scarred: string[];
  preserved: string[];
};

export type OrganismState = {
  id: string;
  version: number;
  seedId: string;
  generation: number;
  name: string;
  identity: string;
  playProjection: string;
  labProjection: string;
  features: Features;
  traits: Trait[];
  invariants: Invariant[];
  scars: Scar[];
  relationships: Relationship[];
  memories: Memory[];
  interpretations: Interpretation[];
  debris: Debris[];
  ancestry: string[];
  phoneticRules: PhoneticRule[];
  lastMutationDiff?: MutationDiff;
  lastOperator?: OperatorId;
  lastTargetId?: string;
  lastWaypointId?: string;
  lastFeatureDelta?: Features;
  uncertainty: number;
  createdAt: number;
  installedMind?: string | null;
  mindHistory: string[];
  retiredMetrics: MetricId[];
};

export type Donation = {
  jurisdiction: Jurisdiction;
  name: string;
  rule: string;
  rewrite?: string;
  mass?: number;
};

export type Concept = {
  id: string;
  label: string;
  aliases: string[];
  whatItDoes: string;
  clicheForbidden: string[];
  donations: Donation[];
  features: Features;
  failureMode: string;
  fracturePlane: Jurisdiction;
  mass: number;
  seeded: boolean;
  family?: string;
};

export type CommandProposal = {
  raw: string;
  operator: OperatorId;
  targetId?: string;
  targetLabel: string;
  waypointId?: string;
  waypointLabel?: string;
  novelTarget?: string;
  novelWaypoint?: string;
  mindId?: string;
  installOnly?: boolean;
  ejectMind?: boolean;
  confidence: number;
  note: string;
};

export type DeltaOp =
  | { kind: "ADD"; trait: Trait }
  | { kind: "MUTATE"; traitId: string; name?: string; rule: string; strength?: number; source: TraitSource }
  | { kind: "SUPPRESS"; traitId: string }
  | { kind: "LOST"; traitId: string }
  | { kind: "SCAR"; scar: Scar }
  | { kind: "RELATE"; relationship: Relationship }
  | { kind: "DEBRIS"; debris: Debris }
  | { kind: "INTERPRET"; interpretation: Interpretation }
  | { kind: "MEMORY"; memory: Memory }
  | { kind: "RENAME"; name: string; identity: string; play: string; lab: string }
  | { kind: "FEATURES"; features: Features; delta: Features };

export type Delta = {
  ops: DeltaOp[];
  operator: OperatorId;
  targetId?: string;
  waypointId?: string;
  geodesicVia?: string[];
  mindId?: string;
  mindNote?: string;
  setInstalledMind?: string | null;
  retireMetric?: MetricId;
  narrative: string;
  lab: string;
};

export type LedgerEvent = {
  id: string;
  at: number;
  operator: OperatorId;
  metric: MetricId;
  targetId?: string;
  targetLabel: string;
  waypointId?: string;
  waypointLabel?: string;
  fromStateId: string;
  toStateId: string;
  narrative: string;
  lab: string;
  added: string[];
  mutated: string[];
  lost: string[];
  scars: string[];
  geodesicVia?: string[];
  mindId?: string;
  mindNote?: string;
};

export type ViewMode = "PLAY" | "LAB";

export type MapMode = "DRIFT" | "TRACK";

export const FEATURE_ZERO: Features = {
  semanticX: 0,
  semanticY: 0,
  structure: 0,
  failure: 0,
  memory: 0,
  temporal: 0,
  topology: 0,
  energy: 0,
};

export const STYLE_MIN = 975;
export const STYLE_MAX = 999;
export const LYRICS_MIN = 4900;
export const LYRICS_MAX = 4999;
export const CAPTION_MIN = 490;
export const CAPTION_MAX = 499;

export const SAVE_VERSION = 4;
