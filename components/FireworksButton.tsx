"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function FireworksButton() {
  const [exploded, setExploded] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const launchFireworks = () => {
    if (exploded) return;
    setExploded(true);

    const colors = ["#00C896", "#7FFFD4", "#D4AF37", "#C0392B", "#ffffff", "#00897B"];
    const duration = 6000;
    const end = Date.now() + duration;

    // Đợt 1: bùng nổ trung tâm
    confetti({
      particleCount: 100,
      spread: 120,
      origin: { x: 0.5, y: 0.55 },
      colors,
      ticks: 350,
    });

    // Liên tục hai bên
    const frame = () => {
      if (Date.now() < end) {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 50,
          origin: { x: 0, y: 0.65 },
          colors,
          ticks: 200,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 50,
          origin: { x: 1, y: 0.65 },
          colors,
          ticks: 200,
        });
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Đợt 2: pháo hoa lớn
    setTimeout(() => {
      confetti({
        particleCount: 180,
        spread: 180,
        startVelocity: 55,
        gravity: 0.75,
        origin: { x: 0.5, y: 0.35 },
        colors,
        ticks: 450,
        shapes: ["star", "circle"],
      });
      setShowCongrats(true);
    }, 700);

    setTimeout(() => {
      confetti({ particleCount: 80, spread: 100, origin: { x: 0.25, y: 0.5 }, colors });
      confetti({ particleCount: 80, spread: 100, origin: { x: 0.75, y: 0.5 }, colors });
    }, 2200);

    setTimeout(() => {
      setExploded(false);
      setShowCongrats(false);
    }, 7500);
  };

  return (
    <section className="section relative z-10 px-6" aria-label="Tặng Linh Thạch">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-jade/40 text-xs tracking-widest uppercase mb-2">☯ Duyên Phận ☯</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-shimmer">
            Tặng Linh Thạch
          </h2>
          <p className="text-white/30 text-sm mt-2">Nhấn để khai mở bảo tàng linh khí</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <motion.button
            ref={btnRef}
            onClick={launchFireworks}
            disabled={exploded}
            className="relative group overflow-hidden rounded-2xl px-12 py-5 text-xl font-semibold text-ink cursor-pointer disabled:cursor-not-allowed select-none"
            style={{
              background: "linear-gradient(135deg, #00C896 0%, #7FFFD4 50%, #00C896 100%)",
              backgroundSize: "200% auto",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: exploded ? 1 : 0.95 }}
            animate={exploded ? { scale: [1, 1.3, 0], opacity: [1, 1, 0] } : {}}
            transition={exploded ? { duration: 0.5 } : {}}
            aria-label="Tặng Linh Thạch và khai mở pháo hoa"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ boxShadow: "0 0 40px rgba(0,200,150,0.9)" }}
            />
            <span className="relative flex items-center gap-3">
              <span className="text-2xl">💎</span>
              <span>Tặng Linh Thạch</span>
            </span>
          </motion.button>

          {/* Ripple rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-2xl border-2 border-jade/30 pointer-events-none"
              animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.25, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.7, ease: "easeOut" }}
            />
          ))}
        </motion.div>

        {/* Chúc mừng overlay */}
        <AnimatePresence>
          {showCongrats && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="glass rounded-3xl px-12 py-8 text-center border border-jade/40"
                initial={{ scale: 0.4, opacity: 0, y: 60 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 14 }}
              >
                <motion.div
                  className="text-5xl mb-4"
                  animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  ☯
                </motion.div>
                <h3 className="font-display text-3xl font-bold text-shimmer mb-2">
                  Linh Khí Khai Phóng!
                </h3>
                <p className="text-white/60 text-base">
                  Cảm tạ đạo hữu đã ghé thăm ✦
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
