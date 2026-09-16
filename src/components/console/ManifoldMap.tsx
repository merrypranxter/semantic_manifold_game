import { useEffect, useRef } from "react";
import type { Concept } from "@/lib/manifold/concepts";
import { projectFeatures, type Vec2 } from "@/lib/manifold/metrics";
import type { MetricId, OrganismState } from "@/lib/manifold/types";

type Props = {
  state: OrganismState;
  concepts: Concept[];
  metric: MetricId;
  selectedId: string | null;
  wtfId?: string;
  pendingTargetId?: string;
  ancestry: OrganismState[];
  onSelect: (id: string) => void;
};

function cssVar(el: HTMLElement, name: string, fallback: string): string {
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return v || fallback;
}

export function ManifoldMap({
  state,
  concepts,
  metric,
  selectedId,
  wtfId,
  pendingTargetId,
  ancestry,
  onSelect,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const display = useRef<Record<string, Vec2>>({});
  const cam = useRef({ x: 0, y: 0, scale: 1, dragging: false, lastX: 0, lastY: 0, moved: false });
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let last = performance.now();

    const targets = (): Record<string, Vec2> => {
      const t: Record<string, Vec2> = {};
      for (const c of concepts) t[c.id] = projectFeatures(c.features, metric);
      t.__org = projectFeatures(state.features, metric);
      ancestry.forEach((s, i) => {
        t[`anc_${i}`] = projectFeatures(s.features, metric);
      });
      return t;
    };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const worldToScreen = (p: Vec2, w: number, h: number) => {
      const pad = 56;
      const sx = pad + ((p.x + 1) / 2) * (w - pad * 2);
      const sy = pad + ((1 - (p.y + 1) / 2) * (h - pad * 2));
      return {
        x: (sx - w / 2) * cam.current.scale + w / 2 + cam.current.x,
        y: (sy - h / 2) * cam.current.scale + h / 2 + cam.current.y,
      };
    };

    const hitTest = (mx: number, my: number) => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      let best: { id: string; d: number } | undefined;
      for (const c of concepts) {
        const p = display.current[c.id] ?? projectFeatures(c.features, metric);
        const s = worldToScreen(p, w, h);
        const d = Math.hypot(s.x - mx, s.y - my);
        if (d < 22 && (!best || d < best.d)) best = { id: c.id, d };
      }
      return best?.id;
    };

    const draw = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const tgt = targets();
      const k = reduce ? 1 : 1 - Math.exp(-dt * 7);
      for (const [id, p] of Object.entries(tgt)) {
        const cur = display.current[id] ?? p;
        display.current[id] = {
          x: cur.x + (p.x - cur.x) * k,
          y: cur.y + (p.y - cur.y) * k,
        };
      }

      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const bg = cssVar(wrap, "--color-bg", "#0b0c0e");
      const surface = cssVar(wrap, "--color-surface", "#14161a");
      const fg = cssVar(wrap, "--color-fg", "#e6e4dc");
      const muted = cssVar(wrap, "--color-muted", "#8a8d94");
      const accent = cssVar(wrap, "--color-accent", "#7eb8c9");
      const danger = cssVar(wrap, "--color-danger", "#c45c4a");

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(230,228,220,0.04)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const x = (w / 8) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
        const y = (h / 6) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const org = display.current.__org ?? projectFeatures(state.features, metric);
      const orgS = worldToScreen(org, w, h);

      if (ancestry.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(126,184,201,0.28)";
        ctx.lineWidth = 1.5;
        ancestry.forEach((s, i) => {
          const p = display.current[`anc_${i}`] ?? projectFeatures(s.features, metric);
          const sp = worldToScreen(p, w, h);
          if (i === 0) ctx.moveTo(sp.x, sp.y);
          else ctx.lineTo(sp.x, sp.y);
        });
        ctx.lineTo(orgS.x, orgS.y);
        ctx.stroke();
      }

      const pending = pendingTargetId
        ? concepts.find((c) => c.id === pendingTargetId)
        : undefined;
      if (pending) {
        const p = display.current[pending.id] ?? projectFeatures(pending.features, metric);
        const sp = worldToScreen(p, w, h);
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = accent;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.moveTo(orgS.x, orgS.y);
        ctx.lineTo(sp.x, sp.y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }

      for (const c of concepts) {
        const p = display.current[c.id] ?? projectFeatures(c.features, metric);
        const s = worldToScreen(p, w, h);
        const isSel = c.id === selectedId;
        const isWtf = c.id === wtfId;
        const r = isSel ? 6.5 : 4.5;
        if (isWtf) {
          ctx.strokeStyle = danger;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.arc(s.x, s.y, 14, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        ctx.fillStyle = isSel ? accent : surface;
        ctx.strokeStyle = isSel ? accent : muted;
        ctx.lineWidth = isSel ? 1.6 : 1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.font = `${isSel ? "600" : "500"} 11px "IBM Plex Sans", sans-serif`;
        ctx.fillStyle = isSel ? fg : muted;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(c.label, s.x + 10, s.y);
      }

      for (const d of state.debris.slice(-6)) {
        const jitter = (d.id.charCodeAt(d.id.length - 1) % 7) - 3;
        ctx.fillStyle = danger;
        ctx.globalAlpha = 0.8;
        ctx.fillRect(orgS.x + jitter * 7 - 2, orgS.y + jitter * 5 - 2, 4, 4);
        ctx.globalAlpha = 1;
      }

      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(orgS.x, orgS.y, 11, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(orgS.x, orgS.y, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(orgS.x - 16, orgS.y);
      ctx.lineTo(orgS.x - 7, orgS.y);
      ctx.moveTo(orgS.x + 7, orgS.y);
      ctx.lineTo(orgS.x + 16, orgS.y);
      ctx.moveTo(orgS.x, orgS.y - 16);
      ctx.lineTo(orgS.x, orgS.y - 7);
      ctx.moveTo(orgS.x, orgS.y + 7);
      ctx.lineTo(orgS.x, orgS.y + 16);
      ctx.stroke();

      ctx.font = "italic 13px Newsreader, serif";
      ctx.fillStyle = fg;
      ctx.textAlign = "center";
      ctx.fillText(state.name, orgS.x, orgS.y + 26);

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    const onDown = (e: PointerEvent) => {
      cam.current.dragging = true;
      cam.current.moved = false;
      cam.current.lastX = e.clientX;
      cam.current.lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!cam.current.dragging) return;
      const dx = e.clientX - cam.current.lastX;
      const dy = e.clientY - cam.current.lastY;
      if (Math.hypot(dx, dy) > 3) cam.current.moved = true;
      cam.current.x += dx;
      cam.current.y += dy;
      cam.current.lastX = e.clientX;
      cam.current.lastY = e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      cam.current.dragging = false;
      if (!cam.current.moved) {
        const rect = canvas.getBoundingClientRect();
        const id = hitTest(e.clientX - rect.left, e.clientY - rect.top);
        if (id) onSelectRef.current(id);
      }
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const next = Math.max(0.6, Math.min(2.4, cam.current.scale * (e.deltaY > 0 ? 0.94 : 1.06)));
      cam.current.scale = next;
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [concepts, metric, state, selectedId, wtfId, pendingTargetId, ancestry]);

  const wtf = concepts.find((c) => c.id === wtfId);

  return (
    <div ref={wrapRef} className="relative h-full min-h-64 w-full overflow-hidden bg-bg">
      <canvas ref={canvasRef} className="block size-full touch-none" />
      <div className="pointer-events-none absolute left-3 top-3 max-w-[16rem] text-[11px] uppercase tracking-[0.14em] text-muted">
        Constructed geometry · {metric.toLowerCase()} ruler
      </div>
      {wtf ? (
        <div className="pointer-events-none absolute bottom-3 left-3 max-w-xs text-xs text-danger">
          WTF neighbor: {wtf.label}
          <span className="block text-muted">Near here, far semantically.</span>
        </div>
      ) : null}
    </div>
  );
}
