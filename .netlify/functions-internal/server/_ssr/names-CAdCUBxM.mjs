//#region node_modules/.nitro/vite/services/ssr/assets/names-CAdCUBxM.js
function normalizeName(s) {
	return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}
function slugFromLabel(label) {
	return normalizeName(label).replace(/\s+/g, "-").slice(0, 40) || "unnamed";
}
function titleCase(s) {
	return s.split(/\s+/).map((w) => {
		if (w.length <= 2 && w === w.toLowerCase()) return w;
		return w.charAt(0).toUpperCase() + w.slice(1);
	}).join(" ");
}
function fnv(s) {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
//#endregion
export { titleCase as i, normalizeName as n, slugFromLabel as r, fnv as t };
