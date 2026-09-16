import { Check, Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { OrganismState } from "@/lib/manifold/types";
import {
  CAPTION_MAX,
  CAPTION_MIN,
  LYRICS_MAX,
  LYRICS_MIN,
  STYLE_MAX,
  STYLE_MIN,
} from "@/lib/manifold/types";
import type { SunoRender } from "@/lib/suno/render";
import { cn } from "@/lib/utils";
import { MutationDiff } from "./MutationDiff";

type PromptTab = "style" | "lyrics" | "caption";

const TAB_META: Record<PromptTab, { label: string; min: number; max: number }> = {
  style: { label: "STYLE", min: STYLE_MIN, max: STYLE_MAX },
  lyrics: { label: "LYRICS / CONTROL", min: LYRICS_MIN, max: LYRICS_MAX },
  caption: { label: "CAPTION", min: CAPTION_MIN, max: CAPTION_MAX },
};

function textFor(prompt: SunoRender, tab: PromptTab): string {
  return tab === "style" ? prompt.style : tab === "lyrics" ? prompt.lyrics : prompt.caption;
}

export function LivingPromptPanel({ state, prompt }: { state: OrganismState; prompt: SunoRender }) {
  const [tab, setTab] = useState<PromptTab>("style");
  const [copied, setCopied] = useState<string | null>(null);
  const text = textFor(prompt, tab);
  const meta = TAB_META[tab];
  const valid = text.length >= meta.min && text.length <= meta.max;
  const mutationNames = useMemo(
    () => [
      ...(state.lastMutationDiff?.mutated ?? []),
      ...(state.lastMutationDiff?.added ?? []),
      ...(state.lastMutationDiff?.scarred ?? []),
    ].map((name) => name.toLowerCase()),
    [state.lastMutationDiff],
  );

  const copy = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied((current) => (current === label ? null : current)), 1200);
  };

  const copyAll = () =>
    copy(
      "all",
      `STYLE\n\n${prompt.style}\n\nLYRICS / CONTROL\n\n${prompt.lyrics}\n\nCAPTION\n\n${prompt.caption}`,
    );

  const locked = state.traits.filter((trait) => trait.locked).length;

  return (
    <section className="flex h-full min-h-0 flex-col bg-surface">
      <div className="border-b border-border px-4 py-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-accent">Current Suno organism</p>
            <h2 className="mt-1 font-display text-2xl italic leading-tight text-fg sm:text-3xl">{state.name}</h2>
            <p className="mt-1 font-mono text-[10px] text-muted">
              generation {state.generation} · {state.scars.length} scars · {locked} locked · seed {state.seedId}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void copyAll()}>
            {copied === "all" ? <Check /> : <Copy />}
            Copy all
          </Button>
        </div>
        <div className="mt-3">
          <MutationDiff diff={state.lastMutationDiff} compact />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1 border-b border-border px-3 py-2">
        {(Object.keys(TAB_META) as PromptTab[]).map((id) => {
          const box = textFor(prompt, id);
          const m = TAB_META[id];
          const ok = box.length >= m.min && box.length <= m.max;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "rounded-lg px-3 py-2 font-mono text-[10px] uppercase tracking-wide transition",
                tab === id ? "bg-accent text-accent-fg" : "bg-elevated text-muted hover:text-fg",
              )}
            >
              {m.label} <span className={cn("ml-1", ok ? "opacity-70" : "text-danger")}>{box.length}</span>
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-2 px-1 font-mono text-[10px]">
          <span className={valid ? "text-lime-300" : "text-danger"}>
            {valid ? "VALID" : "OUT OF RANGE"} · {text.length}/{meta.min}-{meta.max}
          </span>
          <Button variant="ghost" size="icon-sm" onClick={() => void copy(tab, text)} aria-label={`Copy ${meta.label}`}>
            {copied === tab ? <Check /> : <Copy />}
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-fg/95 sm:text-[13px]">
          {text.split("\n").map((line, index) => {
            const hit = mutationNames.some((name) => name && line.toLowerCase().includes(name));
            return (
              <span
                key={`${index}-${line.slice(0, 12)}`}
                className={cn("block min-h-[1.25em]", hit && "-mx-1 rounded border-l-2 border-accent bg-accent/10 px-1")}
              >
                {line || "\u00a0"}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
