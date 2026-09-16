import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/suggest-YcP-SeCN.js
var suggestRemoteWords_createServerFn_handler = createServerRpc({
	id: "a40f9973125a06c5a276c04af27db54c4dd31b9a5cecc9aa92b229eb6d8af2c8",
	name: "suggestRemoteWords",
	filename: "src/lib/datamuse/suggest.ts"
}, (opts) => suggestRemoteWords.__executeServer(opts));
var suggestRemoteWords = createServerFn({ method: "POST" }).validator((input) => input).handler(suggestRemoteWords_createServerFn_handler, async ({ data }) => {
	const q = data.q.trim().slice(0, 40);
	if (q.length < 2) return { words: [] };
	try {
		const [sug, ml] = await Promise.all([fetch(`https://api.datamuse.com/sug?s=${encodeURIComponent(q)}&max=12`), fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(q)}*&md=p&max=8`)]);
		const words = [];
		const seen = /* @__PURE__ */ new Set();
		if (sug.ok) {
			const rows = await sug.json();
			for (const r of rows) {
				const w = String(r.word ?? "").toLowerCase();
				if (!w || seen.has(w)) continue;
				seen.add(w);
				words.push({
					word: w,
					score: Number(r.score) || 0,
					tags: ["suggest"]
				});
			}
		}
		if (ml.ok) {
			const rows = await ml.json();
			for (const r of rows) {
				const w = String(r.word ?? "").toLowerCase();
				if (!w || seen.has(w) || w.includes(" ")) continue;
				seen.add(w);
				words.push({
					word: w,
					score: Number(r.score) || 0,
					tags: r.tags ?? []
				});
			}
		}
		return { words: words.slice(0, 16) };
	} catch {
		return { words: [] };
	}
});
//#endregion
export { suggestRemoteWords_createServerFn_handler };
