"use client";

import { useEffect, useRef, useState } from "react";

interface CloudData {
  id: number;
  x: number;
  y: number;
  speed: number;
  scale: number;
}

export default function MagicalEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const [showLightning, setShowLightning] = useState(false);
  const [lightningX, setLightningX] = useState(200);
  const [fairyPos, setFairyPos] = useState<{ x: number; y: number } | null>(null);
  const [clouds, setClouds] = useState<CloudData[]>([]);

  // Init clouds
  useEffect(() => {
    const W = window.innerWidth;
    setClouds([
      { id: 1, x: -250, y: 30,  speed: 0.22, scale: 1.3 },
      { id: 2, x: W * 0.35, y: 15, speed: 0.16, scale: 1.0 },
      { id: 3, x: W * 0.68, y: 55, speed: 0.28, scale: 0.85 },
    ]);
  }, []);

  // Drift clouds
  useEffect(() => {
    const iv = setInterval(() => {
      setClouds((prev) =>
        prev.map((c) => ({
          ...c,
          x: c.x > window.innerWidth + 320 ? -320 : c.x + c.speed,
        }))
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

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const rain = Array.from({ length: 110 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speed: 5 + Math.random() * 7,
      len: 12 + Math.random() * 16,
    }));

    const waterfall = Array.from({ length: 55 }, () => ({
      x: window.innerWidth - 18 + Math.random() * 28,
      y: Math.random() * window.innerHeight,
      vy: 1.8 + Math.random() * 3.5,
      op: 0.07 + Math.random() * 0.18,
      r: 1 + Math.random() * 2.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Rain
      rain.forEach((d) => {
        ctx.save();
        ctx.strokeStyle = "rgba(127,255,212,0.13)";
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 2.5, d.y + d.len);
        ctx.stroke();
        ctx.restore();
        d.y += d.speed;
        d.x -= 1.3;
        if (d.y > canvas.height) { d.y = -20; d.x = Math.random() * canvas.width; }
        if (d.x < -10) d.x = canvas.width + 10;
      });

      // Waterfall right edge
      waterfall.forEach((p) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,200,150,${p.op})`;
        ctx.fill();
        ctx.restore();
        p.y += p.vy;
        p.x += Math.sin(p.y * 0.045) * 0.9;
        if (p.y > canvas.height + 10) {
          p.y = -10;
          p.x = canvas.width - 18 + Math.random() * 28;
        }
      });

      frameRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  // Lightning
  useEffect(() => {
    let tid: ReturnType<typeof setTimeout>;
    const trigger = () => {
      setLightningX(80 + Math.random() * (window.innerWidth - 160));
      setShowLightning(true);
      setTimeout(() => setShowLightning(false), 260);
      tid = setTimeout(trigger, 5000 + Math.random() * 11000);
    };
    tid = setTimeout(trigger, 3000 + Math.random() * 5000);
    return () => clearTimeout(tid);
  }, []);

  // Fairy
  useEffect(() => {
    let raf = 0;
    let tid: ReturnType<typeof setTimeout>;

    const fly = () => {
      const W = window.innerWidth;
      const baseY = 70 + Math.random() * 200;
      const duration = 13000 + Math.random() * 8000;
      const start = Date.now();

      const tick = () => {
        const t = (Date.now() - start) / duration;
        if (t >= 1) {
          setFairyPos(null);
          tid = setTimeout(fly, 20000 + Math.random() * 20000);
          return;
        }
        setFairyPos({
          x: -140 + t * (W + 280),
          y: baseY + Math.sin(t * Math.PI * 5) * 55,
        });
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    tid = setTimeout(fly, 4000);
    return () => {
      clearTimeout(tid);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Rain + waterfall canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 2 }}
        aria-hidden="true"
      />

      {/* Clouds */}
      {clouds.map((c) => (
        <div
          key={c.id}
          className="fixed pointer-events-none"
          style={{ left: c.x, top: c.y, zIndex: 3, transform: `scale(${c.scale})`, transformOrigin: "left top", opacity: 0.4 }}
          aria-hidden="true"
        >
          <svg width="220" height="90" viewBox="0 0 220 90" fill="none">
            <ellipse cx="110" cy="65" rx="90" ry="28" fill="rgba(127,255,212,0.14)" />
            <ellipse cx="88" cy="52" rx="58" ry="34" fill="rgba(127,255,212,0.11)" />
            <ellipse cx="135" cy="48" rx="62" ry="36" fill="rgba(127,255,212,0.09)" />
            <ellipse cx="65" cy="58" rx="38" ry="24" fill="rgba(127,255,212,0.07)" />
          </svg>
        </div>
      ))}

      {/* Lightning bolt */}
      {showLightning && (
        <div
          className="fixed top-0 pointer-events-none"
          style={{ left: lightningX, zIndex: 7 }}
          aria-hidden="true"
        >
          {/* Screen flash */}
          <div className="fixed inset-0" style={{ background: "rgba(255,255,255,0.035)", pointerEvents: "none" }} />
          <svg width="55" height="300" viewBox="0 0 55 300" fill="none">
            <path d="M33 0L6 115H25L4 300L56 98H34L33 0Z" fill="white" opacity="0.92" />
            <path d="M33 0L6 115H25L4 300L56 98H34L33 0Z" fill="#7FFFD4" opacity="0.55" style={{ filter: "blur(2px)" }} />
          </svg>
        </div>
      )}

      {/* Tiên nữ cưỡi chổi */}
      {fairyPos && (
        <div
          className="fixed pointer-events-none"
          style={{ left: fairyPos.x, top: fairyPos.y, zIndex: 6 }}
          aria-hidden="true"
        >
          <svg width="125" height="88" viewBox="0 0 125 88" fill="none">
            {/* Sparkle trail */}
            <circle cx="6"  cy="55" r="2.5" fill="#FFD700" opacity="0.75" />
            <circle cx="18" cy="63" r="1.8" fill="#00C896" opacity="0.55" />
            <circle cx="2"  cy="44" r="1.2" fill="#7FFFD4" opacity="0.65" />
            <circle cx="13" cy="71" r="1"   fill="#FFD700" opacity="0.45" />
            <circle cx="28" cy="50" r="1.5" fill="#FFB6C1" opacity="0.5"  />
            <circle cx="10" cy="38" r="1"   fill="#7FFFD4" opacity="0.4"  />

            {/* Cán chổi */}
            <line x1="24" y1="69" x2="108" y2="46" stroke="#7A4A2A" strokeWidth="4.5" strokeLinecap="round" />
            {/* Lông chổi */}
            <path d="M24 69 Q8 78 14 85 Q28 80 35 68 Q21 72 24 69Z" fill="#D4AF37" />
            <path d="M24 69 Q12 73 16 79 Q27 76 31 67Z" fill="#B8860B" opacity="0.5" />

            {/* Thân */}
            <ellipse cx="82" cy="54" rx="11" ry="13" fill="#F0B0C0" />
            {/* Váy */}
            <path d="M71 60 Q74 76 82 78 Q90 76 93 60Z" fill="#8B20BB" />
            {/* Cổ */}
            <rect x="79" y="43" width="6" height="9" rx="3" fill="#FFDDB8" />
            {/* Đầu */}
            <circle cx="82" cy="34" r="11" fill="#FFDDB8" />
            {/* Tóc */}
            <path d="M71 31 Q72 17 82 21 Q92 17 93 31" fill="#E8C030" />
            <path d="M93 31 Q102 37 99 49 Q94 45 93 34Z" fill="#E8C030" opacity="0.6" />
            {/* Mũ phù thủy */}
            <path d="M71 27 L82 6 L93 27Z" fill="#3A006A" />
            <ellipse cx="82" cy="27" rx="15.5" ry="4.5" fill="#5A008A" />
            {/* Ngôi sao trên mũ */}
            <text x="78" y="19" fontSize="7" fill="#FFD700">✦</text>
            {/* Mắt */}
            <circle cx="78" cy="33" r="2"   fill="#2A1535" />
            <circle cx="86" cy="33" r="2"   fill="#2A1535" />
            <circle cx="78.8" cy="32.3" r="0.8" fill="white" />
            <circle cx="86.8" cy="32.3" r="0.8" fill="white" />
            {/* Má hồng */}
            <circle cx="73" cy="37" r="3" fill="#FFB0B0" opacity="0.38" />
            <circle cx="91" cy="37" r="3" fill="#FFB0B0" opacity="0.38" />
            {/* Miệng cười */}
            <path d="M78 39 Q82 43 86 39" stroke="#C07070" strokeWidth="1.2" strokeLinecap="round" fill="none" />

            {/* Cánh */}
            <ellipse cx="70" cy="49" rx="21" ry="11" fill="rgba(127,255,212,0.28)" transform="rotate(-18 70 49)" />
            <ellipse cx="69" cy="60" rx="17" ry="8"  fill="rgba(127,255,212,0.18)" transform="rotate(13 69 60)" />
            <ellipse cx="70" cy="49" rx="21" ry="11" fill="none" stroke="rgba(127,255,212,0.4)" strokeWidth="0.6" transform="rotate(-18 70 49)" />
          </svg>
        </div>
      )}
    </>
  );
}
