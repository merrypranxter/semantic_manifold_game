import { createServerFn } from "@tanstack/react-start";

export type RemoteWord = {
  word: string;
  score: number;
  tags: string[];
};

export const suggestRemoteWords = createServerFn({ method: "POST" })
  .validator((input: { q: string }) => input)
  .handler(async ({ data }): Promise<{ words: RemoteWord[] }> => {
    const q = data.q.trim().slice(0, 40);
    if (q.length < 2) return { words: [] };
    try {
      const [sug, ml] = await Promise.all([
        fetch(`https://api.datamuse.com/sug?s=${encodeURIComponent(q)}&max=12`),
        fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(q)}*&md=p&max=8`),
      ]);
      const words: RemoteWord[] = [];
      const seen = new Set<string>();
      if (sug.ok) {
        const rows = (await sug.json()) as { word?: string; score?: number }[];
        for (const r of rows) {
          const w = String(r.word ?? "").toLowerCase();
          if (!w || seen.has(w)) continue;
          seen.add(w);
          words.push({ word: w, score: Number(r.score) || 0, tags: ["suggest"] });
        }
      }
      if (ml.ok) {
        const rows = (await ml.json()) as { word?: string; score?: number; tags?: string[] }[];
        for (const r of rows) {
          const w = String(r.word ?? "").toLowerCase();
          if (!w || seen.has(w) || w.includes(" ")) continue;
          seen.add(w);
          words.push({ word: w, score: Number(r.score) || 0, tags: r.tags ?? [] });
        }
      }
      return { words: words.slice(0, 16) };
    } catch {
      return { words: [] };
    }
  });
