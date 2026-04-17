"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Ngũ Hành ─────────────────────────────────────────────────────
const ELEMENTS = [
  { name: "Mộc", emoji: "🌿", color: "#00C896", glow: "rgba(0,200,150,0.8)", points: 10 },
  { name: "Hỏa", emoji: "🔥", color: "#E74C3C", glow: "rgba(231,76,60,0.8)",  points: 15 },
  { name: "Thủy", emoji: "💧", color: "#3498DB", glow: "rgba(52,152,219,0.8)", points: 10 },
  { name: "Kim",  emoji: "⚡", color: "#F39C12", glow: "rgba(243,156,18,0.8)",  points: 20 },
  { name: "Thổ",  emoji: "💎", color: "#9B59B6", glow: "rgba(155,89,182,0.8)",  points: 12 },
] as const;

// Cảnh giới theo điểm
const REALMS = [
  { name: "Luyện Khí", threshold: 0,    color: "#8a8a8a" },
  { name: "Trúc Cơ",   threshold: 100,  color: "#00C896" },
  { name: "Khai Quang",threshold: 300,  color: "#3498DB" },
  { name: "Dung Hợp",  threshold: 600,  color: "#F39C12" },
  { name: "Nguyên Anh",threshold: 1000, color: "#E74C3C" },
  { name: "Hóa Thần",  threshold: 1800, color: "#9B59B6" },
  { name: "Đại Thừa",  threshold: 3000, color: "#FFD700" },
] as const;

const GAME_DURATION = 45;

interface Orb {
  id: number;
  x: number; y: number;
  vx: number; vy: number;
  element: typeof ELEMENTS[number];
  radius: number;
  life: number;      // 0→1 còn sống, shrinks to 0 = die
  maxLife: number;
  pulse: number;     // for glow animation
  scale: number;
}

interface Particle {
  id: number;
  x: number; y: number;
  vx: number; vy: number;
  life: number;
  color: string;
  size: number;
  text?: string;
}

interface FloatingText {
  id: number;
  x: number; y: number;
  text: string;
  color: string;
  vy: number;
  life: number;
}

function useLocalStorage<T>(key: string, init: T) {
  const [val, setVal] = useState<T>(() => {
    if (typeof window === "undefined") return init;
    try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? init; }
    catch { return init; }
  });
  const set = useCallback((v: T) => {
    setVal(v);
    if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(v));
  }, [key]);
  return [val, set] as const;
}

export default function MiniGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbsRef = useRef<Orb[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const lastElemRef = useRef<string>("");
  const lastCatchRef = useRef(0);
  const animRef = useRef<number>(0);
  const orbIdRef = useRef(0);
  const ptIdRef = useRef(0);
  const surgeActiveRef = useRef(false);

  const catchCountRef = useRef(0);
  const [showJumpscare, setShowJumpscare] = useState(false);

  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameState, setGameState] = useState<"idle" | "playing" | "over">("idle");
  const [realmName, setRealmName] = useState("Luyện Khí");
  const [realmColor, setRealmColor] = useState("#8a8a8a");
  const [breakthrough, setBreakthrough] = useState(false);
  const [surgeActive, setSurgeActive] = useState(false);
  const [highScore, setHighScore] = useLocalStorage("nemi-tutien-hs", 0);
  const [bestRealm, setBestRealm] = useLocalStorage("nemi-tutien-realm", "Luyện Khí");

  const spawnOrb = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const surge = surgeActiveRef.current;
    const count = surge ? 3 : 1;
    for (let i = 0; i < count; i++) {
      const elem = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
      const r = 24 + Math.random() * 16;
      const orb: Orb = {
        id: orbIdRef.current++,
        x: r + Math.random() * (canvas.width - r * 2),
        y: r + Math.random() * (canvas.height - r * 2),
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 2.5,
        element: elem,
        radius: r,
        life: 1,
        maxLife: surge ? 4000 : 5000 + Math.random() * 3000,
        pulse: Math.random() * Math.PI * 2,
        scale: 1,
      };
      orbsRef.current.push(orb);
    }
  }, []);

  const spawnParticles = useCallback((x: number, y: number, color: string, count = 12) => {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      particlesRef.current.push({
        id: ptIdRef.current++,
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color,
        size: 3 + Math.random() * 4,
      });
    }
  }, []);

  const addFloatingText = useCallback((x: number, y: number, text: string, color: string) => {
    floatingTextsRef.current.push({
      id: ptIdRef.current++,
      x, y, text, color,
      vy: -2 - Math.random(),
      life: 1,
    });
  }, []);

  const updateRealm = useCallback((newScore: number) => {
    let realm: { name: string; threshold: number; color: string } = REALMS[0];
    for (const r of REALMS) {
      if (newScore >= r.threshold) realm = r;
    }
    setRealmName(realm.name);
    setRealmColor(realm.color);
    setBestRealm(realm.name);

    // Phá cảnh: check nếu vừa đạt ngưỡng mới
    const prevRealm = REALMS.find((r) => newScore - scoreRef.current < 0 ? false : r.threshold > (newScore - 50) && r.threshold <= newScore);
    if (prevRealm && prevRealm.threshold > 0) {
      setBreakthrough(true);
      spawnParticles(300, 225, realm.color, 30);
      setTimeout(() => setBreakthrough(false), 2000);
    }
  }, [spawnParticles, setBestRealm]);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = Date.now();

    // Vẽ và cập nhật orbs
    orbsRef.current = orbsRef.current.filter((orb) => {
      orb.life -= 16 / orb.maxLife;
      if (orb.life <= 0) {
        spawnParticles(orb.x, orb.y, "rgba(255,255,255,0.3)", 4);
        return false;
      }
      orb.pulse += 0.06;
      orb.x += orb.vx;
      orb.y += orb.vy;
      // Bounce walls
      if (orb.x - orb.radius < 0) { orb.x = orb.radius; orb.vx *= -1; }
      if (orb.x + orb.radius > canvas.width) { orb.x = canvas.width - orb.radius; orb.vx *= -1; }
      if (orb.y - orb.radius < 0) { orb.y = orb.radius; orb.vy *= -1; }
      if (orb.y + orb.radius > canvas.height) { orb.y = canvas.height - orb.radius; orb.vy *= -1; }

      const alpha = Math.min(1, orb.life * 3);
      const glowSize = orb.radius * (1.3 + Math.sin(orb.pulse) * 0.15);
      const lifeRing = orb.life;

      ctx.save();
      ctx.globalAlpha = alpha;

      // Glow
      const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, glowSize * 1.8);
      grad.addColorStop(0, orb.element.color + "88");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, glowSize * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Core circle
      ctx.shadowBlur = 20;
      ctx.shadowColor = orb.element.color;
      ctx.fillStyle = orb.element.color + "CC";
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, glowSize, 0, Math.PI * 2);
      ctx.fill();

      // Life ring (shrinks as orb dies)
      ctx.shadowBlur = 0;
      ctx.strokeStyle = orb.element.color;
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = alpha * 0.7;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, glowSize + 5, -Math.PI / 2, -Math.PI / 2 + lifeRing * Math.PI * 2);
      ctx.stroke();

      // Emoji
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 0;
      ctx.font = `${orb.radius * 0.9}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(orb.element.emoji, orb.x, orb.y);

      ctx.restore();
      return true;
    });

    // Particles
    particlesRef.current = particlesRef.current.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.92;
      p.vy *= 0.92;
      p.life -= 0.025;
      if (p.life <= 0) return false;
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return true;
    });

    // Floating texts
    floatingTextsRef.current = floatingTextsRef.current.filter((ft) => {
      ft.y += ft.vy;
      ft.life -= 0.022;
      if (ft.life <= 0) return false;
      ctx.save();
      ctx.globalAlpha = ft.life;
      ctx.fillStyle = ft.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = ft.color;
      ctx.font = "bold 18px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
      return true;
    });

    void now;
    animRef.current = requestAnimationFrame(gameLoop);
  }, [spawnParticles]);

  const startGame = useCallback(() => {
    orbsRef.current = [];
    particlesRef.current = [];
    floatingTextsRef.current = [];
    scoreRef.current = 0;
    comboRef.current = 0;
    catchCountRef.current = 0;
    lastElemRef.current = "";
    surgeActiveRef.current = false;
    setScore(0);
    setCombo(0);
    setTimeLeft(GAME_DURATION);
    setRealmName("Luyện Khí");
    setRealmColor("#8a8a8a");
    setSurgeActive(false);
    setGameState("playing");
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;

    const spawnInterval = setInterval(spawnOrb, 800);

    // Linh Khí Bùng Nổ mỗi 15 giây
    const surgeInterval = setInterval(() => {
      surgeActiveRef.current = true;
      setSurgeActive(true);
      setTimeout(() => {
        surgeActiveRef.current = false;
        setSurgeActive(false);
      }, 5000);
    }, 15000);

    const timerInterval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameState("over");
          setHighScore(Math.max(highScore, scoreRef.current));
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    animRef.current = requestAnimationFrame(gameLoop);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(surgeInterval);
      clearInterval(timerInterval);
      cancelAnimationFrame(animRef.current);
    };
  }, [gameState, spawnOrb, gameLoop, setHighScore, highScore]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * sx;
    const my = (e.clientY - rect.top) * sy;

    const now = Date.now();
    let caught = false;

    orbsRef.current = orbsRef.current.filter((orb) => {
      if (caught) return true;
      const dist = Math.hypot(mx - orb.x, my - orb.y);
      if (dist < orb.radius * 1.6) {
        caught = true;
        // Combo
        const sameElem = orb.element.name === lastElemRef.current;
        const quickCatch = now - lastCatchRef.current < 1200;
        if (sameElem && quickCatch) {
          comboRef.current = Math.min(comboRef.current + 1, 10);
        } else if (quickCatch) {
          comboRef.current = Math.max(1, comboRef.current);
        } else {
          comboRef.current = 0;
        }
        lastElemRef.current = orb.element.name;
        lastCatchRef.current = now;
        setCombo(comboRef.current);

        const multiplier = 1 + comboRef.current * 0.5;
        const pts = Math.round(orb.element.points * multiplier);
        scoreRef.current += pts;
        setScore(scoreRef.current);
        updateRealm(scoreRef.current);

        spawnParticles(orb.x, orb.y, orb.element.color, 14);
        const label = comboRef.current > 1
          ? `+${pts} x${(multiplier).toFixed(1)}🔥`
          : `+${pts}`;
        addFloatingText(orb.x, orb.y - orb.radius, label, orb.element.color);

        catchCountRef.current += 1;
        if (catchCountRef.current === 7) {
          setShowJumpscare(true);
          try {
            const ac = new AudioContext();
            const buf = ac.createBuffer(1, ac.sampleRate * 0.4, ac.sampleRate);
            const data = buf.getChannelData(0);
            for (let j = 0; j < data.length; j++) data[j] = (Math.random() * 2 - 1) * (1 - j / data.length);
            const src = ac.createBufferSource();
            src.buffer = buf;
            const g = ac.createGain();
            g.gain.value = 1.0;
            src.connect(g); g.connect(ac.destination);
            src.start();
            const osc = ac.createOscillator();
            const og = ac.createGain();
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(900, ac.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, ac.currentTime + 0.5);
            og.gain.setValueAtTime(0.6, ac.currentTime);
            og.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.6);
            osc.connect(og); og.connect(ac.destination);
            osc.start(); osc.stop(ac.currentTime + 0.6);
          } catch { /* ignore */ }
          setTimeout(() => setShowJumpscare(false), 1800);
        }

        return false;
      }
      return true;
    });
  }, [gameState, spawnParticles, addFloatingText, updateRealm]);

  const getCurrentRealm = () => REALMS.filter((r) => scoreRef.current >= r.threshold).pop() ?? REALMS[0];
  const getNextRealm = () => {
    const idx = REALMS.findIndex((r) => r === getCurrentRealm());
    return REALMS[idx + 1] ?? null;
  };
  const progressToNext = () => {
    const cur = getCurrentRealm();
    const next = getNextRealm();
    if (!next) return 1;
    return Math.min(1, (score - cur.threshold) / (next.threshold - cur.threshold));
  };

  return (
    <section className="section relative z-10 px-6" aria-label="Mini game Tu Tiên">
      <div className="max-w-2xl mx-auto">
        <motion.div className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="text-jade/40 text-xs tracking-widest uppercase mb-2">☯ Linh Khí Tu Luyện ☯</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-shimmer">
            Hấp Thụ Linh Khí
          </h2>
          <p className="text-white/30 text-sm mt-2">
            Click vào các linh cầu — duy trì combo để nhân điểm lên tới x6
          </p>
        </motion.div>

        <motion.div className="glass rounded-3xl p-4 md:p-6 overflow-hidden"
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}>

          {/* HUD trên */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="text-center min-w-[70px]">
              <p className="text-white/30 text-[10px] uppercase tracking-wider">Linh Lực</p>
              <motion.p className="text-jade font-bold text-2xl"
                key={score} initial={{ scale: 1.3 }} animate={{ scale: 1 }}>
                {score}
              </motion.p>
            </div>

            {/* Cảnh giới + thanh tiến trình */}
            <div className="flex-1 mx-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold" style={{ color: realmColor }}>
                  {realmName}
                </span>
                {getNextRealm() && (
                  <span className="text-white/25 text-[10px]">{getNextRealm()?.name} →</span>
                )}
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: realmColor }}
                  animate={{ width: `${progressToNext() * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <div className="text-center min-w-[70px]">
              <p className="text-white/30 text-[10px] uppercase tracking-wider">Thời Gian</p>
              <p className={`font-bold text-2xl ${timeLeft <= 8 ? "text-red-400 animate-pulse" : "text-white"}`}>
                {timeLeft}s
              </p>
            </div>
          </div>

          {/* Combo + Surge badge */}
          <div className="flex items-center justify-center gap-3 mb-2 h-7">
            <AnimatePresence>
              {combo > 1 && (
                <motion.div
                  key={combo}
                  className="px-3 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: "rgba(231,76,60,0.3)", color: "#E74C3C", border: "1px solid rgba(231,76,60,0.4)" }}
                  initial={{ scale: 0.5, opacity: 0, y: -10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  🔥 COMBO x{1 + combo * 0.5}
                </motion.div>
              )}
              {surgeActive && (
                <motion.div
                  className="px-3 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: "rgba(0,200,150,0.25)", color: "#00C896", border: "1px solid rgba(0,200,150,0.4)" }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  ⚡ LINH KHÍ BÙNG NỔ!
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Canvas */}
          <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
            <canvas
              ref={canvasRef}
              width={600}
              height={450}
              className="game-canvas w-full h-full cursor-crosshair"
              style={{ background: "radial-gradient(ellipse at center, #0D1220 0%, #050810 100%)" }}
              onClick={handleClick}
              aria-label="Game canvas — Click để hấp thụ linh cầu"
            />

            {/* Breakthrough flash */}
            <AnimatePresence>
              {breakthrough && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse, ${realmColor}30, transparent 70%)` }} />
                  <motion.div
                    className="text-center z-10"
                    initial={{ scale: 0.5, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 1.2, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}>
                    <p className="text-4xl font-black tracking-widest" style={{ color: realmColor, textShadow: `0 0 30px ${realmColor}` }}>
                      ⚡ PHÁ CẢNH! ⚡
                    </p>
                    <p className="text-xl font-bold mt-1" style={{ color: realmColor }}>{realmName}</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─── JUMPSCARE ─── */}
            <AnimatePresence>
              {showJumpscare && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center z-50 overflow-hidden"
                  style={{ background: "rgba(0,0,0,0.92)" }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.05 }}>
                  <motion.div
                    initial={{ scale: 0.05, rotate: -15 }}
                    animate={{ scale: 1.15, rotate: 5 }}
                    exit={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}>
                    <svg width="320" height="320" viewBox="0 0 320 320" fill="none">
                      {/* Red glow bg */}
                      <circle cx="160" cy="160" r="155" fill="#1A0000" />
                      <circle cx="160" cy="160" r="155" fill="none" stroke="#CC0000" strokeWidth="4" opacity="0.8" />
                      {/* Forehead veins */}
                      <path d="M120 60 Q130 40 145 55 Q140 45 155 50" stroke="#8B0000" strokeWidth="2" opacity="0.6" fill="none" />
                      <path d="M185 58 Q195 38 205 52 Q198 44 210 48" stroke="#8B0000" strokeWidth="2" opacity="0.6" fill="none" />
                      {/* Left eye */}
                      <ellipse cx="110" cy="130" rx="48" ry="52" fill="white" />
                      <circle  cx="110" cy="135" r="36" fill="#CC0000" opacity="0.4" />
                      <circle  cx="110" cy="135" r="32" fill="#111" />
                      <circle  cx="110" cy="135" r="18" fill="#CC0000" opacity="0.7" />
                      <circle  cx="96"  cy="120" r="7"  fill="white" />
                      {/* Right eye */}
                      <ellipse cx="210" cy="130" rx="48" ry="52" fill="white" />
                      <circle  cx="210" cy="135" r="36" fill="#CC0000" opacity="0.4" />
                      <circle  cx="210" cy="135" r="32" fill="#111" />
                      <circle  cx="210" cy="135" r="18" fill="#CC0000" opacity="0.7" />
                      <circle  cx="196" cy="120" r="7"  fill="white" />
                      {/* Eye veins */}
                      <path d="M68 118 Q88 128 95 130"  stroke="#CC0000" strokeWidth="1.5" opacity="0.7" fill="none" />
                      <path d="M72 140 Q92 138 97 136"  stroke="#CC0000" strokeWidth="1.5" opacity="0.6" fill="none" />
                      <path d="M252 118 Q232 128 225 130" stroke="#CC0000" strokeWidth="1.5" opacity="0.7" fill="none" />
                      {/* Angry brows */}
                      <path d="M65 88 Q110 68 148 96"  stroke="#111" strokeWidth="10" strokeLinecap="round" fill="none" />
                      <path d="M172 96 Q210 68 255 88" stroke="#111" strokeWidth="10" strokeLinecap="round" fill="none" />
                      {/* Nose */}
                      <path d="M148 175 Q160 185 172 175 Q165 195 160 192 Q155 195 148 175Z" fill="#5A1A1A" />
                      {/* Wide open mouth */}
                      <path d="M72 222 Q160 310 248 222" fill="#0A0000" />
                      <path d="M72 222 Q160 320 248 222 Q160 295 72 222Z" fill="#8B0000" />
                      {/* Upper teeth */}
                      <path d="M86 225 L96 268 L112 228"  fill="ivory" />
                      <path d="M112 228 L122 275 L140 232" fill="ivory" />
                      <path d="M140 232 L148 280 L160 234" fill="ivory" />
                      <path d="M160 234 L172 280 L180 232" fill="ivory" />
                      <path d="M180 232 L198 275 L208 228" fill="ivory" />
                      <path d="M208 228 L224 268 L234 225" fill="ivory" />
                      {/* Blood drips */}
                      <path d="M100 268 Q102 285 100 292" stroke="#CC0000" strokeWidth="3" strokeLinecap="round" fill="none" />
                      <path d="M160 280 Q162 298 158 306" stroke="#CC0000" strokeWidth="3" strokeLinecap="round" fill="none" />
                      {/* BOO text */}
                      <text x="132" y="318" fontSize="28" fontWeight="900" fill="#FF0000" fontFamily="serif" letterSpacing="8">BOO!</text>
                    </svg>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Overlay start/end */}
            <AnimatePresence>
              {gameState !== "playing" && (
                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-center"
                  style={{ background: "rgba(5,8,16,0.88)", backdropFilter: "blur(10px)" }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                  {gameState === "idle" && (
                    <>
                      <motion.div className="text-5xl mb-3"
                        animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}>
                        ☯
                      </motion.div>
                      <h3 className="font-display text-2xl font-bold text-shimmer mb-1">Tu Tiên Luyện Khí</h3>
                      <p className="text-white/40 text-sm mb-1 text-center px-6">
                        Hấp thụ linh cầu Ngũ Hành trước khi chúng tan biến
                      </p>
                      <p className="text-jade/60 text-xs mb-6 text-center px-6">
                        Combo cùng nguyên tố → nhân điểm x6 · Phá cảnh = bùng nổ linh khí
                      </p>
                      {/* Ngũ hành legend */}
                      <div className="flex gap-3 mb-6 flex-wrap justify-center">
                        {ELEMENTS.map((el) => (
                          <span key={el.name} className="text-xs px-2 py-1 rounded-full" style={{ background: el.color + "22", color: el.color, border: `1px solid ${el.color}44` }}>
                            {el.emoji} {el.name} +{el.points}
                          </span>
                        ))}
                      </div>
                    </>
                  )}

                  {gameState === "over" && (
                    <>
                      <motion.div className="text-5xl mb-3"
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}>
                        🏆
                      </motion.div>
                      <h3 className="font-display text-2xl font-bold text-shimmer mb-2">Tu Luyện Kết Thúc</h3>
                      <div className="glass rounded-xl px-6 py-3 mb-3 text-center">
                        <p className="text-white/50 text-xs mb-1">Linh Lực tích lũy</p>
                        <p className="text-3xl font-black text-jade">{score}</p>
                        <p className="text-xs mt-1 font-medium" style={{ color: realmColor }}>
                          Đạt cảnh giới: {realmName}
                        </p>
                      </div>
                      {score >= highScore && score > 0 && (
                        <motion.p className="text-yellow-300 text-sm font-bold mb-1"
                          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}>
                          ✦ Kỷ lục mới! ✦
                        </motion.p>
                      )}
                      <p className="text-white/30 text-xs mb-5">
                        Kỷ lục: {highScore} · Tốt nhất: {bestRealm}
                      </p>
                    </>
                  )}

                  <motion.button
                    onClick={startGame}
                    className="px-8 py-3 rounded-xl font-semibold text-ink text-base"
                    style={{ background: "linear-gradient(135deg, #00C896, #7FFFD4)" }}
                    whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                    aria-label={gameState === "idle" ? "Bắt đầu tu luyện" : "Tu luyện lại"}>
                    {gameState === "idle" ? "⚡ Bắt Đầu Tu Luyện" : "🔄 Tu Luyện Lại"}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* High score bar */}
          <div className="flex items-center justify-between mt-3 px-1 text-xs text-white/25">
            <span>Kỷ lục: <span className="text-jade/60 font-semibold">{highScore}</span></span>
            <span>Ngũ Hành · 45 giây · Combo x6</span>
            <span>Cảnh giới: <span className="font-semibold" style={{ color: realmColor }}>{bestRealm}</span></span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
