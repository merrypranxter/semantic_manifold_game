import type { DomainId } from "./types.ts";
import type { OrganismState } from "../manifold/types.ts";

/**
 * The organism is the authoritative source of its medium when provenance exists.
 * This repairs stale persisted/global domain flags left behind by older builds or
 * branch swaps without misclassifying legacy organisms that predate provenance.
 */
export function domainIdForOrganism(
  state: OrganismState | null | undefined,
  storedDomain: DomainId,
): DomainId {
  const provenanceDomain = state?.provenance?.domain;
  if (provenanceDomain === "visual") return "visual";
  if (provenanceDomain === "music") return "music";
  return storedDomain;
}
