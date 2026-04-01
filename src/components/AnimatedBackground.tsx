import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import fondo1 from "../assets/images/fondos/fondo1.jpeg";
import fondo2 from "../assets/images/fondos/fondo2.jpeg";
import fondo3 from "../assets/images/fondos/fondo3.jpeg";
import fondo4 from "../assets/images/fondos/fondo4.jpeg";
import fondo5 from "../assets/images/fondos/fondo5.jfif";
import fondo6 from "../assets/images/fondos/fondo6.jfif";
import fondo7 from "../assets/images/fondos/fondo7.jfif";
import fondo8 from "../assets/images/fondos/fondo8.jfif";
import fondo9 from "../assets/images/fondos/fondo9.jfif";
import fondo10 from "../assets/images/fondos/fondo10.jpg";
import fondo11 from "../assets/images/fondos/fondo11.jfif";

const fondos = [fondo2, fondo1, fondo3, fondo4, fondo5, fondo6, fondo7, fondo8, fondo9, fondo10, fondo11];
const CROSSFADE_INTERVAL = 10000;

// Seeded PRNG (deterministic, React-safe — no Math.random in render)
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

// Pre-generate particles for each variant (outside render)
function generateParticles(count: number, seed: number): Particle[] {
  const rng = seededRandom(seed);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: rng() * 100,
    y: rng() * 100,
    size: rng() * 4 + 1,
    duration: rng() * 8 + 6,
    delay: rng() * 5,
    opacity: rng() * 0.3 + 0.05,
  }));
}

const particleSets = {
  default: generateParticles(12, 42),
  intense: generateParticles(20, 43),
  celebration: generateParticles(30, 44),
};

// Pre-generate confetti data (outside render)
const confettiRng = seededRandom(99);
const confettiColors = ["#dba347", "#f0c96e", "#27ae60", "#3498db", "#9b59b6", "#e74c3c"];
const confettiData = Array.from({ length: 40 }, (_, i) => ({
  width: confettiRng() * 8 + 4,
  height: confettiRng() * 8 + 4,
  backgroundColor: confettiColors[i % confettiColors.length],
  borderRadius: confettiRng() > 0.5 ? "50%" : "2px",
  left: `${confettiRng() * 100}%`,
  xOffset: (confettiRng() - 0.5) * 200,
  rotation: confettiRng() * 720 - 360,
  duration: confettiRng() * 3 + 2,
  delay: confettiRng() * 2,
}));

// Initial fondo index (module-level, runs once)
const INITIAL_FONDO = Math.floor(Math.random() * fondos.length);

interface AnimatedBackgroundProps {
  variant?: "default" | "intense" | "celebration";
}

export default function AnimatedBackground({
  variant = "default",
}: AnimatedBackgroundProps) {
  const [currentFondoIndex, setCurrentFondoIndex] = useState(INITIAL_FONDO);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFondoIndex((prev) => (prev + 1) % fondos.length);
    }, CROSSFADE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const particles = particleSets[variant];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background image with crossfade */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentFondoIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <div
            className="absolute inset-0 scale-105"
            style={{
              backgroundImage: `url(${fondos[currentFondoIndex]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(3px)",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark overlay with vignette for readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(16,16,16,0.10) 0%, rgba(16,16,16,0.25) 70%, rgba(16,16,16,0.55) 100%)",
        }}
      />

      {/* Radial gold accent overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(219,163,71,0.08)_0%,transparent_70%)]" />

      {/* Animated glow orbs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(219,163,71,0.06) 0%, transparent 70%)",
          top: "10%",
          left: "10%",
        }}
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -80, 60, 0],
          scale: [1, 1.3, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(219,163,71,0.04) 0%, transparent 70%)",
          bottom: "5%",
          right: "5%",
        }}
        animate={{
          x: [0, -120, 80, 0],
          y: [0, 60, -100, 0],
          scale: [1, 0.8, 1.2, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      {variant === "intense" && (
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(231,76,60,0.04) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -40, 20, -60, 0],
            x: [0, 20, -15, 10, 0],
            opacity: [
              p.opacity,
              p.opacity * 2,
              p.opacity * 0.5,
              p.opacity * 1.5,
              p.opacity,
            ],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Celebration confetti */}
      {variant === "celebration" &&
        confettiData.map((c, i) => (
          <motion.div
            key={`confetti-${i}`}
            className="absolute"
            style={{
              width: c.width,
              height: c.height,
              backgroundColor: c.backgroundColor,
              borderRadius: c.borderRadius,
              left: c.left,
              top: "-5%",
            }}
            animate={{
              y: ["0vh", "110vh"],
              x: [0, c.xOffset],
              rotate: [0, c.rotation],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: c.duration,
              delay: c.delay,
              repeat: Infinity,
              ease: "easeIn",
            }}
          />
        ))}

      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(219,163,71,1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(219,163,71,1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
