import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MINDS,
  RACKS,
  getMind,
  padMind,
  type MindDef,
  type MindRack as RackId,
} from "@/lib/manifold/minds";
import { cn } from "@/lib/utils";

export function MindRack({
  open,
  onClose,
  installedId,
  history,
  onSlot,
  onEject,
}: {
  open: boolean;
  onClose: () => void;
  installedId?: string | null;
  history: string[];
  onSlot: (id: string) => void;
  onEject: () => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const installed = getMind(installedId);
  const selected = getMind(picked) ?? installed ?? MINDS[0];

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-bg/80" />
        <Dialog.Content className="fixed inset-3 z-50 flex flex-col overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-border)] sm:inset-6">
          <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
            <div>
              <Dialog.Title className="font-display text-xl italic text-fg">
                Temporary minds
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-xs text-muted">
                Twenty-six slottable cognitive modules. One at a time. A hidden
                constraint on travel — not a theme, not a prompt dump.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Close rack">
                <X />
              </Button>
            </Dialog.Close>
          </div>

          {installed ? (
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-elevated px-4 py-2">
              <p className="font-mono text-[11px] text-accent">
                SLOTTED {padMind(installed.n)} {installed.label.toUpperCase()}
                <span className="ml-2 text-muted">· {installed.rack}</span>
              </p>
              <Button variant="outline" size="sm" onClick={onEject}>
                Eject
              </Button>
            </div>
          ) : (
            <p className="border-b border-border px-4 py-2 font-mono text-[11px] text-muted">
              Empty slot. Pick a module. Type “install ownership” or click below.
            </p>
          )}

          <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="min-h-0 overflow-y-auto px-4 py-3">
              {RACKS.map((rack) => (
                <RackGroup
                  key={rack.id}
                  rack={rack.id}
                  label={rack.label}
                  blurb={rack.blurb}
                  installedId={installedId}
                  selectedId={selected?.id}
                  onPick={setPicked}
                />
              ))}
            </div>
            {selected ? (
              <MindDetail
                mind={selected}
                installed={installed?.id === selected.id}
                parents={parentNames(history)}
                onSlot={() => {
                  onSlot(selected.id);
                  setPicked(selected.id);
                }}
                onEject={onEject}
              />
            ) : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function parentNames(history: string[]): string {
  const last = history.filter((id) => id !== "speciation").slice(-2);
  const labels = last.map((id) => getMind(id)?.label).filter(Boolean);
  if (labels.length < 2) return "Needs two prior slotted minds in the ledger.";
  return `${labels[0]} × ${labels[1]}`;
}

function RackGroup({
  rack,
  label,
  blurb,
  installedId,
  selectedId,
  onPick,
}: {
  rack: RackId;
  label: string;
  blurb: string;
  installedId?: string | null;
  selectedId?: string;
  onPick: (id: string) => void;
}) {
  const minds = MINDS.filter((m) => m.rack === rack);
  return (
    <section className="mb-6">
      <div className="mb-2">
        <h3 className="text-[10px] uppercase tracking-[0.16em] text-muted">{label}</h3>
        <p className="text-xs text-muted">{blurb}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {minds.map((m) => {
          const on = installedId === m.id;
          const sel = selectedId === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onPick(m.id)}
              className={cn(
                "min-h-16 rounded-xl bg-elevated px-3 py-2 text-left shadow-[var(--shadow-border)] transition-[box-shadow,background-color] duration-150",
                "hover:shadow-[var(--shadow-border-hover)]",
                on && "bg-accent text-accent-fg shadow-none",
                sel && !on && "shadow-[0_0_0_1px_var(--color-accent)]",
              )}
            >
              <span className={cn("font-mono text-[10px] tracking-wide", on ? "opacity-80" : "text-muted")}>
                {padMind(m.n)}
              </span>
              <span className="block text-sm leading-tight">{m.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function MindDetail({
  mind,
  installed,
  parents,
  onSlot,
  onEject,
}: {
  mind: MindDef;
  installed: boolean;
  parents: string;
  onSlot: () => void;
  onEject: () => void;
}) {
  return (
    <aside className="flex min-h-0 flex-col border-t border-border bg-bg lg:border-l lg:border-t-0">
      <div className="border-b border-border px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          {padMind(mind.n)} · {mind.rack}
        </p>
        <h3 className="font-display text-2xl italic leading-tight text-fg">{mind.label}</h3>
        <p className="mt-1 text-xs text-muted">{mind.full}</p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <p className="text-sm leading-relaxed text-fg">{mind.whatItDoes}</p>
        <ol className="mt-4 space-y-2">
          {mind.procedure.map((step, i) => (
            <li key={i} className="flex gap-2 text-xs leading-relaxed text-muted">
              <span className="font-mono text-accent">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        {mind.id === "speciation" ? (
          <p className="mt-4 font-mono text-[11px] text-muted">Parents: {parents}</p>
        ) : null}
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          Speak it · install {mind.label.toLowerCase()}
        </p>
      </div>
      <div className="border-t border-border p-3">
        {installed ? (
          <Button variant="outline" className="w-full" onClick={onEject}>
            Eject {mind.label}
          </Button>
        ) : (
          <Button className="w-full" onClick={onSlot}>
            Slot {mind.label}
          </Button>
        )}
      </div>
    </aside>
  );
}
