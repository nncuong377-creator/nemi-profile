"use client";

import { useRef, MouseEvent } from "react";
import { motion } from "framer-motion";

interface SocialLink {
  name: string;
  subtitle: string;
  url: string;
  color: string;
  glow: string;
  icon: React.ReactNode;
  hoverEffect: string;
}

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const ZaloIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const socialLinks: SocialLink[] = [
  {
    name: "Facebook",
    subtitle: "Giao Lưu Đạo Hữu",
    url: "https://www.facebook.com/manhcuong.432/",
    color: "#1877F2",
    glow: "rgba(24,119,242,0.4)",
    icon: <FacebookIcon />,
    hoverEffect: "shake",
  },
  {
    name: "Zalo",
    subtitle: "Truyền Âm Phù",
    url: "https://zalo.me/0374106914",
    color: "#00C896",
    glow: "rgba(0,200,150,0.4)",
    icon: <ZaloIcon />,
    hoverEffect: "pulse",
  },
  {
    name: "LinkedIn",
    subtitle: "Tiên Giới Nghề Nghiệp",
    url: "https://www.linkedin.com/in/c%C6%B0%E1%BB%9Dng-nguy%E1%BB%85n-m%E1%BA%A1nh-b7a782321/",
    color: "#0A66C2",
    glow: "rgba(10,102,194,0.4)",
    icon: <LinkedInIcon />,
    hoverEffect: "tilt",
  },
];

const hoverVariants = {
  shake: { x: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4 } },
  pulse: { scale: [1, 1.12, 1, 1.08, 1], transition: { duration: 0.5 } },
  tilt: { rotateY: 15, rotateX: -8, scale: 1.04, transition: { duration: 0.3 } },
};

function MagneticCard({ link, index }: { link: SocialLink; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect || !cardRef.current) return;
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    cardRef.current.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "translate(0,0)";
  };

  return (
    <motion.a
      ref={cardRef}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass rounded-2xl p-6 flex flex-col items-center gap-3 cursor-pointer group relative overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hoverVariants[link.hoverEffect as keyof typeof hoverVariants]}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.1s ease" }}
      aria-label={`Truy cập ${link.name}`}
    >
      {/* Glow nền khi hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl"
        style={{ background: `radial-gradient(circle at center, ${link.color}18, transparent 70%)` }}
      />

      {/* Icon */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110"
        style={{
          backgroundColor: link.color,
          boxShadow: `0 8px 24px ${link.glow}`,
        }}
      >
        {link.icon}
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">{link.name}</p>
        <p className="text-xs text-jade/50 group-hover:text-jade/80 transition-colors mt-0.5">{link.subtitle}</p>
      </div>

      {/* Arrow */}
      <div className="absolute top-3 right-3 text-white/15 group-hover:text-white/50 transition-colors">
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
          <path d="M2 12L12 2M12 2H5M12 2v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </motion.a>
  );
}

export default function SocialLinks() {
  return (
    <section className="section relative z-10 px-6" aria-label="Mạng xã hội">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-jade/40 text-xs tracking-widest uppercase mb-2">☯ Tiên Giới Liên Lạc ☯</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-shimmer">
            Giao Lưu Đạo Hữu
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto sm:max-w-none">
          {socialLinks.map((link, i) => (
            <MagneticCard key={link.name} link={link} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
