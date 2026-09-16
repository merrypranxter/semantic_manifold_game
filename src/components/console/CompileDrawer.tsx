import * as Dialog from "@radix-ui/react-dialog";
import { Check, Copy, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CAPTION_MAX,
  LYRICS_MAX,
  STYLE_MAX,
} from "@/lib/manifold/types";
import type { CompileBoxes } from "@/lib/manifold/compiler";
import { cn } from "@/lib/utils";

export function CompileDrawer({
  open,
  boxes,
  onClose,
}: {
  open: boolean;
  boxes: CompileBoxes | null;
  onClose: () => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-bg/70 data-[state=open]:animate-in" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] overflow-y-auto rounded-t-2xl bg-surface p-4 shadow-[var(--shadow-border)] sm:inset-auto sm:bottom-6 sm:left-1/2 sm:w-[min(720px,calc(100vw-2rem))] sm:-translate-x-1/2 sm:rounded-2xl sm:p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="font-display text-2xl italic text-fg">
                Compile to Suno
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted">
                Three boxes. Character counts are the app's, not the model's.
                Rules over adjectives. History is not dumped.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Close">
                <X />
              </Button>
            </Dialog.Close>
          </div>
          {boxes ? (
            <div className="space-y-4">
              {boxes.warnings.map((w) => (
                <p key={w} className="text-xs text-danger">
                  {w}
                </p>
              ))}
              <Box label="Style" text={boxes.style} count={boxes.styleCount} max={STYLE_MAX} />
              <Box label="Lyrics / Control" text={boxes.lyrics} count={boxes.lyricsCount} max={LYRICS_MAX} />
              <Box label="Caption" text={boxes.caption} count={boxes.captionCount} max={CAPTION_MAX} />
            </div>
          ) : (
            <p className="text-sm text-muted">Nothing to compile.</p>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
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
  max: number;
}) {
  const [copied, setCopied] = useState(false);
  const over = count > max;
  return (
    <section className="rounded-xl bg-elevated p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-[10px] uppercase tracking-[0.16em] text-muted">{label}</h3>
        <div className="flex items-center gap-2">
          <span className={cn("font-mono text-[11px] tabular-nums", over ? "text-danger" : "text-muted")}>
            {count}/{max}
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
      <pre className="max-h-48 overflow-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-fg">
        {text}
      </pre>
    </section>
  );
}
