"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  caught: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

const COLORS = ["#D4AF37", "#F0D060", "#ffffff", "#a855f7", "#3b82f6", "#ff6b6b"];
const GAME_DURATION = 30;

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  });

  const set = useCallback(
    (v: T) => {
      setValue(v);
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(v));
      }
    },
    [key]
  );

  return [value, set] as const;
}

export default function MiniGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const lastCatchTimeRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const starIdRef = useRef(0);
  const particleIdRef = useRef(0);

  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameState, setGameState] = useState<"idle" | "playing" | "over">("idle");
  const [highScore, setHighScore] = useLocalStorage("nemi-game-highscore", 0);

  const spawnStar = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const star: Star = {
      id: starIdRef.current++,
      x: Math.random() * (canvas.width - 40) + 20,
      y: -30,
      size: Math.random() * 16 + 10,
      speed: Math.random() * 3 + 1.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      caught: false,
    };
    starsRef.current.push(star);
  }, []);

  const spawnParticles = useCallback((x: number, y: number, color: string) => {
    for (let i = 0; i < 8; i++) {
      particlesRef.current.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 1,
        color,
      });
    }
  }, []);

  const drawStar = useCallback(
    (ctx: CanvasRenderingContext2D, star: Star) => {
      const { x, y, size, color } = star;
      ctx.save();
      ctx.shadowBlur = 15;
      ctx.shadowColor = color;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
        const innerAngle = angle + Math.PI / 5;
        if (i === 0) {
          ctx.moveTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
        } else {
          ctx.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
        }
        ctx.lineTo(
          x + Math.cos(innerAngle) * (size * 0.4),
          y + Math.sin(innerAngle) * (size * 0.4)
        );
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },
    []
  );

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Cập nhật và vẽ ngôi sao
    starsRef.current = starsRef.current.filter((star) => {
      if (star.caught) return false;
      star.y += star.speed;
      if (star.y > canvas.height + 30) return false;
      drawStar(ctx, star);
      return true;
    });

    // Cập nhật và vẽ particles
    particlesRef.current = particlesRef.current.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2;
      p.life -= 0.04;
      if (p.life <= 0) return false;
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return true;
    });

    animFrameRef.current = requestAnimationFrame(gameLoop);
  }, [drawStar]);

  const startGame = useCallback(() => {
    starsRef.current = [];
    particlesRef.current = [];
    scoreRef.current = 0;
    comboRef.current = 1;
    setScore(0);
    setCombo(1);
    setTimeLeft(GAME_DURATION);
    setGameState("playing");
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;

    // Spawn sao định kỳ
    const spawnInterval = setInterval(spawnStar, 600);

    // Đếm ngược thời gian
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

    // Vòng lặp game
    animFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(timerInterval);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, spawnStar, gameLoop, setHighScore]);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (gameState !== "playing") return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;

      const now = Date.now();
      let caught = false;

      starsRef.current = starsRef.current.map((star) => {
        if (caught) return star;
        const dist = Math.hypot(mx - star.x, my - star.y);
        if (dist < star.size * 1.5) {
          // Tính combo
          if (now - lastCatchTimeRef.current < 1000) {
            comboRef.current = Math.min(comboRef.current + 1, 5);
          } else {
            comboRef.current = 1;
          }
          lastCatchTimeRef.current = now;

          const points = 10 * comboRef.current;
          scoreRef.current += points;
          setScore(scoreRef.current);
          setCombo(comboRef.current);
          spawnParticles(star.x, star.y, star.color);
          caught = true;
          return { ...star, caught: true };
        }
        return star;
      });
    },
    [gameState, spawnParticles]
  );

  return (
    <section className="section relative z-10 px-6" aria-label="Mini game">
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-shimmer mb-3">
            Catch the Star ⭐
          </h2>
          <p className="text-white/40 text-sm">
            Bắt các ngôi sao rơi — combo liên tiếp để nhân điểm!
          </p>
        </motion.div>

        <motion.div
          className="glass rounded-3xl p-6 overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Thanh thống kê */}
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="text-center">
              <p className="text-white/40 text-xs uppercase tracking-wider">Điểm</p>
              <p className="text-gold font-bold text-2xl">{score}</p>
            </div>
            <div className="text-center">
              <p className="text-white/40 text-xs uppercase tracking-wider">Combo</p>
              <p className={`font-bold text-2xl ${combo > 1 ? "text-purple-400" : "text-white/60"}`}>
                x{combo}
              </p>
            </div>
            <div className="text-center">
              <p className="text-white/40 text-xs uppercase tracking-wider">Thời gian</p>
              <p className={`font-bold text-2xl ${timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-white"}`}>
                {timeLeft}s
              </p>
            </div>
            <div className="text-center">
              <p className="text-white/40 text-xs uppercase tracking-wider">Kỷ lục</p>
              <p className="text-gold/70 font-bold text-2xl">{highScore}</p>
            </div>
          </div>

          {/* Canvas game */}
          <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
            <canvas
              ref={canvasRef}
              width={600}
              height={450}
              className="game-canvas w-full h-full cursor-crosshair"
              style={{ background: "linear-gradient(180deg, #0A0A1A 0%, #0D0A1F 100%)" }}
              onClick={handleCanvasClick}
              aria-label="Game canvas - Click để bắt ngôi sao"
            />

            {/* Overlay màn hình */}
            <AnimatePresence>
              {gameState !== "playing" && (
                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-center"
                  style={{ background: "rgba(10,10,20,0.85)", backdropFilter: "blur(8px)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {gameState === "idle" && (
                    <>
                      <motion.div
                        className="text-6xl mb-4"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ⭐
                      </motion.div>
                      <h3 className="font-display text-2xl font-bold text-gold mb-2">
                        Sẵn sàng chưa?
                      </h3>
                      <p className="text-white/50 text-sm mb-6 text-center px-4">
                        Click các ngôi sao rơi xuống<br />
                        Combo liên tiếp = nhân điểm!
                      </p>
                    </>
                  )}

                  {gameState === "over" && (
                    <>
                      <motion.div
                        className="text-5xl mb-3"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        🏆
                      </motion.div>
                      <h3 className="font-display text-2xl font-bold text-gold mb-1">
                        Kết thúc!
                      </h3>
                      <p className="text-white/70 mb-1">
                        Điểm của bạn:{" "}
                        <span className="text-gold font-bold text-xl">{score}</span>
                      </p>
                      {score >= highScore && score > 0 && (
                        <motion.p
                          className="text-yellow-300 text-sm mb-4 font-semibold"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          🎉 Kỷ lục mới!
                        </motion.p>
                      )}
                      {(!score || score < highScore) && (
                        <p className="text-white/40 text-sm mb-4">
                          Kỷ lục: {highScore} điểm
                        </p>
                      )}
                    </>
                  )}

                  <motion.button
                    onClick={startGame}
                    className="px-8 py-3 rounded-xl font-semibold text-dark-bg"
                    style={{ background: "linear-gradient(135deg, #D4AF37, #F0D060)" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={gameState === "idle" ? "Bắt đầu game" : "Chơi lại"}
                  >
                    {gameState === "idle" ? "🚀 Bắt đầu" : "🔄 Chơi lại"}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="text-center text-white/25 text-xs mt-3">
            High score được lưu tự động trên máy của bạn
          </p>
        </motion.div>
      </div>
    </section>
  );
}
