"use client";

import { useEffect, useRef, useState } from "react";

// ─── Web Audio sounds ─────────────────────────────────────────────────────────
function getAudioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try { return new AudioContext(); } catch { return null; }
}

function playThunder() {
  const ctx = getAudioCtx(); if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain); gain.connect(ctx.destination);
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(80, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.6);
  gain.gain.setValueAtTime(0.35, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
  osc.start(); osc.stop(ctx.currentTime + 1.1);
}

function playFairyChime() {
  const ctx = getAudioCtx(); if (!ctx) return;
  [1047, 1319, 1568, 2093].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = "sine"; osc.frequency.value = freq;
    const t = ctx.currentTime + i * 0.13;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.start(t); osc.stop(t + 0.4);
  });
}

function playDragonRoar() {
  const ctx = getAudioCtx(); if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain); gain.connect(ctx.destination);
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(110, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(45, ctx.currentTime + 0.4);
  osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.9);
  osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 2.0);
  gain.gain.setValueAtTime(0.22, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.3);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.2);
  osc.start(); osc.stop(ctx.currentTime + 2.3);
}

// ─── Fairy SVG ────────────────────────────────────────────────────────────────
function FairySVG() {
  return (
    <svg width="120" height="85" viewBox="0 0 120 85" fill="none">
      <circle cx="6"  cy="55" r="2.5" fill="#FFD700" opacity="0.75" />
      <circle cx="18" cy="63" r="1.8" fill="#00C896" opacity="0.55" />
      <circle cx="2"  cy="44" r="1.2" fill="#7FFFD4" opacity="0.65" />
      <circle cx="13" cy="71" r="1"   fill="#FFD700" opacity="0.45" />
      <circle cx="28" cy="50" r="1.5" fill="#FFB6C1" opacity="0.5"  />
      <line x1="24" y1="69" x2="104" y2="46" stroke="#7A4A2A" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M24 69 Q8 78 14 85 Q28 80 35 68 Q21 72 24 69Z" fill="#D4AF37" />
      <path d="M24 69 Q12 73 16 79 Q27 76 31 67Z" fill="#B8860B" opacity="0.5" />
      <ellipse cx="78" cy="52" rx="11" ry="13" fill="#F0B0C0" />
      <path d="M67 58 Q70 74 78 76 Q86 74 89 58Z" fill="#8B20BB" />
      <rect x="75" y="41" width="6" height="9" rx="3" fill="#FFDDB8" />
      <circle cx="78" cy="32" r="11" fill="#FFDDB8" />
      <path d="M67 29 Q68 15 78 19 Q88 15 89 29" fill="#E8C030" />
      <path d="M89 29 Q98 35 95 47 Q90 43 89 32Z" fill="#E8C030" opacity="0.6" />
      <path d="M67 25 L78 4 L89 25Z" fill="#3A006A" />
      <ellipse cx="78" cy="25" rx="15.5" ry="4.5" fill="#5A008A" />
      <text x="74" y="17" fontSize="7" fill="#FFD700">✦</text>
      <circle cx="74" cy="31" r="2"   fill="#2A1535" />
      <circle cx="82" cy="31" r="2"   fill="#2A1535" />
      <circle cx="74.8" cy="30.3" r="0.8" fill="white" />
      <circle cx="82.8" cy="30.3" r="0.8" fill="white" />
      <circle cx="69" cy="35" r="3" fill="#FFB0B0" opacity="0.38" />
      <circle cx="87" cy="35" r="3" fill="#FFB0B0" opacity="0.38" />
      <path d="M74 37 Q78 41 82 37" stroke="#C07070" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <ellipse cx="66" cy="47" rx="21" ry="11" fill="rgba(127,255,212,0.28)" transform="rotate(-18 66 47)" />
      <ellipse cx="65" cy="58" rx="17" ry="8"  fill="rgba(127,255,212,0.18)" transform="rotate(13 65 58)" />
      <ellipse cx="66" cy="47" rx="21" ry="11" fill="none" stroke="rgba(127,255,212,0.4)" strokeWidth="0.6" transform="rotate(-18 66 47)" />
    </svg>
  );
}

// ─── Dragon SVG ───────────────────────────────────────────────────────────────
function DragonSVG({ flip }: { flip?: boolean }) {
  return (
    <svg width="260" height="140" viewBox="0 0 260 140" fill="none" style={flip ? { transform: "scaleX(-1)" } : {}}>
      {/* Fire */}
      <ellipse cx="14" cy="72" rx="18" ry="9" fill="#FF6600" opacity="0.75" />
      <ellipse cx="6"  cy="70" rx="11" ry="6" fill="#FFCC00" opacity="0.85" />
      <ellipse cx="2"  cy="72" rx="6"  ry="4" fill="white"   opacity="0.6"  />
      {/* Body */}
      <path d="M35 70 Q90 48 130 62 Q170 78 220 58" stroke="#8B1C1C" strokeWidth="24" strokeLinecap="round" fill="none" />
      {/* Belly */}
      <path d="M35 70 Q90 60 130 70 Q170 80 220 62" stroke="#D4703A" strokeWidth="13" strokeLinecap="round" fill="none" />
      {/* Head */}
      <ellipse cx="26" cy="68" rx="24" ry="17" fill="#8B1C1C" />
      <ellipse cx="16" cy="70" rx="13" ry="9"  fill="#8B1C1C" />
      {/* Jaw */}
      <path d="M5 74 Q14 82 28 78" fill="#6A1010" />
      {/* Teeth */}
      <path d="M8 74 L7 81"  stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 76 L13 84" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M21 76 L20 83" stroke="white" strokeWidth="2" strokeLinecap="round" />
      {/* Eye */}
      <circle cx="22" cy="60" r="7" fill="#FFD700" />
      <circle cx="22" cy="60" r="4" fill="#111" />
      <circle cx="20" cy="58" r="1.5" fill="white" />
      {/* Nostril */}
      <circle cx="8" cy="68" r="2.5" fill="#5A0A0A" />
      {/* Horns */}
      <path d="M26 52 L21 36 L33 49Z" fill="#5A0A0A" />
      <path d="M17 52 L11 38 L23 49Z" fill="#5A0A0A" />
      {/* Wings */}
      <path d="M88 58 Q76 10 118 4 Q132 18 116 44 Q104 52 88 58Z"  fill="#6B1111" opacity="0.88" />
      <path d="M88 58 Q108 14 132 8 Q146 22 128 48 Q112 55 88 58Z"  fill="#5A0A0A" opacity="0.62" />
      <path d="M130 62 Q122 12 162 6 Q178 20 158 48 Q146 56 130 62Z" fill="#6B1111" opacity="0.78" />
      {/* Wing membrane lines */}
      <path d="M90 56 Q100 30 118 20" stroke="#9B2222" strokeWidth="1" opacity="0.5" />
      <path d="M90 56 Q112 36 130 20" stroke="#9B2222" strokeWidth="1" opacity="0.4" />
      {/* Spine spikes */}
      <path d="M58 53 L62 38 M84 50 L88 35 M110 54 L114 39 M136 58 L140 43 M162 58 L166 43 M188 56 L192 41" stroke="#5A0A0A" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Front leg */}
      <path d="M100 75 L94 97 L86 106 M94 97 L102 106" stroke="#5A0A0A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      {/* Back leg */}
      <path d="M170 70 L164 92 L156 101 M164 92 L172 101" stroke="#5A0A0A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      {/* Tail */}
      <path d="M220 58 Q240 46 250 52 Q242 58 246 63 Q238 58 230 64" stroke="#8B1C1C" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* Tail spike */}
      <path d="M246 52 L256 44 L252 56Z" fill="#5A0A0A" />
    </svg>
  );
}

// ─── Cloud SVG ────────────────────────────────────────────────────────────────
function CloudSVG() {
  return (
    <svg width="220" height="90" viewBox="0 0 220 90" fill="none">
      <ellipse cx="110" cy="65" rx="90" ry="28" fill="rgba(127,255,212,0.14)" />
      <ellipse cx="88"  cy="52" rx="58" ry="34" fill="rgba(127,255,212,0.11)" />
      <ellipse cx="135" cy="48" rx="62" ry="36" fill="rgba(127,255,212,0.09)" />
      <ellipse cx="65"  cy="58" rx="38" ry="24" fill="rgba(127,255,212,0.07)" />
    </svg>
  );
}

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Creature {
  id: number;
  x: number;
  y: number;
  type: "fairy" | "dragon";
  flip: boolean;
}

interface CloudData {
  id: number;
  x: number;
  y: number;
  speed: number;
  scale: number;
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function MagicalEffects() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const frameRef   = useRef<number>(0);
  const [showLightning, setShowLightning] = useState(false);
  const [lightningX,    setLightningX]    = useState(200);
  const [clouds,        setClouds]        = useState<CloudData[]>([]);
  const [creatures,     setCreatures]     = useState<Map<number, { x: number; y: number }>>(new Map());
  const creaturesRef   = useRef<Creature[]>([]);
  const creatureIdRef  = useRef(0);
  const fairyRafsRef   = useRef<Map<number, number>>(new Map());

  // Init clouds
  useEffect(() => {
    const W = window.innerWidth;
    setClouds([
      { id: 1, x: -250,      y: 28,  speed: 0.22, scale: 1.3  },
      { id: 2, x: W * 0.35,  y: 14,  speed: 0.16, scale: 1.0  },
      { id: 3, x: W * 0.68,  y: 52,  speed: 0.28, scale: 0.85 },
      { id: 4, x: W * 0.15,  y: 80,  speed: 0.20, scale: 0.7  },
    ]);
  }, []);

  // Drift clouds
  useEffect(() => {
    const iv = setInterval(() => {
      setClouds((prev) =>
        prev.map((c) => ({ ...c, x: c.x > window.innerWidth + 320 ? -320 : c.x + c.speed }))
      );
    }, 30);
    return () => clearInterval(iv);
  }, []);

  // Canvas: rain + waterfall
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const rain = Array.from({ length: 130 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speed: 5 + Math.random() * 7,
      len:   12 + Math.random() * 16,
    }));

    const waterfall = Array.from({ length: 60 }, () => ({
      x:  window.innerWidth - 20 + Math.random() * 30,
      y:  Math.random() * window.innerHeight,
      vy: 1.8 + Math.random() * 3.5,
      op: 0.06 + Math.random() * 0.18,
      r:  1 + Math.random() * 2.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      rain.forEach((d) => {
        ctx.save();
        ctx.strokeStyle = "rgba(127,255,212,0.12)";
        ctx.lineWidth = 0.9;
        ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - 2.5, d.y + d.len); ctx.stroke();
        ctx.restore();
        d.y += d.speed; d.x -= 1.3;
        if (d.y > canvas.height) { d.y = -20; d.x = Math.random() * canvas.width; }
        if (d.x < -10) d.x = canvas.width + 10;
      });

      waterfall.forEach((p) => {
        ctx.save();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,200,150,${p.op})`; ctx.fill();
        ctx.restore();
        p.y += p.vy; p.x += Math.sin(p.y * 0.045) * 0.9;
        if (p.y > canvas.height + 10) { p.y = -10; p.x = window.innerWidth - 20 + Math.random() * 30; }
      });

      frameRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(frameRef.current); };
  }, []);

  // ── Lightning: 5x — every ~1–2.5s ─────────────────────────────────────────
  useEffect(() => {
    let tid: ReturnType<typeof setTimeout>;
    const trigger = () => {
      setLightningX(60 + Math.random() * (window.innerWidth - 120));
      setShowLightning(true);
      playThunder();
      setTimeout(() => setShowLightning(false), 250);
      tid = setTimeout(trigger, 1000 + Math.random() * 2200);
    };
    tid = setTimeout(trigger, 1200 + Math.random() * 1500);
    return () => clearTimeout(tid);
  }, []);

  // ── Spawn fairy/dragon ─────────────────────────────────────────────────────
  const spawnCreature = (type: "fairy" | "dragon") => {
    const W = window.innerWidth;
    const id = creatureIdRef.current++;
    const flip = Math.random() < 0.5;
    const baseY = type === "dragon"
      ? 60 + Math.random() * 200
      : 60 + Math.random() * 220;
    const duration = type === "dragon"
      ? 10000 + Math.random() * 6000
      : 11000 + Math.random() * 7000;
    const startX = flip ? W + 160 : -160;
    const endX   = flip ? -160   : W + 160;

    creaturesRef.current.push({ id, x: startX, y: baseY, type, flip });

    if (type === "fairy") playFairyChime();
    if (type === "dragon") playDragonRoar();

    const start = Date.now();
    const tick = () => {
      const t = (Date.now() - start) / duration;
      if (t >= 1) {
        creaturesRef.current = creaturesRef.current.filter((c) => c.id !== id);
        setCreatures((prev) => { const m = new Map(prev); m.delete(id); return m; });
        fairyRafsRef.current.delete(id);
        return;
      }
      const x = startX + (endX - startX) * t;
      const y = baseY + Math.sin(t * Math.PI * (type === "dragon" ? 3 : 5)) * 55;
      setCreatures((prev) => new Map(prev).set(id, { x, y }));
      const raf = requestAnimationFrame(tick);
      fairyRafsRef.current.set(id, raf);
    };
    const raf = requestAnimationFrame(tick);
    fairyRafsRef.current.set(id, raf);
  };

  // ── Fairy: 5x — every ~3–6s, up to 3 simultaneously ─────────────────────
  useEffect(() => {
    let tid: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const active = creaturesRef.current.filter((c) => c.type === "fairy").length;
      if (active < 3) spawnCreature("fairy");
      tid = setTimeout(schedule, 3000 + Math.random() * 3000);
    };
    tid = setTimeout(schedule, 2000);
    return () => clearTimeout(tid);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Dragon: every ~12–22s ─────────────────────────────────────────────────
  useEffect(() => {
    let tid: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const active = creaturesRef.current.filter((c) => c.type === "dragon").length;
      if (active < 2) spawnCreature("dragon");
      tid = setTimeout(schedule, 12000 + Math.random() * 10000);
    };
    tid = setTimeout(schedule, 5000);
    return () => clearTimeout(tid);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => { fairyRafsRef.current.forEach((raf) => cancelAnimationFrame(raf)); };
  }, []);

  return (
    <>
      {/* Rain + waterfall canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }} aria-hidden="true" />

      {/* Clouds */}
      {clouds.map((c) => (
        <div key={c.id} className="fixed pointer-events-none"
          style={{ left: c.x, top: c.y, zIndex: 3, transform: `scale(${c.scale})`, transformOrigin: "left top", opacity: 0.4 }}
          aria-hidden="true">
          <CloudSVG />
        </div>
      ))}

      {/* Lightning bolt */}
      {showLightning && (
        <div className="fixed top-0 pointer-events-none" style={{ left: lightningX, zIndex: 7 }} aria-hidden="true">
          <div className="fixed inset-0" style={{ background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
          <svg width="55" height="300" viewBox="0 0 55 300" fill="none">
            <path d="M33 0L6 115H25L4 300L56 98H34L33 0Z" fill="white" opacity="0.92" />
            <path d="M33 0L6 115H25L4 300L56 98H34L33 0Z" fill="#7FFFD4" opacity="0.55" style={{ filter: "blur(2px)" }} />
          </svg>
        </div>
      )}

      {/* Creatures (fairies + dragons) */}
      {creaturesRef.current.map((c) => {
        const pos = creatures.get(c.id);
        if (!pos) return null;
        return (
          <div key={c.id} className="fixed pointer-events-none"
            style={{ left: pos.x, top: pos.y, zIndex: c.type === "dragon" ? 5 : 6 }}
            aria-hidden="true">
            {c.type === "fairy"  ? <FairySVG /> : <DragonSVG flip={c.flip} />}
          </div>
        );
      })}
    </>
  );
}
