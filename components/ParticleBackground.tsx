"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

const options: ISourceOptions = {
  background: { color: { value: "transparent" } },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: { enable: true, mode: "grab" },
      onClick: { enable: true, mode: "push" },
    },
    modes: {
      grab: { distance: 150 },
      push: { quantity: 2 },
    },
  },
  particles: {
    color: { value: ["#D4AF37", "#F0D060", "#ffffff", "#a855f7"] },
    links: {
      color: "#D4AF37",
      distance: 120,
      enable: true,
      opacity: 0.07,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.6,
      direction: "none",
      random: true,
      straight: false,
      outModes: { default: "bounce" },
    },
    number: {
      density: { enable: true, width: 900 },
      value: 60,
    },
    opacity: {
      value: { min: 0.05, max: 0.35 },
      animation: { enable: true, speed: 0.5 },
    },
    shape: { type: ["circle", "triangle"] },
    size: { value: { min: 1, max: 3 } },
  },
  detectRetina: true,
};

export default function ParticleBackground() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return <Particles id="tsparticles" options={options} />;
}
