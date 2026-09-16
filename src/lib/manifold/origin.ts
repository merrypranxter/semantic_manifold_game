import type { OrganismState } from "./types.ts";
import { createSeedOrigin } from "../suno/seeds.ts";

export function createOrigin(seedId = "productive-contradiction"): OrganismState {
  return createSeedOrigin(seedId);
}
