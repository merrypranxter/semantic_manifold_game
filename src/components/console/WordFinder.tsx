import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { searchConcepts, type Concept } from "@/lib/manifold/concepts";
import { suggestRemoteWords, type RemoteWord } from "@/lib/datamuse/suggest";
import { useManifold } from "@/lib/manifold/store";
import { cn } from "@/lib/utils";

export function WordFinder({
  extra,
  onPick,
  onNovel,
}: {
  extra: Concept[];
  onPick: (concept: Concept) => void;
  onNovel: (label: string) => void;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [remote, setRemote] = useState<RemoteWord[]>([]);
  const domainId = useManifold((s) => s.domainId);

  const local = useMemo(() => searchConcepts(q, extra, 14), [q, extra]);

  useEffect(() => {
    const n = q.trim();
    if (n.length < 2) {
      setRemote([]);
      return;
    }
    if (local.length >= 8) {
      setRemote([]);
      return;
    }
    const t = window.setTimeout(() => {
      void suggestRemoteWords({ data: { q: n } }).then((res) => {
        const have = new Set(local.map((c) => c.label.toLowerCase()));
        setRemote(res.words.filter((w) => !have.has(w.word)));
      });
    }, 280);
    return () => window.clearTimeout(t);
  }, [q, local]);

  const novel =
    q.trim().length >= 2 &&
    !local.some((c) => c.label.toLowerCase() === q.trim().toLowerCase());

  const chooseNovel = (label: string) => {
    const clean = label.trim();
    if (!clean) return;
    if (domainId !== "visual") {
      onNovel(clean);
      return;
    }

    // Visual concepts must be transduced against the current specimen at travel
    // time. Do not plant a generic lexicon donor into customConcepts first.
    const next = `take this to ${clean}`;
    const store = useManifold.getState();
    store.setSelectedConcept(null);
    store.setDraft(next);
    store.previewCommand(next);
  };

  return (
    <div className="relative min-w-0 flex-1 sm:max-w-xs">
      <label className="sr-only" htmlFor="word-finder">
        Find a word
      </label>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted" />
      <input
        id="word-finder"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 180)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const first = local[0];
            if (first) {
              onPick(first);
              setQ(first.label);
              setOpen(false);
            } else if (novel) {
              chooseNovel(q.trim());
              setOpen(false);
            }
          }
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder={domainId === "visual" ? "Find a destination — any concept" : "Find a word — any word"}
        className="h-9 w-full rounded-md bg-elevated pl-8 pr-3 font-mono text-xs text-fg shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_10%,transparent)] outline-none placeholder:text-muted/70 focus:shadow-[0_0_0_1px_var(--color-accent)]"
        autoCapitalize="off"
        autoComplete="off"
        spellCheck={false}
      />
      {open && q.trim().length >= 1 ? (
        <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg bg-surface py-1 shadow-[var(--shadow-border)]">
          {local.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className="flex w-full items-baseline justify-between gap-2 px-3 py-1.5 text-left hover:bg-elevated"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onPick(c);
                  setQ(c.label);
                  setOpen(false);
                }}
              >
                <span className={cn("text-sm", c.seeded ? "text-accent" : "text-fg")}>
                  {c.label}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                  {c.seeded ? "seeded" : c.family ?? "field"}
                </span>
              </button>
            </li>
          ))}
          {remote.slice(0, 6).map((w) => (
            <li key={`r-${w.word}`}>
              <button
                type="button"
                className="flex w-full items-baseline justify-between gap-2 px-3 py-1.5 text-left hover:bg-elevated"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  chooseNovel(w.word);
                  setQ(w.word);
                  setOpen(false);
                }}
              >
                <span className="text-sm text-fg">{w.word}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                  dictionary
                </span>
              </button>
            </li>
          ))}
          {novel && local.length === 0 && remote.length === 0 ? (
            <li>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm text-accent hover:bg-elevated"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  chooseNovel(q.trim());
                  setOpen(false);
                }}
              >
                {domainId === "visual"
                  ? `Use “${q.trim()}” as a destination`
                  : `Plant “${q.trim()}” as a region`}
              </button>
            </li>
          ) : null}
          {local.length === 0 && remote.length === 0 && !novel ? (
            <li className="px-3 py-2 text-xs text-muted">No matches in the field.</li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
