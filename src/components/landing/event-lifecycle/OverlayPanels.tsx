import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, type LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { PLANETS, type PlanetDef } from "./planetData"

interface OverlayPanelsProps {
  activePlanet: number
  progress: number
}

function PlanetPanel({
  planet,
  isActive,
  side,
}: {
  planet: PlanetDef
  isActive: boolean
  side: "left" | "right"
}) {
  const Icon = planet.icon

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key={planet.id}
          initial={{ opacity: 0, x: side === "left" ? -60 : 60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: side === "left" ? -40 : 40, scale: 0.97 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute top-1/2 -translate-y-1/2 z-20 w-full max-w-md ${
            side === "left" ? "left-6 md:left-16 lg:left-24" : "right-6 md:right-16 lg:right-24"
          }`}
          style={{ pointerEvents: "auto" }}
        >
          <div
            className="relative rounded-2xl border p-6 md:p-8"
            style={{
              background: "rgba(5,5,5,0.85)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderColor: `${planet.color}22`,
              boxShadow: `0 0 60px ${planet.glowColor}, 0 25px 50px rgba(0,0,0,0.5)`,
            }}
          >
            {/* Accent line */}
            <div
              className="absolute top-0 left-8 h-px"
              style={{
                width: "40%",
                background: `linear-gradient(90deg, transparent, ${planet.color}, transparent)`,
              }}
            />

            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-4">
              <div
                className="flex size-8 items-center justify-center rounded-lg"
                style={{
                  background: `${planet.color}18`,
                  border: `1px solid ${planet.color}30`,
                }}
              >
                <Icon size={16} style={{ color: planet.color }} />
              </div>
              <span
                className="font-mono text-[10px] font-semibold tracking-[0.2em] uppercase"
                style={{ color: planet.color }}
              >
                {String(planet.id + 1).padStart(2, "0")} / {String(PLANETS.length).padStart(2, "0")}
              </span>
            </div>

            {/* Title */}
            <h3
              className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none"
              style={{
                fontFamily: "'Archivo', sans-serif",
                color: "var(--lc-heading)",
              }}
            >
              {planet.title}
            </h3>
            <p
              className="mt-1 font-mono text-xs tracking-wide"
              style={{ color: planet.color }}
            >
              {planet.subtitle}
            </p>

            {/* Description */}
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--lc-body)" }}>
              {planet.description}
            </p>

            {/* Features */}
            <ul className="mt-5 flex flex-col gap-2.5">
              {planet.features.map((feat, i) => (
                <motion.li
                  key={feat}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-2.5 text-sm"
                  style={{ color: "var(--lc-body)" }}
                >
                  <span
                    className="size-1.5 rounded-full shrink-0"
                    style={{
                      background: planet.color,
                      boxShadow: `0 0 6px ${planet.glowColor}`,
                    }}
                  />
                  {feat}
                </motion.li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              to={planet.ctaLink}
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: `${planet.color}15`,
                border: `1px solid ${planet.color}35`,
                color: planet.color,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${planet.color}25`
                e.currentTarget.style.boxShadow = `0 0 20px ${planet.glowColor}`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `${planet.color}15`
                e.currentTarget.style.boxShadow = "none"
              }}
            >
              {planet.cta}
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Progress indicator ─── */
function ProgressBar({
  activePlanet,
  progress,
}: {
  activePlanet: number
  progress: number
}) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3 md:right-10">
      {PLANETS.map((planet, i) => {
        const isActive = i === activePlanet
        const isPast = i < activePlanet
        return (
          <div key={planet.id} className="flex items-center gap-3">
            <motion.div
              animate={{
                scale: isActive ? 1.3 : 1,
                opacity: isActive ? 1 : isPast ? 0.4 : 0.2,
              }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div
                className="size-2 rounded-full transition-all duration-500"
                style={{
                  background: isActive
                    ? planet.color
                    : isPast
                    ? `${planet.color}80`
                    : "var(--lc-body)",
                  boxShadow: isActive
                    ? `0 0 12px ${planet.glowColor}`
                    : "none",
                }}
              />
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -inset-1.5 rounded-full border"
                  style={{ borderColor: `${planet.color}40` }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
            </motion.div>
            {isActive && (
              <motion.span
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-mono text-[10px] tracking-widest uppercase whitespace-nowrap hidden md:block"
                style={{ color: planet.color }}
              >
                {planet.title}
              </motion.span>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── Scroll hint at start ─── */
function ScrollHint({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--lc-body)" }}>
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="size-5 rounded-full border flex items-center justify-center"
            style={{ borderColor: "var(--lc-body)" }}
          >
            <div className="size-1 rounded-full bg-primary" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export { PlanetPanel, ProgressBar, ScrollHint }
