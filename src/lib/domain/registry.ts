import { musicProfile } from "./profiles/music.ts";
import { resolveDomainProfile, type DomainRegistry } from "./registry-core.ts";
import type { DomainId, DomainProfile } from "./types.ts";

const DOMAIN_REGISTRY: DomainRegistry = {
  music: musicProfile,
};

export function getDomainProfile(id: DomainId): DomainProfile {
  return resolveDomainProfile(DOMAIN_REGISTRY, id, "music");
}

export function registeredDomainProfiles(): DomainProfile[] {
  return Object.values(DOMAIN_REGISTRY).filter(
    (profile): profile is DomainProfile => Boolean(profile),
  );
}
