"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Cảnh giới tu tiên
const REALMS = [
  "⚡ Luyện Khí Kỳ — NEMI Đệ Tử",
  "🌿 Trúc Cơ Kỳ — Sáng Tạo Thuật Sĩ",
  "🔥 Khai Quang Kỳ — Digital Creator",
  "💎 Nguyên Anh Kỳ — Brand Storyteller",
];

function TypingText({ texts }: { texts: string[] }) {
  const [displayed, setDisplayed] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex + 1));
        setCharIndex((i) => i + 1);
      }, 70);
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex - 1));
        setCharIndex((i) => i - 1);
      }, 35);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setTextIndex((i) => (i + 1) % texts.length);
    }
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, textIndex, texts]);

  return (
    <span>
      {displayed}
      <span className="inline-block w-0.5 h-5 bg-jade ml-0.5 animate-pulse" />
    </span>
  );
}

// Tên hiển thị từng chữ
const NAME = "Nguyễn Mạnh Cường";
const nameChars = NAME.split("");

export default function Hero() {
  const [nameVisible, setNameVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setNameVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 z-10"
      aria-label="Phần giới thiệu"
    >
      {/* Hào quang nền */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(0,200,150,0.07) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Avatar */}
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Vòng linh khí xoay */}
        <div className="avatar-border p-[3px] rounded-full w-36 h-36 md:w-44 md:h-44 animate-glow-pulse">
          <div className="w-full h-full rounded-full overflow-hidden bg-ink-card relative">
            <Image
              src="/avatar.jpg"
              alt="Nguyễn Mạnh Cường"
              fill
              className="object-cover"
              priority
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/avatar.svg";
              }}
            />
          </div>
        </div>

        {/* Vòng jade ngoài */}
        <motion.div
          className="absolute inset-[-8px] rounded-full border border-jade/20 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-[-16px] rounded-full border border-jade/10 pointer-events-none"
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        {/* Glow */}
        <div className="absolute inset-0 rounded-full bg-jade/10 blur-2xl -z-10 scale-150" />
      </motion.div>

      {/* Tên — char reveal */}
      <div className="mb-3 overflow-hidden">
        <h1
          className="font-display font-black text-4xl md:text-7xl lg:text-8xl leading-none tracking-tight"
          aria-label={NAME}
        >
          {nameChars.map((char, i) => (
            <span
              key={i}
              className={`char-reveal text-shimmer ${char === " " ? "" : ""}`}
              style={{
                animationDelay: nameVisible ? `${i * 55}ms` : "9999s",
                marginRight: char === " " ? "0.3em" : undefined,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
      </div>

      {/* Cảnh giới — typing */}
      <motion.div
        className="text-base md:text-xl text-jade/80 font-light mb-5 h-7"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.6 }}
      >
        <TypingText texts={REALMS} />
      </motion.div>

      {/* Phái NEMI */}
      <motion.div
        className="flex items-center gap-3 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 0.6 }}
      >
        <span className="glass px-5 py-2 rounded-full text-sm text-jade border border-jade/25 tracking-widest">
          ☯ NEMI Môn Phái ☯
        </span>
      </motion.div>

      {/* Trích dẫn tu tiên */}
      <motion.p
        className="text-white/20 text-xs tracking-widest italic max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
      >
        "Vạn lý tu tiên lộ, nhất bộ nhất cước ấn"
      </motion.p>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.8 }}
        aria-hidden="true"
      >
        <span className="text-xs tracking-widest uppercase text-jade/40">Khám phá</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4v12M4 10l6 6 6-6" stroke="#00C896" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
