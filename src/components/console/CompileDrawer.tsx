import * as Dialog from "@radix-ui/react-dialog";
import { Check, Clapperboard, Copy, ImageIcon, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { DomainCompileOutput } from "@/lib/domain/types";
import { compileVisual } from "@/lib/domain/visual-compiler";
import type { VisualOutputKind } from "@/lib/domain/visual-schema";
import { retargetVisualOutput } from "@/lib/domain/visual-ui-core";
import { useManifold } from "@/lib/manifold/store";
import { cn } from "@/lib/utils";

export function CompileDrawer({
  open,
  boxes,
  onClose,
}: {
  open: boolean;
  boxes: DomainCompileOutput | null;
  onClose: () => void;
}) {
  const domainId = useManifold((s) => s.domainId);
  const currentId = useManifold((s) => s.currentId);
  const states = useManifold((s) => s.states);
  const state = currentId ? states[currentId] : undefined;
  const nativeOutput: VisualOutputKind =
    state?.provenance?.outputKind === "video" ? "video" : "image";
  const [visualOutput, setVisualOutput] = useState<VisualOutputKind>(nativeOutput);

  useEffect(() => {
    if (open && domainId === "visual") setVisualOutput(nativeOutput);
  }, [open, domainId, nativeOutput]);

  const rendered = useMemo(() => {
    if (domainId !== "visual" || !state) return boxes;
    const lens = retargetVisualOutput(state, visualOutput);
    return compileVisual(lens, visualOutput);
  }, [boxes, domainId, state, visualOutput]);

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-bg/70 data-[state=open]:animate-in" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] overflow-y-auto rounded-t-2xl bg-surface p-4 shadow-[var(--shadow-border)] sm:inset-auto sm:bottom-6 sm:left-1/2 sm:w-[min(760px,calc(100vw-2rem))] sm:-translate-x-1/2 sm:rounded-2xl sm:p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="font-display text-2xl italic text-fg">
                {rendered?.title ?? "Compile"}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted">
                {rendered?.description ?? "Nothing to compile yet."}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Close">
                <X />
              </Button>
            </Dialog.Close>
          </div>

          {domainId === "visual" && state ? (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-y border-border py-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Rendering lens</p>
                <p className="mt-0.5 text-xs text-muted">Switch output without creating a new generation or changing ancestry.</p>
              </div>
              <div className="flex rounded-lg bg-bg p-1 shadow-[var(--shadow-border)]">
                <LensButton
                  active={visualOutput === "image"}
                  onClick={() => setVisualOutput("image")}
                  icon={<ImageIcon className="size-3.5" />}
                >
                  Image
                </LensButton>
                <LensButton
                  active={visualOutput === "video"}
                  onClick={() => setVisualOutput("video")}
                  icon={<Clapperboard className="size-3.5" />}
                >
                  Video
                </LensButton>
              </div>
            </div>
          ) : null}

          {rendered ? (
            <div className="space-y-4">
              {rendered.warnings.map((w) => (
                <p key={w} className="text-xs text-danger">
                  {w}
                </p>
              ))}
              {rendered.sections.map((section) => (
                <Box
                  key={section.id}
                  label={section.label}
                  text={section.text}
                  count={section.count}
                  max={section.max}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">Nothing to compile.</p>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function LensButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex h-9 items-center gap-2 rounded-md px-3 text-xs transition-colors",
        active ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function Box({
  label,
  text,
  count,
  max,
}: {
  label: string;
  text: string;
  count: number;
  max?: number;
}) {
  const [copied, setCopied] = useState(false);
  const over = typeof max === "number" && count > max;
  return (
    <section className="rounded-xl bg-elevated p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-[10px] uppercase tracking-[0.16em] text-muted">{label}</h3>
        <div className="flex items-center gap-2">
          <span className={cn("font-mono text-[11px] tabular-nums", over ? "text-danger" : "text-muted")}>
            {typeof max === "number" ? `${count}/${max}` : count}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await navigator.clipboard.writeText(text);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1200);
            }}
          >
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>
      <pre className="max-h-64 overflow-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-fg">
        {text}
      </pre>
    </section>
  );
}
