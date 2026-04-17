"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import SocialLinks from "@/components/SocialLinks";
import FireworksButton from "@/components/FireworksButton";
import MessageForm from "@/components/MessageForm";
import MiniGame from "@/components/MiniGame";

// Particle background chỉ render client-side (dùng browser API)
const ParticleBackground = dynamic(() => import("@/components/ParticleBackground"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative min-h-screen" role="main">
      {/* Background particles */}
      <ParticleBackground />

      {/* Gradient overlay phía trên particle */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(212,175,55,0.06) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      {/* Nội dung chính */}
      <div className="relative z-10">
        {/* Hero */}
        <Hero />

        {/* Divider */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </div>

        {/* Social Links */}
        <SocialLinks />

        {/* Divider */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </div>

        {/* Nút tặng quà + pháo hoa */}
        <FireworksButton />

        {/* Divider */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </div>

        {/* Form gửi tin nhắn Telegram */}
        <MessageForm />

        {/* Divider */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </div>

        {/* Mini Game */}
        <MiniGame />

        {/* Footer */}
        <footer className="relative z-10 py-12 text-center text-white/20 text-sm">
          <p>Made with ✦ by NEMI</p>
          <p className="mt-1 text-xs">© {new Date().getFullYear()} NEMI Digital Profile</p>
        </footer>
      </div>
    </main>
  );
}
