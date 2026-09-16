import type { Features } from "../manifold/types.ts";
import type { CompileKind } from "./types.ts";

export type VisualOutputKind = Extract<CompileKind, "image" | "video">;
export type VisualScope = "shared" | "video";

export type VisualJurisdiction = {
  id: string;
  label: string;
  scope: VisualScope;
  description: string;
};

export type VisualFeatureMeaning = {
  label: string;
  low: string;
  high: string;
  description: string;
};

export type VisualFailureSurface = {
  id: string;
  label: string;
  scope: VisualScope;
  pressureJurisdictions: readonly string[];
  description: string;
  failureSignature: string;
};

export type VisualClauseRole =
  | "anchor"
  | "mechanism"
  | "constraint"
  | "rendering"
  | "temporal_law"
  | "negative_constraint";

export type VisualSpecimenClause = {
  text: string;
  jurisdiction: string;
  role: VisualClauseRole;
  confidence: number;
  mutability: number;
};

export type VisualSpecimen = {
  rawPrompt: string;
  output: VisualOutputKind;
  clauses: VisualSpecimenClause[];
  identityAnchors: string[];
  explicitInvariants: string[];
  decompiled: boolean;
};

export const VISUAL_JURISDICTIONS: readonly VisualJurisdiction[] = [
  {
    id: "subject_identity",
    label: "Subject identity",
    scope: "shared",
    description: "What remains recognizably the same subject across mutation.",
  },
  {
    id: "anatomy",
    label: "Anatomy / part binding",
    scope: "shared",
    description: "Which parts exist, where they attach, and what belongs to what body or object.",
  },
  {
    id: "topology",
    label: "Topology",
    scope: "shared",
    description: "Connectivity, holes, loops, surfaces, crossings, and inside/outside relations.",
  },
  {
    id: "geometry",
    label: "Geometry",
    scope: "shared",
    description: "Metric shape, curvature, proportion, orientation, and dimensional organization.",
  },
  {
    id: "boundary",
    label: "Boundary / membership",
    scope: "shared",
    description: "Where an entity ends, what is inside it, and what is attached, embedded, or separate.",
  },
  {
    id: "material",
    label: "Material behavior",
    scope: "shared",
    description: "What matter is made of and which physical behaviors that material is allowed to exhibit.",
  },
  {
    id: "surface",
    label: "Surface state",
    scope: "shared",
    description: "Skin, coating, texture-bearing surface, thickness, seams, wetness, fracture, and interface conditions.",
  },
  {
    id: "biological_process",
    label: "Biological process",
    scope: "shared",
    description: "Growth, healing, folding, secretion, morphogenesis, decay, and other living processes.",
  },
  {
    id: "scale",
    label: "Scale",
    scope: "shared",
    description: "Relative and absolute size relationships between subjects, parts, environment, and camera.",
  },
  {
    id: "spatial_relationship",
    label: "Spatial relationship",
    scope: "shared",
    description: "Containment, adjacency, overlap, distance, alignment, and positional dependency.",
  },
  {
    id: "composition",
    label: "Composition",
    scope: "shared",
    description: "Frame organization, hierarchy, density, balance, cropping, and placement.",
  },
  {
    id: "perspective",
    label: "Perspective / projection",
    scope: "shared",
    description: "Projection model, depth cues, vanishing logic, and viewpoint coherence.",
  },
  {
    id: "camera",
    label: "Camera",
    scope: "shared",
    description: "Lens, distance, angle, framing, depth of field, exposure behavior, and capture conditions.",
  },
  {
    id: "lighting",
    label: "Lighting",
    scope: "shared",
    description: "Illumination direction, source logic, contrast, shadow behavior, and emission.",
  },
  {
    id: "color",
    label: "Color",
    scope: "shared",
    description: "Palette, color relationships, spectral behavior, and color-state constraints.",
  },
  {
    id: "texture",
    label: "Texture",
    scope: "shared",
    description: "Fine-scale visual frequency, grain, roughness, pattern, and repeated surface information.",
  },
  {
    id: "rendering_medium",
    label: "Rendering medium",
    scope: "shared",
    description: "How the image claims to have been physically or computationally produced.",
  },
  {
    id: "degradation",
    label: "Artifact / degradation",
    scope: "shared",
    description: "Damage, compression, analog transfer, generation loss, sensor error, and other representation artifacts.",
  },
  {
    id: "environment",
    label: "Environment",
    scope: "shared",
    description: "World context and the rules connecting subject to surrounding space.",
  },
  {
    id: "transformation_mechanism",
    label: "Transformation mechanism",
    scope: "shared",
    description: "The operational process that changes the specimen rather than merely decorating it.",
  },
  {
    id: "spatial_continuity",
    label: "Spatial continuity",
    scope: "shared",
    description: "Whether surfaces, structures, repeated parts, and occluded regions remain mutually compatible.",
  },
  {
    id: "symmetry",
    label: "Symmetry",
    scope: "shared",
    description: "Preserved, broken, recursive, approximate, or competing symmetry relations.",
  },
  {
    id: "causality",
    label: "Causality",
    scope: "shared",
    description: "Which visual conditions cause, constrain, suppress, or result from other conditions.",
  },
  {
    id: "temporal_identity",
    label: "Temporal identity",
    scope: "video",
    description: "What makes an entity the same entity before and after change.",
  },
  {
    id: "object_permanence",
    label: "Object permanence",
    scope: "video",
    description: "Whether objects continue to exist consistently when hidden, transformed, or revisited.",
  },
  {
    id: "frame_correspondence",
    label: "Frame correspondence",
    scope: "video",
    description: "How parts, surfaces, landmarks, and identities correspond from frame to frame.",
  },
  {
    id: "motion",
    label: "Motion",
    scope: "video",
    description: "Trajectory, direction, velocity pattern, articulation, and coordinated movement.",
  },
  {
    id: "transformation_rate",
    label: "Transformation rate",
    scope: "video",
    description: "How quickly structural change occurs and whether its rate is smooth, stepped, delayed, or discontinuous.",
  },
  {
    id: "momentum",
    label: "Momentum / inertia",
    scope: "video",
    description: "Whether movement and deformation preserve plausible continuation or change state abruptly.",
  },
  {
    id: "growth_decay",
    label: "Growth / decay accounting",
    scope: "video",
    description: "Where added or removed structure comes from and how accumulation, erosion, healing, or loss proceeds.",
  },
  {
    id: "occlusion",
    label: "Occlusion continuity",
    scope: "video",
    description: "Whether hidden regions return with compatible identity, geometry, and state.",
  },
  {
    id: "camera_motion",
    label: "Camera motion",
    scope: "video",
    description: "How viewpoint movement interacts with subject motion and world geometry.",
  },
  {
    id: "before_after",
    label: "Before / after relation",
    scope: "video",
    description: "Which later states are descendants of which earlier states and what evidence of transition remains.",
  },
  {
    id: "temporal_topology",
    label: "Temporal topology",
    scope: "video",
    description: "Whether connectivity and part membership can change through time, and what transitions permit it.",
  },
  {
    id: "time_direction",
    label: "Time direction",
    scope: "video",
    description: "Forward, reverse, cyclic, branching, stalled, or locally contradictory temporal progression.",
  },
  {
    id: "persistence",
    label: "Persistence",
    scope: "video",
    description: "Which traits, scars, materials, and transformations survive across later frames.",
  },
] as const;

export const VISUAL_FEATURE_MEANINGS = {
  semanticX: {
    label: "Representational distance",
    low: "literal, conventional adjacency",
    high: "remote associative or cross-ontology adjacency",
    description: "How far the current visual logic has moved from ordinary semantic neighbors.",
  },
  semanticY: {
    label: "Ontological stability",
    low: "fixed nouns and stable categories",
    high: "processes, role exchange, and category ambiguity",
    description: "How strongly object identity is treated as a stable thing versus an emergent state.",
  },
  structure: {
    label: "Constraint structure",
    low: "loosely organized prompt behavior",
    high: "strong dependencies and load-bearing visual rules",
    description: "How much the image or video is governed by explicit relational structure.",
  },
  failure: {
    label: "Failure pressure",
    low: "representation resolves conventionally",
    high: "multiple constraints compete at known model failure surfaces",
    description: "How much structured representational instability the organism is carrying.",
  },
  memory: {
    label: "Ancestral residue",
    low: "little evidence of prior states",
    high: "mutations preserve scars, residues, and path-dependent traits",
    description: "How strongly previous visual states remain legible in the current descendant.",
  },
  temporal: {
    label: "Temporal dependence",
    low: "self-contained still state",
    high: "identity and meaning depend on change across time",
    description: "How much the organism requires frame-to-frame continuity, transformation, or temporal logic.",
  },
  topology: {
    label: "Topological pressure",
    low: "ordinary Euclidean object boundaries",
    high: "connectivity, inside/outside, loops, crossings, or surfaces are load-bearing",
    description: "How strongly connectivity and boundary relations govern the specimen.",
  },
  energy: {
    label: "Transformation intensity",
    low: "static or weakly changing state",
    high: "rapid, dense, or strongly coupled visual change",
    description: "The intensity of motion, deformation, event density, or active transformation.",
  },
} as const satisfies Record<keyof Features, VisualFeatureMeaning>;

export const VISUAL_FAILURE_SURFACES: readonly VisualFailureSurface[] = [
  {
    id: "identity_binding",
    label: "Identity binding",
    scope: "shared",
    pressureJurisdictions: ["subject_identity", "anatomy", "material"],
    description: "Competing cues disagree about which features belong to the same entity.",
    failureSignature: "Attributes migrate, duplicate, fuse, or attach to the wrong subject while recognizable identity is only partly preserved.",
  },
  {
    id: "anatomical_correspondence",
    label: "Anatomical correspondence",
    scope: "shared",
    pressureJurisdictions: ["anatomy", "geometry", "spatial_relationship"],
    description: "Part count, attachment, orientation, and functional correspondence are forced to disagree.",
    failureSignature: "Parts remain locally plausible but global body or object organization becomes inconsistent.",
  },
  {
    id: "boundary_membership",
    label: "Boundary membership",
    scope: "shared",
    pressureJurisdictions: ["boundary", "surface", "topology"],
    description: "Inside/outside and attached/separate classifications cannot all remain true at once.",
    failureSignature: "Surfaces phase through, share boundaries, invert containment, or become ambiguously embedded.",
  },
  {
    id: "material_consistency",
    label: "Material consistency",
    scope: "shared",
    pressureJurisdictions: ["material", "surface", "transformation_mechanism"],
    description: "A material is asked to preserve its identity while obeying incompatible physical behaviors.",
    failureSignature: "Matter stretches, fractures, flows, hardens, or merges in ways that preserve some material cues while violating others.",
  },
  {
    id: "topological_continuity",
    label: "Topological continuity",
    scope: "shared",
    pressureJurisdictions: ["topology", "geometry", "spatial_continuity"],
    description: "Connectivity must change while local surfaces still claim continuity.",
    failureSignature: "Holes, loops, seams, crossings, or connected components appear without a fully resolvable transition.",
  },
  {
    id: "projection_coherence",
    label: "Projection coherence",
    scope: "shared",
    pressureJurisdictions: ["perspective", "camera", "geometry"],
    description: "Multiple projection or depth logics compete inside one representation.",
    failureSignature: "Locally convincing depth cues cannot be reconciled into one global viewpoint.",
  },
  {
    id: "scale_coherence",
    label: "Scale coherence",
    scope: "shared",
    pressureJurisdictions: ["scale", "composition", "environment"],
    description: "Relative size cues imply incompatible scene scales or nested frames of reference.",
    failureSignature: "Subjects and environments remain individually legible while their shared scale becomes impossible.",
  },
  {
    id: "frame_identity",
    label: "Frame identity",
    scope: "video",
    pressureJurisdictions: ["temporal_identity", "frame_correspondence", "persistence"],
    description: "The system must decide what counts as the same entity after visible change.",
    failureSignature: "Identity drifts, swaps, duplicates, or rebinds between frames while motion remains superficially continuous.",
  },
  {
    id: "object_permanence",
    label: "Object permanence",
    scope: "video",
    pressureJurisdictions: ["object_permanence", "occlusion", "before_after"],
    description: "Hidden objects must return with compatible structure and history.",
    failureSignature: "Objects disappear behind occlusion and return altered, multiplied, merged, or replaced.",
  },
  {
    id: "trajectory_continuity",
    label: "Trajectory continuity",
    scope: "video",
    pressureJurisdictions: ["motion", "momentum", "camera_motion"],
    description: "Motion cues demand incompatible paths, velocities, or reference frames.",
    failureSignature: "Movement is locally smooth but globally cannot be assigned one continuous trajectory.",
  },
  {
    id: "causal_continuity",
    label: "Causal continuity",
    scope: "video",
    pressureJurisdictions: ["causality", "before_after", "growth_decay"],
    description: "Effects must remain visible while their causes are delayed, removed, reversed, or reassigned.",
    failureSignature: "Later structure is clearly consequential but no single earlier event can account for it.",
  },
  {
    id: "transformation_continuity",
    label: "Transformation continuity",
    scope: "video",
    pressureJurisdictions: ["transformation_mechanism", "transformation_rate", "temporal_topology"],
    description: "A transformation must preserve ancestry while changing the rules of correspondence that define that ancestry.",
    failureSignature: "Intermediate states become unstable, parts remap, and the endpoint is related to the start without a fully coherent morph.",
  },
  {
    id: "temporal_order",
    label: "Temporal order",
    scope: "video",
    pressureJurisdictions: ["time_direction", "before_after", "persistence"],
    description: "Forward, reverse, cyclic, or locally contradictory orderings compete.",
    failureSignature: "Events contain residues of outcomes that have not happened yet or causes that survive after being reversed.",
  },
  {
    id: "camera_world_separation",
    label: "Camera / world separation",
    scope: "video",
    pressureJurisdictions: ["camera_motion", "motion", "perspective"],
    description: "The system must distinguish viewpoint motion from world or subject motion under ambiguous evidence.",
    failureSignature: "Scene geometry appears to deform because camera travel and object travel cannot be cleanly separated.",
  },
] as const;

export function jurisdictionsForOutput(output: VisualOutputKind): string[] {
  return VISUAL_JURISDICTIONS
    .filter((jurisdiction) => jurisdiction.scope === "shared" || output === "video")
    .map((jurisdiction) => jurisdiction.id);
}

export function failureSurfacesForOutput(
  output: VisualOutputKind,
): VisualFailureSurface[] {
  return VISUAL_FAILURE_SURFACES.filter(
    (surface) => surface.scope === "shared" || output === "video",
  );
}

export function createVisualSpecimen(
  rawPrompt: string,
  output: VisualOutputKind,
): VisualSpecimen {
  const prompt = rawPrompt.trim();
  if (!prompt) throw new Error("A visual specimen needs a prompt to ingest.");
  return {
    rawPrompt: prompt,
    output,
    clauses: [],
    identityAnchors: [],
    explicitInvariants: [],
    decompiled: false,
  };
}

export const VISUAL_SCHEMA = {
  domainId: "visual" as const,
  outputKinds: ["image", "video"] as const,
  jurisdictions: VISUAL_JURISDICTIONS,
  featureMeanings: VISUAL_FEATURE_MEANINGS,
  failureSurfaces: VISUAL_FAILURE_SURFACES,
};
