export type PromptFragment = {
  id: string;
  text: string;
  priority: number;
  mandatory?: boolean;
  compact?: string;
  expand?: string[];
};

type WorkingFragment = PromptFragment & { originalIndex: number; removed?: boolean; compacted?: boolean };

type Expansion = {
  id: string;
  text: string;
  priority: number;
  sourceIndex: number;
};

function joinFragments(items: WorkingFragment[], separator: string): string {
  return items
    .filter((item) => !item.removed && item.text.trim())
    .sort((a, b) => a.originalIndex - b.originalIndex)
    .map((item) => item.text.trim())
    .join(separator)
    .trim();
}

function chooseExpansionSubset(
  expansions: Expansion[],
  minGain: number,
  maxGain: number,
  separatorLength: number,
): Expansion[] | null {
  if (minGain <= 0) return [];
  const paths = new Map<number, number[]>();
  paths.set(0, []);

  for (let i = 0; i < expansions.length; i += 1) {
    const exp = expansions[i]!;
    const cost = exp.text.length + separatorLength;
    const snapshot = [...paths.entries()].sort((a, b) => b[0] - a[0]);
    for (const [sum, path] of snapshot) {
      const next = sum + cost;
      if (next > maxGain || paths.has(next)) continue;
      paths.set(next, [...path, i]);
    }
  }

  for (let gain = minGain; gain <= maxGain; gain += 1) {
    const path = paths.get(gain);
    if (path) return path.map((index) => expansions[index]!);
  }
  return null;
}

export function fitPromptBudget(
  fragments: PromptFragment[],
  min: number,
  max: number,
  separator: string,
): string {
  if (min < 0 || max < min) throw new Error(`Invalid prompt budget ${min}-${max}`);

  const work: WorkingFragment[] = fragments.map((fragment, originalIndex) => ({
    ...fragment,
    originalIndex,
  }));

  let text = joinFragments(work, separator);
  if (text.length > max) {
    const candidates = work
      .filter((item) => !item.mandatory)
      .sort((a, b) => a.priority - b.priority || b.originalIndex - a.originalIndex);

    for (const item of candidates) {
      if (text.length <= max) break;
      if (item.compact && item.compact.length < item.text.length) {
        item.text = item.compact;
        item.compacted = true;
        text = joinFragments(work, separator);
      }
    }

    for (const item of candidates) {
      if (text.length <= max) break;
      item.removed = true;
      text = joinFragments(work, separator);
    }
  }

  if (text.length > max) {
    throw new Error(`Mandatory prompt material exceeds ${max} characters (${text.length})`);
  }

  if (text.length < min) {
    const expansions: Expansion[] = fragments.flatMap((fragment, index) =>
      (fragment.expand ?? [])
        .map((expansion, expansionIndex) => ({
          id: `${fragment.id}:expand:${expansionIndex}`,
          text: expansion.trim(),
          priority: fragment.priority,
          sourceIndex: index,
        }))
        .filter((expansion) => expansion.text.length > 0),
    );

    expansions.sort(
      (a, b) =>
        b.priority - a.priority ||
        a.sourceIndex - b.sourceIndex ||
        a.id.localeCompare(b.id),
    );

    const separatorCost = text.length ? separator.length : 0;
    const subset = chooseExpansionSubset(
      expansions,
      min - text.length,
      max - text.length,
      separatorCost,
    );
    if (subset) {
      text = [text, ...subset.map((expansion) => expansion.text)]
        .filter(Boolean)
        .join(separator)
        .trim();
    }
  }

  if (text.length < min || text.length > max) {
    throw new Error(`Prompt budget could not be satisfied: ${text.length} not in ${min}-${max}`);
  }

  return text;
}
