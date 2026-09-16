import * as Dialog from "@radix-ui/react-dialog";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SPEC_HREF = "/docs/design-specification-v0.1.pdf";

export function SpecDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-bg/80" />
        <Dialog.Content className="fixed inset-3 z-50 flex flex-col overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-border)] sm:inset-6">
          <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
            <div>
              <Dialog.Title className="font-display text-xl italic text-fg">
                Design spec v0.1
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-xs text-muted">
                The operating contract. Not a tutorial — the thing the instrument is
                supposed to obey.
              </Dialog.Description>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon-sm" asChild>
                <a href={SPEC_HREF} download aria-label="Download specification">
                  <Download />
                </a>
              </Button>
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Close specification">
                  <X />
                </Button>
              </Dialog.Close>
            </div>
          </div>
          <iframe
            title="Semantic Manifold Game design specification"
            src={SPEC_HREF}
            className="min-h-0 w-full flex-1 bg-bg"
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
