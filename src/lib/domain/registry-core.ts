import type { DomainId, DomainProfile } from "./types.ts";

export type DomainRegistry = Partial<Record<DomainId, DomainProfile>>;

export function resolveDomainProfile(
  registry: DomainRegistry,
  id: DomainId,
  fallback: DomainId,
): DomainProfile {
  const profile = registry[id] ?? registry[fallback];
  if (!profile) {
    throw new Error(`No domain profile registered for ${id} or fallback ${fallback}`);
  }
  return profile;
}
