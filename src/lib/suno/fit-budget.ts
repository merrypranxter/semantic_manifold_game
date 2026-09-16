export type PromptFragment = {
  id: string;
  text: string;
  priority: number;
  mandatory?: boolean;
  compact?: string;
  expand?: string[];
};

type WorkingFragment = PromptFragment & { originalIndex: number; removed?: boolean; compacted?: boolean };

function joinFragments(items: WorkingFragment[], separator: string): string {
  return items
    .filter((item) => !item.removed && item.text.trim())
    .sort((a, b) => a.originalIndex - b.originalIndex)
    .map((item) => item.text.trim())
    .join(separator)
    .trim();
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
    const expansions = fragments.flatMap((fragment, index) =>
      (fragment.expand ?? []).map((expansion, expansionIndex) => ({
        id: `${fragment.id}:expand:${expansionIndex}`,
        text: expansion.trim(),
        priority: fragment.priority,
        sourceIndex: index,
      })),
    );

    expansions.sort(
      (a, b) =>
        b.priority - a.priority ||
        a.sourceIndex - b.sourceIndex ||
        a.id.localeCompare(b.id),
    );

    const appended: string[] = [];
    for (const expansion of expansions) {
      const candidate = [text, ...appended, expansion.text].filter(Boolean).join(separator).trim();
      if (candidate.length <= max) {
        appended.push(expansion.text);
        if (candidate.length >= min) {
          text = candidate;
          break;
        }
      }
    }

    if (text.length < min && appended.length) {
      text = [text, ...appended].filter(Boolean).join(separator).trim();
    }
  }

  if (text.length < min || text.length > max) {
    throw new Error(`Prompt budget could not be satisfied: ${text.length} not in ${min}-${max}`);
  }

  return text;
}
