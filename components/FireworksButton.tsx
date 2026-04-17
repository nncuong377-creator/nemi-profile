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

    // Pháo hoa nhiều đợt từ nhiều vị trí
    const duration = 6000;
    const end = Date.now() + duration;

    const colors = ["#D4AF37", "#F0D060", "#ffffff", "#ff6b6b", "#a855f7", "#3b82f6"];

    // Đợt 1: từ giữa
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { x: 0.5, y: 0.6 },
      colors,
      ticks: 300,
    });

    // Các đợt tiếp theo
    const frame = () => {
      if (Date.now() < end) {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors,
          ticks: 200,
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors,
          ticks: 200,
        });
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Đợt bùng phát giữa
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 160,
        startVelocity: 50,
        gravity: 0.8,
        origin: { x: 0.5, y: 0.4 },
        colors,
        ticks: 400,
        shapes: ["star", "circle"],
      });
      setShowCongrats(true);
    }, 800);

    // Đợt cuối
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 120,
        startVelocity: 40,
        origin: { x: 0.3, y: 0.5 },
        colors,
      });
      confetti({
        particleCount: 100,
        spread: 120,
        startVelocity: 40,
        origin: { x: 0.7, y: 0.5 },
        colors,
      });
    }, 2000);

    // Reset
    setTimeout(() => {
      setExploded(false);
      setShowCongrats(false);
    }, 7000);
  };

  return (
    <section className="section relative z-10 px-6" aria-label="Tặng quà">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-shimmer mb-3">
            Dành cho bạn
          </h2>
          <p className="text-white/40 text-sm">Nhấn nút bên dưới để nhận món quà bất ngờ</p>
        </motion.div>

        {/* Nút chính */}
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
            className="relative group overflow-hidden rounded-2xl px-12 py-6 text-xl font-semibold text-dark-bg cursor-pointer disabled:cursor-not-allowed select-none"
            style={{
              background: "linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)",
              backgroundSize: "200% auto",
            }}
            whileHover={{ scale: 1.05, backgroundPosition: "right center" }}
            whileTap={{ scale: exploded ? 1 : 0.95 }}
            animate={
              exploded
                ? { scale: [1, 1.3, 0], opacity: [1, 1, 0] }
                : {}
            }
            transition={exploded ? { duration: 0.5 } : {}}
            aria-label="Nhấn để tặng quà và xem pháo hoa"
          >
            {/* Shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

            {/* Glow */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ boxShadow: "0 0 40px rgba(212,175,55,0.8)" }} />

            <span className="relative flex items-center gap-3">
              <span className="text-2xl">🎁</span>
              <span>Tặng quà</span>
            </span>
          </motion.button>

          {/* Ripple rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-2xl border-2 border-gold/40 pointer-events-none"
              animate={{ scale: [1, 1.5, 2], opacity: [0.6, 0.3, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>

        {/* Thông điệp chúc mừng */}
        <AnimatePresence>
          {showCongrats && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="glass rounded-3xl px-12 py-8 text-center border border-gold/40"
                initial={{ scale: 0.5, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <motion.div
                  className="text-5xl mb-4"
                  animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  🎊
                </motion.div>
                <h3 className="font-display text-3xl font-bold text-shimmer mb-2">
                  Chúc mừng!
                </h3>
                <p className="text-white/70 text-lg">
                  Cảm ơn bạn đã ghé thăm trang của mình ✨
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
