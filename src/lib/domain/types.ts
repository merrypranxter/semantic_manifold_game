import type { MetricId, OrganismState } from "../manifold/types.ts";

export type DomainId = "music" | "image" | "video";

export type CompileSection = {
  id: string;
  label: string;
  text: string;
  count: number;
  max?: number;
};

export type DomainCompileOutput = {
  kind: DomainId;
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
