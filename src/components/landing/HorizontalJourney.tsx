"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import {
  motion,
  useReducedMotion,
  useInView,
  AnimatePresence,
} from "framer-motion"
import {
  UserPlus,
  Search,
  Ticket,
  ScanLine,
  Award,
  Users,
  type LucideIcon,
} from "lucide-react"

/* ─────────────────────── Data ─────────────────────── */

interface JourneyStep {
  num: string
  icon: LucideIcon
  title: string
  description: string
  supportingText: string
}

const steps: JourneyStep[] = [
  {
    num: "01",
    icon: UserPlus,
    title: "Create Account",
    description: "Sign up in seconds",
    supportingText: "One-click sign up. Attendee & organizer roles.",
  },
  {
    num: "02",
    icon: Search,
    title: "Discover Events",
    description: "Find what matters",
    supportingText: "Filter by category, city & mode. Online, offline & hybrid.",
  },
  {
    num: "03",
    icon: Ticket,
    title: "Register",
    description: "One tap to go",
    supportingText: "One-tap registration. Ticket + QR issued instantly.",
  },
  {
    num: "04",
    icon: ScanLine,
    title: "QR Check-in",
    description: "Seamless entry",
    supportingText: "Scan QR at entry. Attendance marked automatically.",
  },
  {
    num: "05",
    icon: Award,
    title: "Certificate",
    description: "Auto-generated",
    supportingText: "Issued on attendance. Download anytime.",
  },
  {
    num: "06",
    icon: Users,
    title: "Community",
    description: "Stay connected",
    supportingText: "Confirmations, reminders, and venue change alerts.",
  },
]

/* ────────────────── Reduced Motion ────────────────── */

function useReducedMotionValue() {
  const reduce = useReducedMotion()
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    if (reduce) {
      setPrefersReduced(true)
      return
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [reduce])

  return prefersReduced
}

/* ─────────────────── Background ──────────────────── */

function Particles({ count = 20 }: { count?: number }) {
  const reduce = useReducedMotion()

  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: (i * 137.508) % 100,
        y: (i * 97.31 + 13) % 100,
        size: 1.5 + (i % 3) * 0.8,
        duration: 18 + (i % 5) * 4,
        delay: (i * 0.8) % 6,
      })),
    [count],
  )

  if (reduce) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background:
              "radial-gradient(circle, rgba(255,213,74,0.35) 0%, rgba(255,213,74,0) 70%)",
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

function LightStreaks() {
  const reduce = useReducedMotion()
  if (reduce) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute h-px opacity-[0.06]"
          style={{
            top: `${20 + i * 25}%`,
            left: "-10%",
            width: "120%",
            background:
              "linear-gradient(90deg, transparent, var(--primary), transparent)",
          }}
          animate={{ x: ["-30%", "30%", "-30%"] }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            delay: i * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

/* ────────────────── Single Node ──────────────────── */

function JourneyNode({
  step,
  isActive,
  isPast,
  isHovered,
  index,
  onHover,
  onLeave,
  reduce,
}: {
  step: JourneyStep
  isActive: boolean
  isPast: boolean
  isHovered: boolean
  index: number
  onHover: () => void
  onLeave: () => void
  reduce: boolean
}) {
  const Icon = step.icon
  const isLit = isActive || isPast

  return (
    <motion.div
      className="relative flex flex-1 flex-col items-center text-center"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduce ? 0 : index * 0.08, duration: 0.45 }}
    >
      {/* Glow backdrop */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="pointer-events-none absolute -inset-6 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,213,74,0.12) 0%, transparent 70%)",
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Node circle — premium layered */}
      <motion.div
        className="relative z-10 flex size-16 items-center justify-center rounded-full sm:size-20"
        animate={{
          scale: isActive ? 1.15 : isHovered ? 1.1 : 1,
          y: isHovered ? -4 : 0,
          borderColor: isLit
            ? "var(--primary)"
            : "color-mix(in srgb, var(--border) 70%, var(--foreground) 10%)",
          backgroundColor: isActive
            ? "var(--primary)"
            : isPast
              ? "color-mix(in srgb, var(--primary) 15%, var(--card))"
              : "var(--card)",
          boxShadow: isActive
            ? "0 0 0 1px rgba(255,213,74,0.1), 0 0 30px rgba(255,213,74,0.35), 0 0 60px rgba(255,213,74,0.15), inset 0 1px 2px rgba(255,255,255,0.1)"
            : isHovered
              ? "0 0 0 1px rgba(255,213,74,0.06), 0 0 24px rgba(255,213,74,0.25), 0 0 48px rgba(255,213,74,0.1), inset 0 1px 1px rgba(255,255,255,0.06)"
              : isPast
                ? "0 0 0 1px rgba(255,213,74,0.04), 0 0 16px rgba(255,213,74,0.15), inset 0 1px 1px rgba(255,255,255,0.04)"
                : "0 0 0 1px rgba(255,255,255,0.03), 0 2px 12px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.04)",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Outer accent ring */}
        <div
          className="absolute -inset-2 rounded-full"
          style={{
            border: `1px solid ${isLit ? "rgba(255,213,74,0.12)" : "rgba(255,255,255,0.03)"}`,
            transition: "border-color 0.5s ease",
          }}
        />
        {/* Pulse ring on active */}
        {isActive && !reduce && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        )}

        <motion.div
          animate={{
            scale: isActive ? 1.1 : 1,
            rotate: isActive ? [0, -6, 6, 0] : 0,
          }}
          transition={{
            scale: { duration: 0.4 },
            rotate: { duration: 0.6, ease: "easeInOut" },
          }}
        >
          <Icon
            className={`size-6 transition-colors duration-500 sm:size-7 ${
              isActive
                ? "text-primary-foreground"
                : isLit
                  ? "text-primary"
                  : "text-muted-foreground"
            }`}
            aria-hidden="true"
            strokeWidth={1.8}
          />
        </motion.div>
      </motion.div>

      {/* Step number */}
      <motion.span
        className="font-mono text-[11px] font-bold tracking-widest mt-3"
        animate={{
          color: isActive
            ? "var(--primary)"
            : isPast
              ? "color-mix(in srgb, var(--primary) 60%, var(--foreground))"
              : "var(--muted-foreground)",
        }}
        transition={{ duration: 0.5 }}
      >
        {step.num}
      </motion.span>

      {/* Title */}
      <motion.p
        className="mt-1 text-sm font-bold sm:text-base"
        animate={{
          color: isLit ? "var(--foreground)" : "var(--muted-foreground)",
        }}
        transition={{ duration: 0.5 }}
      >
        {step.title}
      </motion.p>

      {/* Description — visible when active */}
      <AnimatePresence>
        {(isActive || isHovered) && (
          <motion.p
            className="mt-1.5 max-w-[140px] text-xs leading-relaxed text-muted-foreground sm:max-w-[160px]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.35 }}
          >
            {step.description}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Supporting text — visible on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.p
            className="mt-2 max-w-[170px] text-[11px] leading-relaxed text-primary/70 sm:max-w-[190px]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            {step.supportingText}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ──────────────── Desktop Horizontal ─────────────── */

function DesktopJourney({ activeStep, reduce }: { activeStep: number; reduce: boolean }) {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)

  /* Orb X position as percentage */
  const getOrbX = useCallback(() => {
    if (activeStep < 0) return 8
    return 8 + (activeStep / (steps.length - 1)) * 84
  }, [activeStep])

  return (
    <div className="relative w-full">
      {/* ── Connecting Line + Orb ── */}
      <div className="pointer-events-none absolute top-10 left-[8%] right-[8%] h-[2px] z-0 sm:top-12">
        {/* Base line */}
        <div
          className="h-full rounded-full"
          style={{
            background:
              "color-mix(in srgb, var(--border) 60%, var(--foreground) 10%)",
          }}
        />
        {/* Lit segments */}
        {steps.slice(0, -1).map((_, i) => {
          const segmentWidth = 100 / (steps.length - 1)
          const isLit = activeStep > i
          const isCurrent = activeStep === i
          return (
            <div
              key={i}
              className="absolute top-0 h-full transition-all"
              style={{
                left: `${i * segmentWidth}%`,
                width: isLit
                  ? `${segmentWidth}%`
                  : isCurrent
                    ? `${segmentWidth * 0.55}%`
                    : "0%",
                transitionDuration: "800ms",
                transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                background: isLit
                  ? "var(--primary)"
                  : isCurrent
                    ? "linear-gradient(90deg, var(--primary), rgba(255,213,74,0.3))"
                    : "transparent",
                boxShadow:
                  isLit || isCurrent
                    ? "0 0 12px rgba(255,213,74,0.4), 0 0 24px rgba(255,213,74,0.15)"
                    : "none",
              }}
            />
          )
        })}

        {/* Traveling orb */}
        {!reduce && activeStep >= 0 && activeStep < steps.length && (
          <motion.div
            className="absolute top-1/2 z-20"
            initial={false}
            animate={{
              left: `${getOrbX()}%`,
              x: "-50%",
              y: "-50%",
            }}
            transition={{
              type: "spring",
              stiffness: 50,
              damping: 18,
              mass: 1.2,
            }}
          >
            {/* Outer glow */}
            <div
              className="absolute -inset-4 rounded-full opacity-50"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,213,74,0.3) 0%, transparent 70%)",
              }}
            />
            {/* Core orb */}
            <div
              className="relative size-3 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, #FFD54A 0%, rgba(255,213,74,0.6) 60%, transparent 100%)",
                boxShadow:
                  "0 0 12px rgba(255,213,74,0.7), 0 0 24px rgba(255,213,74,0.3), 0 0 48px rgba(255,213,74,0.1)",
              }}
            />
            {/* Trail particles */}
            {!reduce &&
              [1, 2, 3].map((t) => (
                <motion.div
                  key={t}
                  className="absolute top-1/2 rounded-full"
                  style={{
                    width: 3 - t * 0.6,
                    height: 3 - t * 0.6,
                    background: `rgba(255,213,74,${0.4 - t * 0.1})`,
                    boxShadow: `0 0 ${6 - t * 1.5}px rgba(255,213,74,${0.3 - t * 0.08})`,
                  }}
                  animate={{
                    x: -8 * t - 4,
                    y: "-50%",
                    opacity: [0.5, 0.2, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: t * 0.12,
                    ease: "easeInOut",
                  }}
                />
              ))}
          </motion.div>
        )}
      </div>

      {/* ── Nodes ── */}
      <div className="relative z-10 flex items-start justify-between">
        {steps.map((step, i) => (
          <JourneyNode
            key={step.num}
            step={step}
            index={i}
            isActive={i === activeStep}
            isPast={i < activeStep}
            isHovered={hoveredNode === i}
            onHover={() => setHoveredNode(i)}
            onLeave={() => setHoveredNode(null)}
            reduce={reduce}
          />
        ))}
      </div>
    </div>
  )
}

/* ───────────────── Mobile Vertical ───────────────── */

function MobileJourney({ activeStep, reduce }: { activeStep: number; reduce: boolean }) {
  return (
    <div className="relative flex flex-col">
      {steps.map((step, i) => {
        const isActive = i === activeStep
        const isPast = i < activeStep
        const isLit = isActive || isPast
        const Icon = step.icon

        return (
          <div key={step.num} className="relative flex gap-5">
            {/* Vertical rail */}
            <div className="relative flex flex-col items-center">
              <motion.div
                className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full"
                animate={{
                  borderColor: isLit
                    ? "var(--primary)"
                    : "color-mix(in srgb, var(--border) 70%, var(--foreground) 10%)",
                  backgroundColor: isActive
                    ? "var(--primary)"
                    : isPast
                      ? "color-mix(in srgb, var(--primary) 15%, var(--card))"
                      : "var(--card)",
                  boxShadow: isActive
                    ? "0 0 0 1px rgba(255,213,74,0.1), 0 0 24px rgba(255,213,74,0.35), inset 0 1px 1px rgba(255,255,255,0.08)"
                    : isPast
                      ? "0 0 0 1px rgba(255,213,74,0.04), 0 0 12px rgba(255,213,74,0.12), inset 0 1px 1px rgba(255,255,255,0.04)"
                      : "0 0 0 1px rgba(255,255,255,0.03), 0 1px 8px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.04)",
                }}
                transition={{ duration: 0.5 }}
              >
                {isActive && !reduce && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1 }}
                  />
                )}
                <Icon
                  className={`size-4 transition-colors duration-500 ${
                    isActive
                      ? "text-primary-foreground"
                      : isLit
                        ? "text-primary"
                        : "text-muted-foreground"
                  }`}
                  aria-hidden="true"
                  strokeWidth={1.8}
                />
              </motion.div>
              {/* Connecting line */}
              {i < steps.length - 1 && (
                <div
                  className="w-px flex-1 min-h-[48px] transition-all"
                  style={{
                    transitionDuration: "700ms",
                    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                    background: isPast
                      ? "var(--primary)"
                      : isActive
                        ? "linear-gradient(to bottom, var(--primary) 50%, color-mix(in srgb, var(--border) 60%, transparent) 100%)"
                        : "color-mix(in srgb, var(--border) 60%, var(--foreground) 10%)",
                    boxShadow: isPast
                      ? "0 0 8px rgba(255,213,74,0.2)"
                      : "none",
                  }}
                />
              )}
            </div>

            {/* Content */}
            <motion.div
              className="flex-1 pb-7 pt-0.5"
              initial={reduce ? { opacity: 1 } : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: reduce ? 0 : i * 0.08, duration: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-[10px] font-bold tracking-widest"
                  style={{
                    color: isActive
                      ? "var(--primary)"
                      : isPast
                        ? "color-mix(in srgb, var(--primary) 60%, var(--foreground))"
                        : "var(--muted-foreground)",
                  }}
                >
                  {step.num}
                </span>
                <p
                  className="text-sm font-bold"
                  style={{
                    color: isLit ? "var(--foreground)" : "var(--muted-foreground)",
                  }}
                >
                  {step.title}
                </p>
              </div>
              <AnimatePresence>
                {(isActive || isPast) && (
                  <motion.p
                    className="mt-1 text-xs leading-relaxed text-muted-foreground"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}

/* ─────────────── Main Export Component ───────────── */

export default function HorizontalJourney() {
  const reduce = useReducedMotionValue()
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { amount: 0.25, once: false })
  const [activeStep, setActiveStep] = useState(-1)

  /* Auto-cycle when section is in view */
  useEffect(() => {
    if (reduce || !isInView) {
      setActiveStep(-1)
      return
    }

    let step = -1
    let mounted = true
    let timerId: ReturnType<typeof setTimeout>

    const tick = () => {
      if (!mounted) return
      step++
      if (step > steps.length) {
        step = -1
        setActiveStep(-1)
        timerId = setTimeout(tick, 1500)
      } else {
        setActiveStep(step)
        timerId = setTimeout(tick, 1200)
      }
    }

    timerId = setTimeout(tick, 400)
    return () => {
      mounted = false
      clearTimeout(timerId)
    }
  }, [reduce, isInView])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 sm:py-28 lg:py-36"
      aria-labelledby="journey-heading"
    >
      {/* ── Background ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Particles count={24} />
        <LightStreaks />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        {/* Radial fade */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 50%, transparent 40%, var(--background) 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <motion.div
          className="mb-14 text-center sm:mb-20 lg:mb-24"
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 font-mono text-xs text-muted-foreground backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            how it works
          </span>
          <h2
            id="journey-heading"
            className="display mt-5 text-3xl text-foreground sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Your event{" "}
            <span className="gradient-text">journey.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            From account creation to community — a seamless experience
            designed to feel effortless.
          </p>
        </motion.div>

        {/* ── Desktop: Horizontal Journey ── */}
        <div className="hidden lg:block">
          <DesktopJourney activeStep={activeStep} reduce={reduce} />
        </div>

        {/* ── Mobile: Vertical Journey ── */}
        <div className="lg:hidden">
          <MobileJourney activeStep={activeStep} reduce={reduce} />
        </div>
      </div>
    </section>
  )
}
