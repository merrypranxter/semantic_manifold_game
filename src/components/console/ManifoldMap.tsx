import { useEffect, useRef } from "react";
import type { Concept } from "@/lib/manifold/concepts";
import { familyFill } from "@/lib/manifold/families";
import { projectFeatures3, type Vec3 } from "@/lib/manifold/metrics";
import type { MapMode, MetricId, OrganismState } from "@/lib/manifold/types";

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
  mode: MapMode;
  familyFilter: string;
  onSelect: (id: string) => void;
};

type Cam = {
  x: number;
  y: number;
  yaw: number;
  speed: number;
  dist: number;
  tilt: number;
  vx: number;
  vy: number;
  dragging: boolean;
  orbiting: boolean;
  lastX: number;
  lastY: number;
  moved: boolean;
  pointers: Map<number, { x: number; y: number }>;
  pinch: number;
};

function cssVar(el: HTMLElement, name: string, fallback: string): string {
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return v || fallback;
}

const MIN_DIST = 0.22;
const MAX_DIST = 3.6;
const MIN_TILT = 0.12;
const MAX_TILT = 1.18;

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      setKeys: (codes: string[]) => void;
    };
  }
}

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
  mode,
  familyFilter,
  onSelect,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const hoverLabelRef = useRef<HTMLDivElement>(null);
  const display = useRef<Record<string, Vec3>>({});
  const cam = useRef<Cam>({
    x: 0,
    y: 0,
    yaw: 0,
    speed: 0,
    dist: 1.55,
    tilt: 0.62,
    vx: 0,
    vy: 0,
    dragging: false,
    orbiting: false,
    lastX: 0,
    lastY: 0,
    moved: false,
    pointers: new Map(),
    pinch: 0,
  });
  const keys = useRef<Record<string, boolean>>({});
  const injectedKeys = useRef<string[] | null>(null);
  const hoverId = useRef<string | null>(null);
  const fly = useRef<{ x: number; y: number; dist: number } | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const conceptsRef = useRef(concepts);
  conceptsRef.current = concepts;
  const stateRef = useRef(state);
  stateRef.current = state;
  const metricRef = useRef(metric);
  metricRef.current = metric;
  const selectedRef = useRef(selectedId);
  selectedRef.current = selectedId;
  const wtfRef = useRef(wtfId);
  wtfRef.current = wtfId;
  const pendingRef = useRef(pendingTargetId);
  pendingRef.current = pendingTargetId;
  const ancestryRef = useRef(ancestry);
  ancestryRef.current = ancestry;
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const familyRef = useRef(familyFilter);
  familyRef.current = familyFilter;

  useEffect(() => {
    if (!flyToId) return;
    const c = conceptsRef.current.find((x) => x.id === flyToId);
    if (!c) return;
    const p = projectFeatures3(c.features, metricRef.current);
    fly.current = { x: p.x, y: p.y, dist: 0.48 };
  }, [flyToId, flyToken]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let last = performance.now();
    let prevMetric = metricRef.current;
    let blendUntil = performance.now() + 400;

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

    const held = (code: string) => {
      if (injectedKeys.current) return injectedKeys.current.includes(code);
      return Boolean(keys.current[code]);
    };

    window.__controlsTest = {
      getYaw: () => cam.current.yaw,
      getSpeed: () => Math.abs(cam.current.speed),
      setKeys: (codes) => {
        injectedKeys.current = codes;
      },
    };

    const basis = () => {
      const yaw = cam.current.yaw;
      return {
        fx: -Math.sin(yaw),
        fy: Math.cos(yaw),
        rx: Math.cos(yaw),
        ry: Math.sin(yaw),
      };
    };

    const project = (p: Vec3, w: number, h: number) => {
      const { fx, fy } = basis();
      const dist = cam.current.dist;
      const tilt = cam.current.tilt;
      const st = Math.sin(tilt);
      const ct = Math.cos(tilt);
      const eyeX = cam.current.x - fx * dist * st;
      const eyeY = cam.current.y - fy * dist * st;
      const eyeZ = dist * ct + 0.06;
      const lookX = cam.current.x + fx * 0.08;
      const lookY = cam.current.y + fy * 0.08;
      let fwx = lookX - eyeX;
      let fwy = lookY - eyeY;
      let fwz = 0 - eyeZ;
      const fl = Math.hypot(fwx, fwy, fwz) || 1;
      fwx /= fl;
      fwy /= fl;
      fwz /= fl;
      let rdx = fwy;
      let rdy = -fwx;
      let rdz = 0;
      const rl = Math.hypot(rdx, rdy, rdz) || 1;
      rdx /= rl;
      rdy /= rl;
      rdz /= rl;
      const ux = rdy * fwz - rdz * fwy;
      const uy = rdz * fwx - rdx * fwz;
      const uz = rdx * fwy - rdy * fwx;
      const vx = p.x - eyeX;
      const vy = p.y - eyeY;
      const vz = p.z - eyeZ;
      const depth = vx * fwx + vy * fwy + vz * fwz;
      if (depth < 0.08) return null;
      const cx = vx * rdx + vy * rdy + vz * rdz;
      const cy = vx * ux + vy * uy + vz * uz;
      const f = h * 0.72;
      return {
        x: w / 2 + (cx / depth) * f,
        y: h / 2 - (cy / depth) * f,
        depth,
      };
    };

    const hitTest = (mx: number, my: number) => {
      const list = conceptsRef.current;
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const fam = familyRef.current;
      let best: { id: string; d: number } | undefined;
      for (const c of list) {
        if (fam !== "all" && c.family !== fam && !c.seeded) continue;
        const p = display.current[c.id];
        if (!p) continue;
        const s = project(p, w, h);
        if (!s) continue;
        if (s.x < -20 || s.x > w + 20 || s.y < -20 || s.y > h + 20) continue;
        const rad = (c.seeded ? 14 : 9) / Math.max(0.35, s.depth);
        const d = Math.hypot(s.x - mx, s.y - my);
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
      const c = conceptsRef.current.find((item) => item.id === id);
      if (!c) {
        el.style.opacity = "0";
        return;
      }
      const gift = c.donations[0];
      const fam = c.family ?? "seeded";
      el.replaceChildren();
      const strong = document.createElement("strong");
      strong.textContent = c.label;
      const meta = document.createElement("span");
      meta.textContent = `${fam} · ${c.fracturePlane}`;
      el.append(strong, meta);
      if (gift) {
        const em = document.createElement("em");
        em.textContent = gift.name;
        const rule = document.createTextNode(gift.rule);
        el.append(em, rule);
      } else {
        el.append(document.createTextNode(c.whatItDoes));
      }
      el.style.opacity = "1";
      const pad = 12;
      el.style.left = `${Math.min(x + pad, wrap.clientWidth - 240)}px`;
      el.style.top = `${Math.max(8, y - 8)}px`;
    };

    const draw = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const list = conceptsRef.current;
      const metricNow = metricRef.current;
      if (metricNow !== prevMetric) {
        prevMetric = metricNow;
        blendUntil = now + 480;
      }
      const blending = now < blendUntil;
      const k = reduce ? 1 : 1 - Math.exp(-dt * 6.2);
      const stateNow = stateRef.current;

      if (blending) {
        for (const c of list) {
          const p = projectFeatures3(c.features, metricNow);
          const cur = display.current[c.id] ?? p;
          display.current[c.id] = {
            x: cur.x + (p.x - cur.x) * k,
            y: cur.y + (p.y - cur.y) * k,
            z: cur.z + (p.z - cur.z) * k,
          };
        }
      } else {
        for (const c of list) {
          if (!display.current[c.id]) {
            display.current[c.id] = projectFeatures3(c.features, metricNow);
          }
        }
      }
      const orgT = projectFeatures3(stateNow.features, metricNow);
      const orgCur = display.current.__org ?? orgT;
      display.current.__org = {
        x: orgCur.x + (orgT.x - orgCur.x) * k,
        y: orgCur.y + (orgT.y - orgCur.y) * k,
        z: orgCur.z + (orgT.z - orgCur.z) * k,
      };
      ancestryRef.current.forEach((s, i) => {
        const p = projectFeatures3(s.features, metricNow);
        const cur = display.current[`anc_${i}`] ?? p;
        display.current[`anc_${i}`] = {
          x: cur.x + (p.x - cur.x) * k,
          y: cur.y + (p.y - cur.y) * k,
          z: cur.z + (p.z - cur.z) * k,
        };
      });

      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const { fx, fy, rx, ry } = basis();

      if (fly.current) {
        const fk = reduce ? 1 : 1 - Math.exp(-dt * 3.6);
        cam.current.x += (fly.current.x - cam.current.x) * fk;
        cam.current.y += (fly.current.y - cam.current.y) * fk;
        cam.current.dist += (fly.current.dist - cam.current.dist) * fk;
        cam.current.speed = 0;
        cam.current.vx = 0;
        cam.current.vy = 0;
        if (
          Math.hypot(fly.current.x - cam.current.x, fly.current.y - cam.current.y) < 0.01 &&
          Math.abs(fly.current.dist - cam.current.dist) < 0.02
        ) {
          fly.current = null;
        }
      } else if (modeRef.current === "TRACK") {
        const tk = reduce ? 1 : 1 - Math.exp(-dt * 3.2);
        cam.current.x += (orgT.x - cam.current.x) * tk;
        cam.current.y += (orgT.y - cam.current.y) * tk;
        cam.current.speed = 0;
      } else if (!cam.current.dragging && !cam.current.orbiting && cam.current.pointers.size < 2) {
        let steer = 0;
        if (held("KeyA") || held("ArrowLeft")) steer += 1;
        if (held("KeyD") || held("ArrowRight")) steer -= 1;
        cam.current.yaw += steer * 1.85 * dt;

        let thrust = 0;
        if (held("KeyW") || held("ArrowUp")) thrust += 1;
        if (held("KeyS") || held("ArrowDown")) thrust -= 1;
        const maxSp = 0.55 + cam.current.dist * 0.55;
        if (thrust !== 0) {
          cam.current.speed += thrust * 1.7 * dt;
          cam.current.speed = Math.max(-maxSp, Math.min(maxSp, cam.current.speed));
        } else {
          cam.current.speed *= Math.exp(-dt * 3.4);
          if (Math.abs(cam.current.speed) < 0.002) cam.current.speed = 0;
        }
        cam.current.x += fx * cam.current.speed * dt;
        cam.current.y += fy * cam.current.speed * dt;
        cam.current.x += cam.current.vx * dt;
        cam.current.y += cam.current.vy * dt;
        const damp = Math.exp(-dt * 5.2);
        cam.current.vx *= damp;
        cam.current.vy *= damp;

        if (held("KeyQ")) cam.current.tilt = Math.max(MIN_TILT, cam.current.tilt - 0.7 * dt);
        if (held("KeyE")) cam.current.tilt = Math.min(MAX_TILT, cam.current.tilt + 0.7 * dt);
      }

      cam.current.x = Math.max(-1.45, Math.min(1.45, cam.current.x));
      cam.current.y = Math.max(-1.45, Math.min(1.45, cam.current.y));

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const bg = cssVar(wrap, "--color-bg", "#0b0c0e");
      const fg = cssVar(wrap, "--color-fg", "#e6e4dc");
      const muted = cssVar(wrap, "--color-muted", "#8a8d94");
      const accent = cssVar(wrap, "--color-accent", "#7eb8c9");
      const danger = cssVar(wrap, "--color-danger", "#c45c4a");

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const horizon = project({ x: cam.current.x + fx * 4, y: cam.current.y + fy * 4, z: -0.6 }, w, h);
      if (horizon) {
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, "rgba(126,184,201,0.05)");
        g.addColorStop(0.55, "rgba(11,12,14,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, Math.max(0, horizon.y));
      }

      const org = display.current.__org ?? orgT;
      const orgS = project(org, w, h);
      const anc = ancestryRef.current;
      if (anc.length > 1 && orgS) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(126,184,201,0.32)";
        ctx.lineWidth = 1.5;
        let started = false;
        anc.forEach((s, i) => {
          const p = display.current[`anc_${i}`] ?? projectFeatures3(s.features, metricNow);
          const sp = project(p, w, h);
          if (!sp) return;
          if (!started) {
            ctx.moveTo(sp.x, sp.y);
            started = true;
          } else ctx.lineTo(sp.x, sp.y);
        });
        ctx.lineTo(orgS.x, orgS.y);
        ctx.stroke();
      }

      const pendingId = pendingRef.current;
      if (pendingId && orgS) {
        const pending = list.find((c) => c.id === pendingId);
        if (pending) {
          const p = display.current[pending.id] ?? projectFeatures3(pending.features, metricNow);
          const sp = project(p, w, h);
          if (sp) {
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
        }
      }

      const fam = familyRef.current;
      const sel = selectedRef.current;
      const wtf = wtfRef.current;
      const hover = hoverId.current;
      const stride = cam.current.dist > 2.4 ? 4 : cam.current.dist > 1.7 ? 2 : 1;
      const visible: {
        c: Concept;
        s: { x: number; y: number; depth: number };
      }[] = [];

      for (const c of list) {
        if (
          stride > 1 &&
          !c.seeded &&
          c.id !== sel &&
          c.id !== wtf &&
          c.id !== hover &&
          (c.id.charCodeAt(0) + c.id.length) % stride !== 0
        ) {
          continue;
        }
        if (fam !== "all" && c.family !== fam && !c.seeded && c.id !== sel) continue;
        const p = display.current[c.id] ?? projectFeatures3(c.features, metricNow);
        const s = project(p, w, h);
        if (!s) continue;
        if (s.x < -16 || s.x > w + 16 || s.y < -16 || s.y > h + 16) continue;
        visible.push({ c, s });
      }
      visible.sort((a, b) => b.s.depth - a.s.depth);

      const labelBudget = cam.current.dist > 1.8 ? 8 : cam.current.dist > 1.1 ? 18 : cam.current.dist > 0.6 ? 36 : 70;
      const labels: { x: number; y: number; text: string; seeded: boolean; sel: boolean }[] = [];
      const used: { x: number; y: number }[] = [];

      for (const { c, s } of visible) {
        const isolated = fam !== "all" && c.family !== fam && !c.seeded;
        const isSel = c.id === sel;
        const isWtf = c.id === wtf;
        const isHover = c.id === hover;
        if (isolated && !isSel && !isHover && !isWtf) continue;

        const r = Math.max(
          0.7,
          ((c.seeded ? 4.4 : 2.1 * c.mass) * (isSel || isHover ? 1.45 : 1)) / Math.max(0.28, s.depth * 0.85),
        );
        const alpha = isolated ? 0.12 : c.seeded || isSel || isHover ? 1 : Math.max(0.22, 0.85 / (0.55 + s.depth));

        if (isWtf) {
          ctx.strokeStyle = danger;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.arc(s.x, s.y, r + 7, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        ctx.globalAlpha = alpha;
        ctx.fillStyle = isSel ? accent : c.seeded ? accent : familyFill(c.family, 1);
        if (r < 1.3) {
          ctx.fillRect(s.x - r, s.y - r, r * 2, r * 2);
        } else {
          ctx.beginPath();
          ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        const forceLabel = isSel || isWtf || isHover || Boolean(c.seeded && s.depth < 1.35);
        const wantLabel = forceLabel || s.depth < 0.55;
        if (wantLabel) {
          const clash = used.some((u) => Math.hypot(u.x - s.x, u.y - s.y) < 26);
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
        ctx.fillText(lb.text, lb.x + 8, lb.y);
      }

      if (orgS) {
        for (const d of stateNow.debris.slice(-6)) {
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
        ctx.fillText(stateNow.name, orgS.x, orgS.y + 26);
      }

      ctx.strokeStyle = "rgba(230,228,220,0.35)";
      ctx.lineWidth = 1.5;
      const cx = w - 28;
      const cy = 28;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + rx * 12, cy - ry * 12);
      ctx.stroke();
      ctx.strokeStyle = accent;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + fx * 14, cy - fy * 14);
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    const onDown = (e: PointerEvent) => {
      fly.current = null;
      cam.current.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (cam.current.pointers.size === 1) {
        cam.current.orbiting = e.button === 2 || e.shiftKey || e.altKey;
        cam.current.dragging = !cam.current.orbiting;
        cam.current.moved = false;
        cam.current.lastX = e.clientX;
        cam.current.lastY = e.clientY;
        cam.current.vx = 0;
        cam.current.vy = 0;
      } else if (cam.current.pointers.size === 2) {
        const pts = [...cam.current.pointers.values()];
        cam.current.pinch = Math.hypot(pts[0]!.x - pts[1]!.x, pts[0]!.y - pts[1]!.y);
        cam.current.dragging = false;
        cam.current.orbiting = false;
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
          const factor = cam.current.pinch / dist;
          cam.current.dist = Math.max(MIN_DIST, Math.min(MAX_DIST, cam.current.dist * factor));
          cam.current.pinch = dist;
        }
        return;
      }
      if (cam.current.orbiting) {
        const dx = e.clientX - cam.current.lastX;
        const dy = e.clientY - cam.current.lastY;
        if (Math.hypot(dx, dy) > 3) cam.current.moved = true;
        cam.current.yaw -= dx * 0.005;
        cam.current.tilt = Math.max(MIN_TILT, Math.min(MAX_TILT, cam.current.tilt + dy * 0.004));
        cam.current.lastX = e.clientX;
        cam.current.lastY = e.clientY;
        return;
      }
      if (cam.current.dragging) {
        const dx = e.clientX - cam.current.lastX;
        const dy = e.clientY - cam.current.lastY;
        if (Math.hypot(dx, dy) > 3) cam.current.moved = true;
        const { fx, fy, rx, ry } = basis();
        const scale = 0.0022 * cam.current.dist;
        cam.current.x += -rx * dx * scale + fx * dy * scale;
        cam.current.y += -ry * dx * scale + fy * dy * scale;
        cam.current.vx = (-rx * dx + fx * dy) * scale * 48;
        cam.current.vy = (-ry * dx + fy * dy) * scale * 48;
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
        const wasDrag = cam.current.dragging || cam.current.orbiting;
        const moved = cam.current.moved;
        cam.current.dragging = false;
        cam.current.orbiting = false;
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
      const factor = e.deltaY > 0 ? 1.08 : 0.92;
      cam.current.dist = Math.max(MIN_DIST, Math.min(MAX_DIST, cam.current.dist * factor));
    };
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      if (e.type === "keydown") keys.current[e.code] = true;
      else keys.current[e.code] = false;
    };
    const onCtx = (e: Event) => e.preventDefault();

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("contextmenu", onCtx);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (window.__controlsTest) delete window.__controlsTest;
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("contextmenu", onCtx);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, []);

  const wtf = concepts.find((c) => c.id === wtfId);

  return (
    <div ref={wrapRef} className="relative h-full min-h-64 w-full overflow-hidden bg-bg">
      <canvas ref={canvasRef} className="block size-full touch-none" />
      <div
        ref={hoverLabelRef}
        className="pointer-events-none absolute max-w-56 rounded-lg bg-surface px-3 py-2 text-fg opacity-0 shadow-[var(--shadow-border)] [&_em]:mt-1 [&_em]:block [&_em]:text-xs [&_em]:not-italic [&_em]:text-accent [&_span]:mt-0.5 [&_span]:block [&_span]:font-mono [&_span]:text-[10px] [&_span]:uppercase [&_span]:tracking-[0.12em] [&_span]:text-muted [&_strong]:block [&_strong]:text-sm"
      />
      <div className="pointer-events-none absolute left-3 top-3 max-w-[18rem] text-[11px] uppercase tracking-[0.14em] text-muted">
        {mode === "DRIFT" ? "Drift" : "Track"} · {metric.toLowerCase()} ruler · {concepts.length.toLocaleString()}
      </div>
      {wtf ? (
        <div className="pointer-events-none absolute right-3 top-12 max-w-[14rem] text-right text-xs text-danger">
          WTF neighbor: {wtf.label}
          <span className="block text-muted">Near here, far semantically.</span>
        </div>
      ) : null}
    </div>
  );
}
