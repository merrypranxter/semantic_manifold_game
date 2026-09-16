import { ArrowRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OPERATOR_HELP } from "@/lib/manifold/parser";
import type { CommandProposal, OperatorId } from "@/lib/manifold/types";
import { cn } from "@/lib/utils";

export function CommandBar({
  draft,
  pending,
  busy,
  error,
  onDraft,
  onPreview,
  onExecute,
  onOperator,
}: {
  draft: string;
  pending: CommandProposal | null;
  busy: boolean;
  error: string | null;
  onDraft: (s: string) => void;
  onPreview: () => void;
  onExecute: () => void;
  onOperator: (op: OperatorId) => void;
}) {
  return (
    <div className="border-t border-border bg-surface p-3 sm:p-4">
      <div className="mb-2 flex gap-1 overflow-x-auto pb-1">
        {OPERATOR_HELP.map((op) => (
          <button
            key={op.id}
            type="button"
            title={op.example}
            onClick={() => onOperator(op.id)}
            className="h-9 shrink-0 rounded-md bg-elevated px-2.5 text-[11px] uppercase tracking-[0.12em] text-muted transition-colors duration-150 hover:text-fg"
          >
            {op.label}
          </button>
        ))}
      </div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onExecute();
        }}
      >
        <input
          value={draft}
          onChange={(e) => {
            onDraft(e.target.value);
            onPreview();
          }}
          onBlur={onPreview}
          placeholder="install ownership · take this to the void"
          className="h-12 min-w-0 flex-1 rounded-xl bg-elevated px-4 font-mono text-sm text-fg shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_10%,transparent)] outline-none placeholder:text-muted/70 focus:shadow-[0_0_0_1px_var(--color-accent)]"
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
        />
        <Button type="submit" size="lg" disabled={busy} className="shrink-0 px-4">
          {busy ? <LoaderCircle className="animate-spin" /> : <ArrowRight />}
          <span className="hidden sm:inline">Execute</span>
        </Button>
      </form>
      <p className={cn("mt-2 font-mono text-[11px] leading-relaxed", error ? "text-danger" : "text-muted")}>
        {error
          ? error
          : pending?.installOnly
            ? pending.note
            : pending?.ejectMind
              ? pending.note
              : pending
            ? `${pending.operator}${pending.waypointLabel ? ` via ${pending.waypointLabel}` : ""} → ${pending.targetLabel || "?"} · ${pending.note}`
            : "Casual language in. Structured operations underneath. Slot a mind to change how destinations work."}
      </p>
    </div>
  );
}
