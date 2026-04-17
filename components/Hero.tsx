"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
const ROLES = [
  "Thành viên NEMI",
  "Creative Designer",
  "Digital Creator",
  "Brand Storyteller",
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
      }, 80);
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex - 1));
        setCharIndex((i) => i - 1);
      }, 40);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setTextIndex((i) => (i + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, textIndex, texts]);

  return (
    <span>
      {displayed}
      <span className="inline-block w-0.5 h-5 bg-gold ml-0.5 animate-pulse" />
    </span>
  );
}

const nameChars = "[TÊN CỦA BẠN]".split("");

export default function Hero() {
  const [nameVisible, setNameVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setNameVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 z-10"
      aria-label="Phần giới thiệu"
    >
      {/* Avatar */}
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Rotating border */}
        <div className="avatar-border p-[3px] rounded-full w-36 h-36 md:w-44 md:h-44 animate-glow-pulse">
          <div className="w-full h-full rounded-full overflow-hidden bg-dark-card relative group">
            {/* Thay /avatar.svg bằng /avatar.jpg khi bạn có ảnh thật */}
            <Image
              src="/avatar.svg"
              alt="Avatar"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </div>

        {/* Vòng glow ngoài */}
        <div className="absolute inset-0 rounded-full bg-gold/10 blur-2xl -z-10 scale-125" />
      </motion.div>

      {/* Tên - hiệu ứng từng ký tự */}
      <div className="mb-4 overflow-hidden">
        <h1
          className="font-display font-black text-5xl md:text-8xl lg:text-9xl leading-none tracking-tight"
          aria-label="Tên của bạn"
        >
          {nameChars.map((char, i) => (
            <span
              key={i}
              className={`char-reveal text-shimmer ${char === " " ? "mr-4" : ""}`}
              style={{
                animationDelay: nameVisible ? `${i * 60}ms` : "9999s",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
      </div>

      {/* Chức vụ - typing effect */}
      <motion.div
        className="text-xl md:text-2xl text-gold/80 font-light mb-6 h-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <TypingText texts={ROLES} />
      </motion.div>

      {/* Tag NEMI */}
      <motion.div
        className="flex items-center gap-2 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <span className="glass px-4 py-2 rounded-full text-sm text-gold border border-gold/30 tracking-widest uppercase">
          ✦ NEMI Community ✦
        </span>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        aria-hidden="true"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 4v12M4 10l6 6 6-6"
              stroke="#D4AF37"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
