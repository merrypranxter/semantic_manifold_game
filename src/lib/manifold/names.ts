export function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugFromLabel(label: string): string {
  return normalizeName(label).replace(/\s+/g, "-").slice(0, 40) || "unnamed";
}

export function titleCase(s: string): string {
  return s
    .split(/\s+/)
    .map((w) => {
      if (w.length <= 2 && w === w.toLowerCase()) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
}

export function fnv(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
