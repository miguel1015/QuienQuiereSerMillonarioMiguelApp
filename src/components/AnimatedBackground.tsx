import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

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
const CROSSFADE_INTERVAL = 12000;

// Seeded PRNG (deterministic, React-safe)
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

function generateParticles(count: number, seed: number): Particle[] {
  const rng = seededRandom(seed);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: rng() * 100,
    y: rng() * 100,
    size: rng() * 5 + 1,
    duration: rng() * 10 + 5,
    delay: rng() * 5,
    opacity: rng() * 0.4 + 0.05,
  }));
}

const particleSets = {
  default: generateParticles(18, 42),
  intense: generateParticles(25, 43),
  celebration: generateParticles(35, 44),
  danger: generateParticles(20, 45),
  correct: generateParticles(30, 46),
};

// Pre-generate confetti data
const confettiRng = seededRandom(99);
const confettiColors = ["#dba347", "#f0c96e", "#27ae60", "#3498db", "#9b59b6", "#e74c3c", "#ffffff"];
const confettiShapes = ["circle", "rect", "star", "cross"];
const confettiData = Array.from({ length: 60 }, (_, i) => ({
  width: confettiRng() * 10 + 4,
  height: confettiRng() * 10 + 4,
  backgroundColor: confettiColors[i % confettiColors.length],
  shape: confettiShapes[Math.floor(confettiRng() * confettiShapes.length)],
  borderRadius: confettiRng() > 0.5 ? "50%" : "2px",
  left: `${confettiRng() * 100}%`,
  xOffset: (confettiRng() - 0.5) * 300,
  rotation: confettiRng() * 1080 - 540,
  duration: confettiRng() * 3 + 2,
  delay: confettiRng() * 3,
}));

// Star/sparkle data for celebration
const sparkleRng = seededRandom(200);
const sparkleData = Array.from({ length: 20 }, () => ({
  x: sparkleRng() * 100,
  y: sparkleRng() * 100,
  size: sparkleRng() * 8 + 4,
  duration: sparkleRng() * 2 + 1,
  delay: sparkleRng() * 3,
}));

const INITIAL_FONDO = Math.floor(Math.random() * fondos.length);

// Color schemes for each variant
const variantColors = {
  default: {
    orb1: "rgba(219,163,71,0.08)",
    orb2: "rgba(219,163,71,0.05)",
    accent: "rgba(219,163,71,0.08)",
    vignette: "rgba(10,10,15,0.15)",
    vignetteEdge: "rgba(10,10,15,0.60)",
  },
  intense: {
    orb1: "rgba(231,76,60,0.12)",
    orb2: "rgba(219,163,71,0.08)",
    accent: "rgba(231,76,60,0.10)",
    vignette: "rgba(10,10,15,0.20)",
    vignetteEdge: "rgba(10,10,15,0.70)",
  },
  danger: {
    orb1: "rgba(231,76,60,0.15)",
    orb2: "rgba(231,76,60,0.10)",
    accent: "rgba(231,76,60,0.15)",
    vignette: "rgba(40,0,0,0.25)",
    vignetteEdge: "rgba(40,0,0,0.75)",
  },
  correct: {
    orb1: "rgba(39,174,96,0.15)",
    orb2: "rgba(219,163,71,0.10)",
    accent: "rgba(39,174,96,0.12)",
    vignette: "rgba(0,20,0,0.15)",
    vignetteEdge: "rgba(10,10,15,0.55)",
  },
  celebration: {
    orb1: "rgba(219,163,71,0.12)",
    orb2: "rgba(155,89,182,0.08)",
    accent: "rgba(219,163,71,0.10)",
    vignette: "rgba(10,10,15,0.10)",
    vignetteEdge: "rgba(10,10,15,0.45)",
  },
};

export type BackgroundVariant = "default" | "intense" | "celebration" | "danger" | "correct";

interface AnimatedBackgroundProps {
  variant?: BackgroundVariant;
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

  const particles = particleSets[variant] || particleSets.default;
  const colors = variantColors[variant] || variantColors.default;

  const particleColor = useMemo(() => {
    switch (variant) {
      case "danger": return "#e74c3c";
      case "correct": return "#27ae60";
      case "celebration": return "#f0c96e";
      default: return "#dba347";
    }
  }, [variant]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background image with crossfade + parallax zoom */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentFondoIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-[-5%]"
            animate={{ scale: [1.05, 1.12, 1.05] }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
            style={{
              backgroundImage: `url(${fondos[currentFondoIndex]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(4px) saturate(0.7)",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Dynamic vignette overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: `radial-gradient(ellipse at center, ${colors.vignette} 0%, ${colors.vignetteEdge} 100%)`,
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Radial accent overlay (animated) */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: `radial-gradient(ellipse at center, ${colors.accent} 0%, transparent 65%)`,
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Animated glow orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl"
        animate={{
          x: [0, 120, -60, 0],
          y: [0, -100, 70, 0],
          scale: [1, 1.4, 0.8, 1],
          background: `radial-gradient(circle, ${colors.orb1} 0%, transparent 70%)`,
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "5%", left: "5%" }}
      />
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full blur-3xl"
        animate={{
          x: [0, -150, 100, 0],
          y: [0, 80, -120, 0],
          scale: [1, 0.7, 1.3, 1],
          background: `radial-gradient(circle, ${colors.orb2} 0%, transparent 70%)`,
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        style={{ bottom: "0%", right: "0%" }}
      />

      {/* Danger/intense: pulsating red border overlay */}
      {(variant === "intense" || variant === "danger") && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: variant === "danger" ? [0, 0.15, 0] : [0, 0.08, 0],
          }}
          transition={{ duration: variant === "danger" ? 0.6 : 1.2, repeat: Infinity }}
          style={{
            boxShadow: "inset 0 0 120px rgba(231,76,60,0.5)",
          }}
        />
      )}

      {/* Correct: radial green burst */}
      {variant === "correct" && (
        <motion.div
          className="absolute top-1/2 left-1/2 w-[800px] h-[800px] rounded-full -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: [0, 2.5], opacity: [0.6, 0] }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            background: "radial-gradient(circle, rgba(39,174,96,0.3) 0%, transparent 60%)",
          }}
        />
      )}

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={`${variant}-${p.id}`}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
            backgroundColor: particleColor,
            boxShadow: `0 0 ${p.size * 2}px ${particleColor}40`,
          }}
          animate={{
            y: [0, -50, 25, -70, 0],
            x: [0, 25, -20, 15, 0],
            opacity: [p.opacity, p.opacity * 2.5, p.opacity * 0.3, p.opacity * 2, p.opacity],
            scale: [1, 1.5, 0.8, 1.3, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Celebration: sparkle stars */}
      {variant === "celebration" &&
        sparkleData.map((s, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180],
            }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            <svg viewBox="0 0 24 24" fill="#f0c96e" className="w-full h-full">
              <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41Z" />
            </svg>
          </motion.div>
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
              opacity: [1, 1, 0.8, 0],
            }}
            transition={{
              duration: c.duration,
              delay: c.delay,
              repeat: Infinity,
              ease: "easeIn",
            }}
          />
        ))}

      {/* Subtle animated grid */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.015, 0.025, 0.015] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{
          backgroundImage: `linear-gradient(rgba(219,163,71,1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(219,163,71,1) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Top and bottom cinematic bars (subtle) */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  );
}
