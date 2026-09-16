import type { OrganismState } from "../manifold/types.ts";
import { renderCaption } from "./render-caption.ts";
import { renderLyrics } from "./render-lyrics.ts";
import { renderStyle } from "./render-style.ts";

export type SunoRender = {
  style: string;
  lyrics: string;
  caption: string;
  styleCount: number;
  lyricsCount: number;
  captionCount: number;
  warnings: string[];
};

export function renderSuno(state: OrganismState): SunoRender {
  const style = renderStyle(state);
  const lyrics = renderLyrics(state);
  const caption = renderCaption(state);
  return {
    style,
    lyrics,
    caption,
    styleCount: style.length,
    lyricsCount: lyrics.length,
    captionCount: caption.length,
    warnings: [],
  };
}
