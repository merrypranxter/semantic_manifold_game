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
  flyToId?: string | null;
  flyToken?: number;
  onSelect: (id: string) => void;
};

function cssVar(el: HTMLElement, name: string, fallback: string): string {
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return v || fallback;
}

const MIN_SCALE = 0.45;
const MAX_SCALE = 14;

export function ManifoldMap({
  state,
  concepts,
  metric,
  selectedId,
  wtfId,
  pendingTargetId,
  ancestry,
  flyToId,
  flyToken,
  onSelect,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const display = useRef<Record<string, Vec2>>({});
  const cam = useRef({
    x: 0,
    y: 0,
    scale: 1,
    vx: 0,
    vy: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    moved: false,
    pointers: new Map<number, { x: number; y: number }>(),
    pinch: 0,
  });
  const keys = useRef<Record<string, boolean>>({});
  const hoverId = useRef<string | null>(null);
  const fly = useRef<{ lx: number; ly: number; scale: number } | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const conceptsRef = useRef(concepts);
  conceptsRef.current = concepts;
  const hoverLabelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!flyToId) return;
    const c = conceptsRef.current.find((x) => x.id === flyToId);
    if (!c) return;
    const p = projectFeatures(c.features, metric);
    fly.current = { lx: p.x, ly: p.y, scale: 5.4 };
  }, [flyToId, flyToken, metric]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let last = performance.now();

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

    const layoutOf = (p: Vec2, w: number, h: number) => {
      const pad = 48;
      return {
        x: pad + ((p.x + 1) / 2) * (w - pad * 2),
        y: pad + (1 - (p.y + 1) / 2) * (h - pad * 2),
      };
    };

    const worldToScreen = (p: Vec2, w: number, h: number) => {
      const l = layoutOf(p, w, h);
      return {
        x: (l.x - w / 2) * cam.current.scale + w / 2 + cam.current.x,
        y: (l.y - h / 2) * cam.current.scale + h / 2 + cam.current.y,
      };
    };

    const zoomAt = (mx: number, my: number, nextScale: number) => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const scale = cam.current.scale;
      const lx = (mx - w / 2 - cam.current.x) / scale + w / 2;
      const ly = (my - h / 2 - cam.current.y) / scale + h / 2;
      const s = Math.max(MIN_SCALE, Math.min(MAX_SCALE, nextScale));
      cam.current.scale = s;
      cam.current.x = mx - w / 2 - (lx - w / 2) * s;
      cam.current.y = my - h / 2 - (ly - h / 2) * s;
    };

    const hitTest = (mx: number, my: number) => {
      const list = conceptsRef.current;
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const thresh = cam.current.scale > 3 ? 16 : 11;
      let best: { id: string; d: number } | undefined;
      for (const c of list) {
        const p = display.current[c.id];
        if (!p) continue;
        const s = worldToScreen(p, w, h);
        if (s.x < -30 || s.x > w + 30 || s.y < -30 || s.y > h + 30) continue;
        const d = Math.hypot(s.x - mx, s.y - my);
        const rad = (c.seeded ? 8 : 5) + thresh;
        if (d < rad && (!best || d < best.d)) best = { id: c.id, d };
      }
      return best?.id ?? null;
    };

    const setHoverDom = (id: string | null, x: number, y: number) => {
      const el = hoverLabelRef.current;
      if (!el) return;
      if (!id) {
        el.style.opacity = "0";
        return;
      }
      const c = conceptsRef.current.find((x) => x.id === id);
      if (!c) {
        el.style.opacity = "0";
        return;
      }
      el.textContent = c.seeded ? c.label : `${c.label}`;
      el.style.opacity = "1";
      el.style.left = `${x + 12}px`;
      el.style.top = `${y - 8}px`;
    };

    const draw = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const list = conceptsRef.current;
      const k = reduce ? 1 : 1 - Math.exp(-dt * 7);

      for (const c of list) {
        const p = projectFeatures(c.features, metric);
        const cur = display.current[c.id] ?? p;
        display.current[c.id] = { x: cur.x + (p.x - cur.x) * k, y: cur.y + (p.y - cur.y) * k };
      }
      const orgT = projectFeatures(state.features, metric);
      const orgCur = display.current.__org ?? orgT;
      display.current.__org = {
        x: orgCur.x + (orgT.x - orgCur.x) * k,
        y: orgCur.y + (orgT.y - orgCur.y) * k,
      };
      ancestry.forEach((s, i) => {
        const p = projectFeatures(s.features, metric);
        const cur = display.current[`anc_${i}`] ?? p;
        display.current[`anc_${i}`] = {
          x: cur.x + (p.x - cur.x) * k,
          y: cur.y + (p.y - cur.y) * k,
        };
      });

      const w = wrap.clientWidth;
      const h = wrap.clientHeight;

      if (fly.current) {
        const l = layoutOf({ x: fly.current.lx, y: fly.current.ly }, w, h);
        const ds = fly.current.scale;
        const tx = w / 2 - (l.x - w / 2) * ds;
        const ty = h / 2 - (l.y - h / 2) * ds;
        const fk = reduce ? 1 : 1 - Math.exp(-dt * 4.2);
        cam.current.x += (tx - cam.current.x) * fk;
        cam.current.y += (ty - cam.current.y) * fk;
        cam.current.scale += (ds - cam.current.scale) * fk;
        cam.current.vx = 0;
        cam.current.vy = 0;
        if (Math.abs(tx - cam.current.x) < 0.6 && Math.abs(ds - cam.current.scale) < 0.02) {
          fly.current = null;
        }
      } else if (!cam.current.dragging && cam.current.pointers.size < 2) {
        const speed = (220 / Math.max(0.5, cam.current.scale)) * dt;
        if (keys.current.KeyW || keys.current.ArrowUp) cam.current.y += speed;
        if (keys.current.KeyS || keys.current.ArrowDown) cam.current.y -= speed;
        if (keys.current.KeyA || keys.current.ArrowLeft) cam.current.x += speed;
        if (keys.current.KeyD || keys.current.ArrowRight) cam.current.x -= speed;
        cam.current.x += cam.current.vx;
        cam.current.y += cam.current.vy;
        const damp = Math.exp(-dt * 5.5);
        cam.current.vx *= damp;
        cam.current.vy *= damp;
        if (Math.abs(cam.current.vx) < 0.02) cam.current.vx = 0;
        if (Math.abs(cam.current.vy) < 0.02) cam.current.vy = 0;
      }

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

      const scale = cam.current.scale;
      const gridStep = scale > 3 ? 48 : 80;
      ctx.strokeStyle = "rgba(230,228,220,0.035)";
      ctx.lineWidth = 1;
      const ox = ((cam.current.x % gridStep) + gridStep) % gridStep;
      const oy = ((cam.current.y % gridStep) + gridStep) % gridStep;
      for (let x = ox - gridStep; x < w + gridStep; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = oy - gridStep; y < h + gridStep; y += gridStep) {
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
        ? list.find((c) => c.id === pendingTargetId)
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

      const labelBudget = scale < 1.4 ? 10 : scale < 2.6 ? 22 : scale < 5 ? 48 : 90;
      const labels: { x: number; y: number; text: string; seeded: boolean; sel: boolean }[] = [];
      const used: { x: number; y: number }[] = [];

      for (const c of list) {
        const p = display.current[c.id] ?? projectFeatures(c.features, metric);
        const s = worldToScreen(p, w, h);
        if (s.x < -12 || s.x > w + 12 || s.y < -12 || s.y > h + 12) continue;

        const isSel = c.id === selectedId;
        const isWtf = c.id === wtfId;
        const isHover = c.id === hoverId.current;
        const r = c.seeded ? (isSel ? 6.5 : 4.8) : isSel ? 5 : Math.max(1.1, 2.4 * c.mass * Math.min(1.4, scale / 2));

        if (isWtf) {
          ctx.strokeStyle = danger;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.arc(s.x, s.y, 13, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        ctx.fillStyle = isSel ? accent : c.seeded ? surface : accent;
        ctx.globalAlpha = c.seeded || isSel || isHover ? 1 : scale < 1.2 ? 0.35 : 0.7;
        ctx.strokeStyle = isSel ? accent : c.seeded ? muted : "rgba(126,184,201,0.35)";
        ctx.lineWidth = isSel ? 1.6 : 1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fill();
        if (c.seeded || isSel || scale > 2) ctx.stroke();
        ctx.globalAlpha = 1;

        const forceLabel = isSel || isWtf || isHover || Boolean(c.seeded && scale > 0.85);
        const wantLabel = forceLabel || scale > 3.2;
        if (wantLabel) {
          const clash = used.some((u) => Math.hypot(u.x - s.x, u.y - s.y) < 28);
          if (forceLabel || (!clash && labels.length < labelBudget)) {
            labels.push({ x: s.x, y: s.y, text: c.label, seeded: Boolean(c.seeded), sel: isSel });
            used.push({ x: s.x, y: s.y });
          }
        }
      }

      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      for (const lb of labels) {
        ctx.font = `${lb.sel || lb.seeded ? "600" : "500"} ${lb.seeded ? 12 : 10}px "IBM Plex Sans", sans-serif`;
        ctx.fillStyle = lb.sel ? fg : lb.seeded ? fg : muted;
        ctx.fillText(lb.text, lb.x + 9, lb.y);
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
      fly.current = null;
      cam.current.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (cam.current.pointers.size === 1) {
        cam.current.dragging = true;
        cam.current.moved = false;
        cam.current.lastX = e.clientX;
        cam.current.lastY = e.clientY;
        cam.current.vx = 0;
        cam.current.vy = 0;
      } else if (cam.current.pointers.size === 2) {
        const pts = [...cam.current.pointers.values()];
        cam.current.pinch = Math.hypot(pts[0]!.x - pts[1]!.x, pts[0]!.y - pts[1]!.y);
        cam.current.dragging = false;
      }
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      if (cam.current.pointers.has(e.pointerId)) {
        cam.current.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      }
      if (cam.current.pointers.size === 2) {
        const pts = [...cam.current.pointers.values()];
        const dist = Math.hypot(pts[0]!.x - pts[1]!.x, pts[0]!.y - pts[1]!.y);
        if (cam.current.pinch > 0 && dist > 0) {
          const midX = (pts[0]!.x + pts[1]!.x) / 2 - rect.left;
          const midY = (pts[0]!.y + pts[1]!.y) / 2 - rect.top;
          zoomAt(midX, midY, cam.current.scale * (dist / cam.current.pinch));
          cam.current.pinch = dist;
        }
        return;
      }
      if (cam.current.dragging) {
        const dx = e.clientX - cam.current.lastX;
        const dy = e.clientY - cam.current.lastY;
        if (Math.hypot(dx, dy) > 3) cam.current.moved = true;
        cam.current.x += dx;
        cam.current.y += dy;
        cam.current.vx = dx;
        cam.current.vy = dy;
        cam.current.lastX = e.clientX;
        cam.current.lastY = e.clientY;
      } else {
        const id = hitTest(mx, my);
        hoverId.current = id;
        setHoverDom(id, mx, my);
      }
    };
    const onUp = (e: PointerEvent) => {
      cam.current.pointers.delete(e.pointerId);
      if (cam.current.pointers.size < 2) cam.current.pinch = 0;
      if (cam.current.pointers.size === 0) {
        const wasDrag = cam.current.dragging;
        const moved = cam.current.moved;
        cam.current.dragging = false;
        if (wasDrag && !moved) {
          const rect = canvas.getBoundingClientRect();
          const id = hitTest(e.clientX - rect.left, e.clientY - rect.top);
          if (id) onSelectRef.current(id);
        }
      }
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      fly.current = null;
      const rect = canvas.getBoundingClientRect();
      const factor = e.deltaY > 0 ? 0.92 : 1.09;
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, cam.current.scale * factor);
    };
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      if (e.type === "keydown") keys.current[e.code] = true;
      else keys.current[e.code] = false;
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, [metric, state, selectedId, wtfId, pendingTargetId, ancestry]);

  const wtf = concepts.find((c) => c.id === wtfId);

  return (
    <div ref={wrapRef} className="relative h-full min-h-64 w-full overflow-hidden bg-bg">
      <canvas ref={canvasRef} className="block size-full touch-none" />
      <div
        ref={hoverLabelRef}
        className="pointer-events-none absolute rounded-md bg-surface px-2 py-1 font-mono text-[11px] text-fg opacity-0 shadow-[var(--shadow-border)]"
      />
      <div className="pointer-events-none absolute left-3 top-3 max-w-[18rem] text-[11px] uppercase tracking-[0.14em] text-muted">
        Constructed geometry · {metric.toLowerCase()} ruler · {concepts.length.toLocaleString()}
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
