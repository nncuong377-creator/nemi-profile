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
      grab: { distance: 140 },
      push: { quantity: 2 },
    },
  },
  particles: {
    color: { value: ["#00C896", "#7FFFD4", "#00897B", "#C0392B", "#D4AF37"] },
    links: {
      color: "#00C896",
      distance: 130,
      enable: true,
      opacity: 0.06,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.5,
      direction: "none",
      random: true,
      straight: false,
      outModes: { default: "bounce" },
    },
    number: {
      density: { enable: true, width: 900 },
      value: 55,
    },
    opacity: {
      value: { min: 0.05, max: 0.3 },
      animation: { enable: true, speed: 0.4 },
    },
    shape: { type: ["circle"] },
    size: { value: { min: 1, max: 2.5 } },
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
