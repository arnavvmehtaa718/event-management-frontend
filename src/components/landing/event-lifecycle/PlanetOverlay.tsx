import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import type { PlanetDef } from "./planetData"
import { PLANETS } from "./planetData"

interface PlanetOverlayProps {
  planet: PlanetDef
  isActive: boolean
  index: number
}

export function PlanetOverlay({ planet, isActive, index }: PlanetOverlayProps) {
  const Icon = planet.icon
  const side = index % 2 === 0 ? "left" : "right"

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key={planet.id}
          initial={{
            opacity: 0,
            x: side === "left" ? -80 : 80,
            scale: 0.92,
          }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{
            opacity: 0,
            x: side === "left" ? -50 : 50,
            scale: 0.96,
          }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`absolute top-1/2 -translate-y-1/2 z-20 w-[calc(100%-3rem)] max-w-md md:w-full ${
            side === "left"
              ? "left-4 md:left-12 lg:left-20"
              : "right-4 md:right-12 lg:right-20"
          }`}
          style={{ pointerEvents: "auto" }}
        >
          <div
            className="relative overflow-hidden rounded-2xl border p-6 md:p-8"
            style={{
              background: "var(--lc-card-bg)",
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              borderColor: `${planet.color}18`,
              boxShadow: `
                0 0 80px ${planet.glowColor},
                0 25px 60px rgba(0,0,0,0.15),
                inset 0 1px 0 ${planet.color}10
              `,
            }}
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-0 h-px"
              style={{
                width: "60%",
                background: `linear-gradient(90deg, transparent, ${planet.color}60, transparent)`,
              }}
            />

            {/* Corner glow */}
            <div
              className="absolute -top-20 -right-20 h-40 w-40 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${planet.glowColor}, transparent 70%)`,
                opacity: 0.3,
              }}
            />

            {/* Planet number badge */}
            <div className="relative flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex size-10 items-center justify-center rounded-xl"
                  style={{
                    background: `${planet.color}12`,
                    border: `1px solid ${planet.color}25`,
                  }}
                >
                  <Icon size={18} style={{ color: planet.color }} strokeWidth={2.5} />
                </motion.div>
                <div>
                  <span
                    className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase block"
                    style={{ color: `${planet.color}90` }}
                  >
                    planet {String(planet.id + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[9px] tracking-widest" style={{ color: "var(--lc-body)" }}>
                    of {String(PLANETS.length).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Live pulse */}
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-1.5"
              >
                <div
                  className="size-1.5 rounded-full"
                  style={{ background: planet.color }}
                />
                <span
                  className="font-mono text-[9px] tracking-widest uppercase"
                  style={{ color: planet.color }}
                >
                  active
                </span>
              </motion.div>
            </div>

            {/* Title */}
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none"
              style={{ fontFamily: "'Archivo', sans-serif", color: "var(--lc-heading)" }}
            >
              {planet.title}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-1.5 font-mono text-xs tracking-wide"
              style={{ color: planet.color }}
            >
              {planet.subtitle}
            </motion.p>

            {/* Separator */}
            <div
              className="my-5 h-px w-full"
              style={{
                background: `linear-gradient(90deg, ${planet.color}20, transparent)`,
              }}
            />

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="text-sm leading-relaxed"
              style={{ color: "var(--lc-body)" }}
            >
              {planet.description}
            </motion.p>

            {/* Features */}
            <ul className="mt-5 flex flex-col gap-2.5">
              {planet.features.map((feat, i) => (
                <motion.li
                  key={feat}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.06 }}
                  className="flex items-center gap-3 text-sm"
                  style={{ color: "var(--lc-body)" }}
                >
                  <span
                    className="size-1.5 rounded-full shrink-0"
                    style={{
                      background: planet.color,
                      boxShadow: `0 0 8px ${planet.glowColor}`,
                    }}
                  />
                  {feat}
                </motion.li>
              ))}
            </ul>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="mt-6"
            >
              <Link
                to={planet.ctaLink}
                className="group inline-flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-bold uppercase tracking-wide transition-all duration-300 hover:scale-[1.03]"
                style={{
                  background: `${planet.color}12`,
                  border: `1px solid ${planet.color}30`,
                  color: planet.color,
                  fontFamily: "'Archivo', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${planet.color}22`
                  e.currentTarget.style.boxShadow = `0 0 30px ${planet.glowColor}`
                  e.currentTarget.style.borderColor = `${planet.color}50`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `${planet.color}12`
                  e.currentTarget.style.boxShadow = "none"
                  e.currentTarget.style.borderColor = `${planet.color}30`
                }}
              >
                {planet.cta}
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </motion.div>

            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 right-0 h-px"
              style={{
                width: "40%",
                background: `linear-gradient(270deg, transparent, ${planet.color}30, transparent)`,
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
