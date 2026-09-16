import type { MetricId, OrganismState } from "../manifold/types.ts";

/** Broad evolutionary medium. Image and video share one visual organism. */
export type DomainId = "music" | "visual";

/** Concrete artifact produced by a domain compiler. */
export type CompileKind = "music" | "image" | "video";

export type CompileSection = {
  id: string;
  label: string;
  text: string;
  count: number;
  max?: number;
};

export type DomainCompileOutput = {
  kind: CompileKind;
  title: string;
  description: string;
  sections: CompileSection[];
  warnings: string[];
};

export type DomainProfile = {
  id: DomainId;
  label: string;
  description: string;
  jurisdictions: readonly string[];
  defaultMetric: MetricId;
  idleHint: string;
  beginHint: string;
  createOrigin: () => OrganismState;
  compile: (state: OrganismState) => DomainCompileOutput;
};
