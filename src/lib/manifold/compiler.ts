import type { OrganismState } from "./types.ts";
import { renderSuno, type SunoRender } from "../suno/render.ts";

export type CompileBoxes = SunoRender;

export function compileSuno(state: OrganismState): CompileBoxes {
  return renderSuno(state);
}
