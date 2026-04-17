"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import SocialLinks from "@/components/SocialLinks";
import FireworksButton from "@/components/FireworksButton";
import MessageForm from "@/components/MessageForm";
import MiniGame from "@/components/MiniGame";

const ParticleBackground = dynamic(() => import("@/components/ParticleBackground"), { ssr: false });

const Divider = () => (
  <div className="max-w-4xl mx-auto px-6">
    <div className="h-px bg-gradient-to-r from-transparent via-jade/20 to-transparent" />
  </div>
);

export default function Home() {
  return (
    <main className="relative min-h-screen" role="main">
      <ParticleBackground />

      <div className="fixed inset-0 pointer-events-none z-[1]"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,200,150,0.05) 0%, transparent 60%)" }}
        aria-hidden="true" />

      <div className="relative z-10">
        <Hero />
        <Divider />
        <SocialLinks />
        <Divider />
        <FireworksButton />
        <Divider />
        <MessageForm />
        <Divider />
        <MiniGame />

        <footer className="py-12 text-center text-white/15 text-sm">
          <p className="text-jade/30">☯ Vạn lý tu tiên lộ ☯</p>
          <p className="mt-1 text-xs">© {new Date().getFullYear()} Nguyễn Mạnh Cường · NEMI</p>
        </footer>
      </div>
    </main>
  );
}
