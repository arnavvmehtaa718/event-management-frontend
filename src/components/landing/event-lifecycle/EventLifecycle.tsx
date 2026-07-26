import { useEffect, useRef, useState, useMemo, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Ticket,
  QrCode,
  Award,
  Users,
  ClipboardCheck,
  type LucideIcon,
} from "lucide-react"
import { useTheme } from "@/hooks/useTheme"

// ─── Types ────────────────────────────────────────────────────────
interface NodeInfo {
  id: number
  name: string
  icon: LucideIcon
  description: string
  features: string[]
  color: string
  angle: number
}

interface Pt {
  x: number
  y: number
}

// ─── Constants ────────────────────────────────────────────────────
const SVG_W = 800
const SVG_H = 650
const CX = SVG_W / 2
const CY = SVG_H / 2
const ORBIT_R = 220
const CENTER_R = 40
const NODE_R = 24
const CURVE_OFFSET = 28

// ─── Keyframes (injected once, outside component) ─────────────────
const KEYFRAME_STYLES = `
@keyframes il-twinkle{0%,100%{opacity:.1}50%{opacity:.8}}
@keyframes il-float{0%,100%{transform:translate3d(0,0,0)}33%{transform:translate3d(8px,-20px,0)}66%{transform:translate3d(-5px,-6px,0)}}
@keyframes il-streak{0%,100%{opacity:0}50%{opacity:1}}
@keyframes il-breathe{0%,100%{opacity:.06;transform:translate(-50%,-50%) scale(1)}50%{opacity:.13;transform:translate(-50%,-50%) scale(1.1)}}
@keyframes il-ring-pulse{0%{transform:translate(-50%,-50%) scale(1);opacity:.2}100%{transform:translate(-50%,-50%) scale(2.8);opacity:0}}
@keyframes il-node-pulse{0%,100%{box-shadow:0 0 16px 6px rgba(255,213,74,0.08)}50%{box-shadow:0 0 28px 12px rgba(255,213,74,0.16)}}
@keyframes il-grid-drift{0%{background-position:0 0}100%{background-position:64px 64px}}
@keyframes il-burst-ring{0%{transform:translate(-50%,-50%) scale(1);opacity:1}100%{transform:translate(-50%,-50%) scale(2.8);opacity:0}}
@keyframes il-contained-ripple{0%{transform:translate(-50%,-50%) scale(0.15);opacity:0.9}100%{transform:translate(-50%,-50%) scale(1);opacity:0}}
`

// ─── SVG ticket path (shared, avoids re-creating per particle) ────
const TICKET_PATH_D =
  "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"
const TICKET_PATH_D2 = "M13 5v2"
const TICKET_PATH_D3 = "M13 17v2"
const TICKET_PATH_D4 = "M13 11v2"

// ─── Node data ────────────────────────────────────────────────────
const NODES: NodeInfo[] = [
  {
    id: 0,
    name: "Discover",
    icon: Search,
    description:
      "Find events that inspire you. Our intelligent discovery engine curates experiences tailored to your passions and goals.",
    features: [
      "AI-powered recommendations",
      "Personalized event feeds",
      "Smart category filtering",
    ],
    color: "var(--primary)",
    angle: -90,
  },
  {
    id: 1,
    name: "Register",
    icon: Ticket,
    description:
      "Seamless one-tap registration. Save your details once and use them across every event you attend.",
    features: ["One-tap registration", "Smart form pre-fill", "Team & group signup"],
    color: "var(--primary)",
    angle: -30,
  },
  {
    id: 2,
    name: "QR Check-In",
    icon: QrCode,
    description:
      "Instant QR code generation with offline support. Your ticket is always accessible, even without internet.",
    features: ["Offline QR codes", "Digital wallet pass", "Instant email delivery"],
    color: "var(--primary)",
    angle: 30,
  },
  {
    id: 3,
    name: "Certificate",
    icon: Award,
    description:
      "Auto-generated certificates. Share verified achievements across your network.",
    features: ["Auto-generated certs", "Blockchain verified", "LinkedIn-ready sharing"],
    color: "var(--primary)",
    angle: 90,
  },
  {
    id: 4,
    name: "Community",
    icon: Users,
    description:
      "Stay connected with fellow attendees. The conversation and connections continue long after the event ends.",
    features: ["Networking hub", "Discussion forums", "Event alumni community"],
    color: "var(--primary)",
    angle: 150,
  },
  {
    id: 5,
    name: "Organize",
    icon: ClipboardCheck,
    description:
      "Powerful tools to create, manage, and analyze your events. From setup to follow-up, everything you need in one place.",
    features: ["Event builder dashboard", "Real-time analytics", "Automated comms"],
    color: "var(--primary)",
    angle: 210,
  },
]

// ─── Geometry helpers ─────────────────────────────────────────────
function nodePos(angle: number): Pt {
  const rad = (angle * Math.PI) / 180
  return { x: CX + ORBIT_R * Math.cos(rad), y: CY + ORBIT_R * Math.sin(rad) }
}

function edgeToEdgePath(nodeAngle: number): string {
  const np = nodePos(nodeAngle)
  const dx = np.x - CX
  const dy = np.y - CY
  const dist = Math.sqrt(dx * dx + dy * dy)
  const ux = dx / dist
  const uy = dy / dist
  const pad = 6
  const from: Pt = { x: CX + ux * (CENTER_R + pad), y: CY + uy * (CENTER_R + pad) }
  const to: Pt = { x: np.x - ux * (NODE_R + pad), y: np.y - uy * (NODE_R + pad) }
  const mx = (from.x + to.x) / 2
  const my = (from.y + to.y) / 2
  const rad = (nodeAngle * Math.PI) / 180
  const px = Math.sin(rad)
  const py = -Math.cos(rad)
  return `M${from.x.toFixed(1)} ${from.y.toFixed(1)} Q${(mx + px * CURVE_OFFSET).toFixed(1)} ${(my + py * CURVE_OFFSET).toFixed(1)} ${to.x.toFixed(1)} ${to.y.toFixed(1)}`
}

// ─── Starfield ────────────────────────────────────────────────────
const Starfield = memo(function Starfield() {
  const dots = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        r: Math.random() * 1.4 + 0.3,
        delay: Math.random() * 6,
        dur: Math.random() * 3 + 2,
      })),
    [],
  )
  return (
    <>
      {dots.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white will-change-opacity"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.r,
            height: s.r,
            opacity: 0.6,
            animation: `il-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </>
  )
})

// ─── Floating motes ───────────────────────────────────────────────
const FloatingMotes = memo(function FloatingMotes({ isDark }: { isDark: boolean }) {
  const dots = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        r: Math.random() * 2.5 + 0.5,
        delay: Math.random() * 12,
        dur: Math.random() * 18 + 14,
      })),
    [],
  )
  return (
    <>
      {dots.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full will-change-transform"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.r,
            height: p.r,
            background: isDark ? "rgba(255,213,74,0.2)" : "rgba(197,138,0,0.08)",
            animation: `il-float ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </>
  )
})

// ─── Light streaks ────────────────────────────────────────────────
const LightStreaks = memo(function LightStreaks({ isDark }: { isDark: boolean }) {
  const streaks = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        angle: Math.random() * 360,
        length: Math.random() * 140 + 60,
        delay: Math.random() * 20,
        dur: Math.random() * 12 + 10,
      })),
    [],
  )
  return (
    <>
      {streaks.map((s) => (
        <div
          key={s.id}
          className="absolute will-change-opacity"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.length,
            height: 1,
            background: isDark
              ? "linear-gradient(90deg, transparent, rgba(255,213,74,0.06), transparent)"
              : "linear-gradient(90deg, transparent, rgba(197,138,0,0.04), transparent)",
            transform: `rotate(${s.angle}deg)`,
            animation: `il-streak ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </>
  )
})

// ─── Main component ───────────────────────────────────────────────
export default function EventLifecycle() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const sectionRef = useRef<HTMLElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRefs = useRef<(SVGPathElement | null)[]>([])
  const glowPathRefs = useRef<(SVGPathElement | null)[]>([])
  const ticketRefs = useRef<(HTMLDivElement | null)[]>([])

  const [hovered, setHovered] = useState<number | null>(null)
  const hoveredRef = useRef<number | null>(null)
  const [burstNodes, setBurstNodes] = useState<Set<number>>(new Set())
  const burstNodesRef = useRef<Set<number>>(new Set())

  const nPos = useMemo(() => NODES.map((n) => nodePos(n.angle)), [])
  const paths = useMemo(
    () => NODES.map((n) => edgeToEdgePath(n.angle)),
    [],
  )

  useEffect(() => {
    hoveredRef.current = hovered
  }, [hovered])

  // ── Multi-ticket animation loop (one per path) ──
  useEffect(() => {
    let animId = 0
    let visible = true
    let lastTime = 0
    let started = false

    const COUNT = NODES.length
    const lengths = new Float64Array(COUNT)
    const TRAVEL_MS = 3200
    const RETURN_MS = 2200
    const STAGGER_MS = 500

    interface Ticket {
      progress: number
      delay: number
      elapsed: number
      phase: "waiting" | "traveling" | "returning"
      burstTime: number
    }
    const tickets: Ticket[] = Array.from({ length: COUNT }, (_, i) => ({
      progress: 0,
      delay: i * STAGGER_MS,
      elapsed: 0,
      phase: "waiting",
      burstTime: 0,
    }))

    function easeOutCubic(t: number) {
      return 1 - Math.pow(1 - t, 3)
    }
    function easeInCubic(t: number) {
      return t * t * t
    }
    function smoothStep(t: number) {
      return t * t * (3 - 2 * t)
    }

    function tick(now: number) {
      if (!started) {
        started = true
        lastTime = now
        for (let i = 0; i < COUNT; i++) {
          const path = pathRefs.current[i]
          if (path) lengths[i] = path.getTotalLength()
        }
      }

      if (!visible) {
        lastTime = now
        animId = requestAnimationFrame(tick)
        return
      }

      const dt = now - lastTime
      lastTime = now

      const newBursts: number[] = []

      for (let i = 0; i < COUNT; i++) {
        const t = tickets[i]
        const el = ticketRefs.current[i]
        const path = pathRefs.current[i]
        const glow = glowPathRefs.current[i]
        if (!el || !path || lengths[i] === 0) continue

        t.elapsed += dt

        if (t.phase === "waiting") {
          if (t.elapsed >= t.delay) {
            t.phase = "traveling"
            t.progress = 0
            t.elapsed = 0
          }
          el.style.opacity = "0"
          if (glow) glow.style.opacity = "0"
          continue
        }

        if (t.phase === "traveling") {
          t.progress += dt / TRAVEL_MS
          if (t.progress >= 1) {
            t.progress = 1
            t.phase = "returning"
            t.elapsed = 0
            t.burstTime = 0
            newBursts.push(i)
          }

          const easedProgress = easeOutCubic(Math.min(t.progress, 1))
          const pt = path.getPointAtLength(easedProgress * lengths[i])
          el.style.transform = `translate3d(${(pt.x - 8).toFixed(1)}px,${(pt.y - 8).toFixed(1)}px,0)`

          const travelMs = t.progress * TRAVEL_MS
          let opacity = 1
          if (travelMs < 400) {
            opacity = smoothStep(travelMs / 400)
          } else if (travelMs > TRAVEL_MS - 400) {
            opacity = smoothStep((TRAVEL_MS - travelMs) / 400)
          }
          el.style.opacity = String(Math.max(0, Math.min(1, opacity)))
          if (glow) glow.style.opacity = "1"
          continue
        }

        if (t.phase === "returning") {
          t.progress -= dt / RETURN_MS
          t.burstTime += dt

          if (t.progress <= 0) {
            t.progress = 0
            t.phase = "traveling"
            t.elapsed = 0
            t.burstTime = 0
          }

          const easedProgress = easeInCubic(Math.max(t.progress, 0))
          const pt = path.getPointAtLength(easedProgress * lengths[i])
          el.style.transform = `translate3d(${(pt.x - 8).toFixed(1)}px,${(pt.y - 8).toFixed(1)}px,0)`

          const returnProgress = 1 - t.progress
          let opacity = 1
          if (returnProgress < 0.15) {
            opacity = smoothStep(returnProgress / 0.15)
          } else if (returnProgress > 0.7) {
            opacity = smoothStep((1 - returnProgress) / 0.3)
          }
          el.style.opacity = String(Math.max(0, Math.min(1, opacity)))
          if (glow) glow.style.opacity = "1"
        }
      }

      if (newBursts.length > 0) {
        burstNodesRef.current = new Set([
          ...burstNodesRef.current,
          ...newBursts,
        ])
        setBurstNodes(new Set(burstNodesRef.current))
        setTimeout(() => {
          for (const idx of newBursts) {
            burstNodesRef.current.delete(idx)
          }
          setBurstNodes(new Set(burstNodesRef.current))
        }, 700)
      }

      animId = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { threshold: 0 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)

    animId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animId)
      observer.disconnect()
    }
  }, [])

  const onEnter = useCallback((id: number) => setHovered(id), [])
  const onEnterCenter = useCallback(() => setHovered(-1), [])
  const onLeave = useCallback(() => setHovered(null), [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ background: "var(--lc-bg)" }}
    >
      {/* ── Keyframes (static, injected once by React) ── */}
      <style dangerouslySetInnerHTML={{ __html: KEYFRAME_STYLES }} />

      {/* ── Background layers ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Radial glow */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 900,
            height: 700,
            background:
              isDark
                ? "radial-gradient(ellipse at center, rgba(255,213,74,0.06) 0%, transparent 70%)"
                : "radial-gradient(ellipse at center, rgba(197,138,0,0.04) 0%, transparent 70%)",
          }}
        />

        {/* Animated grid */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            opacity: isDark ? 0.028 : 0.04,
            backgroundImage:
              "linear-gradient(var(--lc-grid) 1px,transparent 1px),linear-gradient(90deg,var(--lc-grid) 1px,transparent 1px)",
            backgroundSize: "64px 64px",
            animation: "il-grid-drift 40s linear infinite",
          }}
        />

        {/* Concentric circles */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {[80, 140, 220, 310, 400].map((r, i) => (
            <circle
              key={i}
              cx={CX}
              cy={CY}
              r={r}
              fill="none"
              stroke="var(--lc-ring)"
              strokeWidth="0.5"
              strokeDasharray="3 9"
            />
          ))}
        </svg>

        {isDark && <Starfield />}
        {isDark && <FloatingMotes isDark={isDark} />}
        {isDark && <LightStreaks isDark={isDark} />}
      </div>

      {/* ── Vignette ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            isDark
              ? "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 25%, rgba(5,5,5,0.75) 100%)"
              : "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 25%, rgba(246,245,242,0.85) 100%)",
        }}
      />

      {/* ── Header ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-20 pb-4 text-center md:px-6">
        <motion.p
          className="font-mono text-[11px] font-semibold tracking-[0.18em] uppercase"
          style={{ color: "var(--lc-subtitle)" }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          / the event lifecycle
        </motion.p>
        <motion.h2
          className="mt-5 text-3xl font-black uppercase tracking-tight md:text-5xl lg:text-6xl"
          style={{ fontFamily: "'Archivo', sans-serif", lineHeight: 0.95, color: "var(--lc-heading)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          Every connection.{" "}
          <span
            style={
              isDark
                ? {
                    background: "linear-gradient(135deg, #FFD54A, #FFECB3)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }
                : { color: "#B5860A" }
            }
          >
            One platform.
          </span>
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-xl text-sm leading-relaxed md:text-base"
          style={{ color: "var(--lc-body)" }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.16 }}
        >
          From discovery to community — a living network where every connection
          links back to the center.
        </motion.p>
      </div>

      {/* ── Visualization ── */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-24 md:px-6">
        <div
          className="relative mx-auto"
          style={{ maxWidth: 800, aspectRatio: `${SVG_W} / ${SVG_H}` }}
        >
          {/* ── SVG layer ── */}
          <svg
            ref={svgRef}
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter
                id="il-glow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Base paths */}
            {paths.map((d, i) => (
              <path
                key={`base-${i}`}
                ref={(el) => {
                  pathRefs.current[i] = el
                }}
                d={d}
                fill="none"
                stroke="var(--lc-path)"
                strokeWidth={isDark ? "1.5" : "1.8"}
                strokeLinecap="round"
              />
            ))}

            {/* Active path glow — visible only on the active connection */}
            {paths.map((d, i) => (
              <path
                key={`glow-${i}`}
                ref={(el) => {
                  glowPathRefs.current[i] = el
                }}
                d={d}
                fill="none"
                stroke="var(--lc-glow-stroke)"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ filter: "blur(2px)", opacity: 0, transition: "opacity 0.6s ease" }}
              />
            ))}

            {/* Animated tickets — one per path */}
            {paths.map((_, i) => (
              <foreignObject
                key={`ticket-${i}`}
                width={SVG_W}
                height={SVG_H}
                x={0}
                y={0}
                style={{ overflow: "visible", pointerEvents: "none" }}
              >
                <div
                  ref={(el) => { ticketRefs.current[i] = el }}
                  className="will-change-transform"
                  style={{
                    width: 16,
                    height: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    filter: isDark
                      ? "drop-shadow(0 0 6px rgba(255,213,74,0.8)) drop-shadow(0 0 12px rgba(255,213,74,0.4))"
                      : "drop-shadow(0 0 4px rgba(197,138,0,0.6)) drop-shadow(0 0 8px rgba(197,138,0,0.2))",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isDark ? "var(--primary)" : "#C58A00"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={TICKET_PATH_D} />
                    <path d={TICKET_PATH_D2} />
                    <path d={TICKET_PATH_D3} />
                    <path d={TICKET_PATH_D4} />
                  </svg>
                </div>
              </foreignObject>
            ))}

            {/* Center glow ring — premium double ring */}
            <circle
              cx={CX}
              cy={CY}
              r={CENTER_R + 14}
              fill="none"
              stroke={isDark ? "rgba(255,213,74,0.06)" : "rgba(197,138,0,0.08)"}
              strokeWidth="0.5"
            />
            <circle
              cx={CX}
              cy={CY}
              r={CENTER_R + 10}
              fill="none"
              stroke={isDark ? "rgba(255,213,74,0.1)" : "rgba(197,138,0,0.12)"}
              strokeWidth="0.8"
              strokeDasharray="3 6"
              opacity={0.7}
            />

            {/* Node outer rings — premium double-ring */}
            {nPos.map((p, i) => (
              <g key={`ring-${i}`}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={NODE_R + 10}
                  fill="none"
                  stroke={isDark ? "rgba(255,213,74,0.06)" : "rgba(197,138,0,0.07)"}
                  strokeWidth="0.5"
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={NODE_R + 6}
                  fill="none"
                  stroke={isDark ? "rgba(255,213,74,0.15)" : "rgba(197,138,0,0.10)"}
                  strokeWidth="0.8"
                  strokeDasharray="2 4"
                />
              </g>
            ))}
          </svg>

          {/* ── Central EventHub node ── */}
          <div
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${(CX / SVG_W) * 100}%`,
              top: `${(CY / SVG_H) * 100}%`,
            }}
            onMouseEnter={onEnterCenter}
            onMouseLeave={onLeave}
            role="button"
            tabIndex={0}
            aria-label="EventHub center"
            onFocus={onEnterCenter}
            onBlur={onLeave}
          >
            {/* Breathing radial glow */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
              style={{
                width: CENTER_R * 5,
                height: CENTER_R * 5,
                background: isDark
                  ? "radial-gradient(circle, rgba(255,213,74,0.09) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(197,138,0,0.04) 0%, transparent 70%)",
                opacity: isDark ? 1 : 0.5,
                animation: "il-breathe 5s ease-in-out infinite",
              }}
            />

            {/* Pulse rings on hover */}
            <AnimatePresence>
              {hovered === -1 && (
                <>
                  <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
                    style={{
                      width: CENTER_R * 2.4,
                      height: CENTER_R * 2.4,
                      border: `1px solid ${isDark ? "rgba(255,213,74,0.15)" : "rgba(197,138,0,0.12)"}`,
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className="absolute inset-0 rounded-full will-change-transform"
                      style={{
                      border: `1px solid ${isDark ? "rgba(255,213,74,0.15)" : "rgba(197,138,0,0.12)"}`,
                        animation: "il-ring-pulse 2.2s ease-out infinite",
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full will-change-opacity"
                    style={{
                      width: CENTER_R * 2.4,
                      height: CENTER_R * 2.4,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div
                      className="absolute inset-0 rounded-full will-change-transform"
                      style={{
                        border: `1px solid ${isDark ? "rgba(255,213,74,0.1)" : "rgba(197,138,0,0.08)"}`,
                        animation:
                          "il-ring-pulse 2.2s ease-out 0.7s infinite",
                      }}
                    />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Main center node */}
            <motion.div
              className="relative flex items-center justify-center rounded-full will-change-transform"
              style={{
                width: CENTER_R * 2,
                height: CENTER_R * 2,
                background: isDark ? "var(--lc-center-bg)" : "#ffffff",
                border: `2px solid ${
                  hovered === -1
                    ? isDark ? "rgba(255,213,74,0.5)" : "#C58A00"
                    : isDark ? "rgba(255,213,74,0.25)" : "#D49A00"
                }`,
                boxShadow: isDark ? `
                  0 0 0 1px rgba(255,213,74,0.08),
                  0 0 24px rgba(255,213,74,${hovered === -1 ? "0.2" : "0.08"}),
                  0 0 48px rgba(255,213,74,${hovered === -1 ? "0.1" : "0.03"}),
                  inset 0 1px 2px rgba(255,255,255,0.08),
                  inset 0 -1px 3px rgba(0,0,0,0.4)
                ` : `
                  0 1px 3px rgba(0,0,0,0.06),
                  0 4px 12px rgba(0,0,0,0.04),
                  ${hovered === -1 ? "0 0 0 3px rgba(197,138,0,0.12)," : ""}
                  inset 0 1px 2px rgba(255,255,255,0.8),
                  inset 0 -1px 2px rgba(0,0,0,0.03)
                `,
                transition:
                  "background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
              }}
              animate={{ scale: hovered === -1 ? 1.12 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="select-none text-center leading-none">
                <span
                  className="block font-mono text-[11px] font-bold tracking-[0.15em] uppercase"
                  style={{ color: "var(--primary)" }}
                >
                  Event
                </span>
                <span
                  className="block font-mono text-[9px] font-semibold tracking-[0.2em] uppercase"
                  style={{ color: isDark ? "rgba(255,213,74,0.55)" : "rgba(197,138,0,0.65)" }}
                >
                  Hub
                </span>
              </div>
            </motion.div>
          </div>

          {/* ── Outer nodes ── */}
          {NODES.map((n, i) => {
            const Icon = n.icon
            const isHov = hovered === i
            const isBurst = burstNodes.has(i)
            const lx = (nPos[i].x / SVG_W) * 100
            const ly = (nPos[i].y / SVG_H) * 100

            return (
              <motion.div
                key={n.id}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: `${lx}%`, top: `${ly}%` }}
                onMouseEnter={() => onEnter(n.id)}
                onMouseLeave={onLeave}
                role="button"
                tabIndex={0}
                aria-label={n.name}
                onFocus={() => onEnter(n.id)}
                onBlur={onLeave}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.3 + i * 0.07,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                {/* Contained ripple — stays inside the node circle */}
                {isBurst && (
                  <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{
                      width: NODE_R * 2,
                      height: NODE_R * 2,
                      borderRadius: "50%",
                      overflow: "hidden",
                    }}
                  >
                    {/* Ripple ring 1 */}
                    <div
                      className="absolute left-1/2 top-1/2 will-change-transform"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        border: `2px solid ${isDark ? "rgba(255,213,74,0.7)" : "rgba(197,138,0,0.6)"}`,
                        animation: "il-contained-ripple 0.65s ease-out forwards",
                      }}
                    />
                    {/* Ripple ring 2 — staggered */}
                    <div
                      className="absolute left-1/2 top-1/2 will-change-transform"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        border: `1.5px solid ${isDark ? "rgba(255,213,74,0.4)" : "rgba(197,138,0,0.35)"}`,
                        animation: "il-contained-ripple 0.65s ease-out 0.12s forwards",
                      }}
                    />
                    {/* Inner radial flash */}
                    <div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{
                        width: "70%",
                        height: "70%",
                        background: isDark
                          ? "radial-gradient(circle, rgba(255,213,74,0.25) 0%, transparent 70%)"
                          : "radial-gradient(circle, rgba(197,138,0,0.15) 0%, transparent 70%)",
                        animation: "il-contained-ripple 0.5s ease-out forwards",
                      }}
                    />
                  </div>
                )}

                {/* Glow backdrop */}
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
                  style={{
                    width: NODE_R * 5.5,
                    height: NODE_R * 5.5,
                    background: isDark
                      ? "radial-gradient(circle, rgba(255,213,74,0.12) 0%, rgba(255,213,74,0.04) 40%, transparent 70%)"
                      : "radial-gradient(circle, rgba(197,138,0,0.03) 0%, rgba(197,138,0,0.01) 40%, transparent 70%)",
                    opacity: isDark ? 1 : (isHov ? 0.8 : 0.4),
                  }}
                  animate={{ scale: isHov ? 1.2 : isBurst ? 1.4 : 1 }}
                  transition={{ duration: isBurst ? 0.3 : 0.4 }}
                />

                {/* Outer accent ring */}
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform will-change-opacity"
                  style={{
                    width: NODE_R * 2 + 18,
                    height: NODE_R * 2 + 18,
                    border: `1px solid ${isDark ? "rgba(255,213,74,0.08)" : "rgba(197,138,0,0.10)"}`,
                    background: "transparent",
                  }}
                  animate={{ scale: isHov ? 1.12 : 1, opacity: isHov ? 1 : isDark ? 0.5 : 0.6 }}
                  transition={{ duration: 0.35 }}
                />

                {/* Node circle — solid bg instead of backdropFilter */}
                <motion.div
                  className="relative flex items-center justify-center rounded-full will-change-transform"
                  style={{
                    width: NODE_R * 2,
                    height: NODE_R * 2,
                    background: isDark ? "var(--lc-node-bg)" : "#ffffff",
                    border: `1.5px solid ${isDark ? `rgba(255,213,74,${isHov ? "0.6" : isBurst ? "0.7" : "0.4"})` : `#D1D5DB`}`,
                    boxShadow: isDark ? `
                      0 0 0 1px rgba(255,213,74,0.06),
                      0 0 20px rgba(255,213,74,${isHov ? "0.2" : isBurst ? "0.3" : "0.12"}),
                      0 0 40px rgba(255,213,74,${isHov ? "0.1" : isBurst ? "0.15" : "0.04"}),
                      inset 0 1px 1px rgba(255,255,255,0.06),
                      inset 0 -1px 2px rgba(0,0,0,0.3)
                    ` : isHov ? `
                      0 1px 3px rgba(0,0,0,0.06),
                      0 4px 12px rgba(0,0,0,0.04),
                      0 0 0 2px rgba(197,138,0,0.12),
                      inset 0 1px 2px rgba(255,255,255,0.8)
                    ` : `
                      0 1px 2px rgba(0,0,0,0.04),
                      inset 0 1px 2px rgba(255,255,255,0.8),
                      inset 0 -1px 1px rgba(0,0,0,0.02)
                    `,
                    animation: isDark ? "il-node-pulse 1.8s ease-in-out infinite" : "none",
                    transition:
                      "background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",
                  }}
                  animate={{ scale: isHov ? 1.3 : isBurst ? 1.25 : 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 320,
                    damping: 22,
                  }}
                >
                  <motion.div
                    animate={
                      isHov ? { rotate: [0, -8, 8, -4, 0] } : { rotate: 0 }
                    }
                    transition={{ duration: 0.5 }}
                  >
                    <Icon
                      size={17}
                      style={{ color: isDark ? "var(--primary)" : "#C58A00" }}
                    />
                  </motion.div>
                </motion.div>

                {/* Label */}
                <motion.span
                  className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] font-semibold tracking-[0.18em] uppercase will-change-opacity"
                  style={{
                    top: NODE_R * 2 + 10,
                    color: isDark ? "var(--primary)" : "#2B2B2B",
                  }}
                  animate={{ opacity: isDark ? 0.7 : 1 }}
                  transition={{ duration: 0.25 }}
                >
                  {n.name}
                </motion.span>
              </motion.div>
            )
          })}

          {/* ── Hover info card ── */}
          <AnimatePresence>
            {hovered !== null && hovered >= 0 && (() => {
              const n = NODES[hovered]
              const Icon = n.icon
              const lx = (nPos[hovered].x / SVG_W) * 100
              const ly = (nPos[hovered].y / SVG_H) * 100
              const aRad = (n.angle * Math.PI) / 180
              const offX = Math.cos(aRad) * 72
              const offY = Math.sin(aRad) * 72

              return (
                <motion.div
                  key="card"
                  className="absolute z-30 pointer-events-none will-change-transform will-change-opacity"
                  style={{
                    left: `calc(${lx}% + ${offX}px)`,
                    top: `calc(${ly}% + ${offY}px)`,
                    transform: "translate(-50%, -50%)",
                  }}
                  initial={{ opacity: 0, scale: 0.94, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 6 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <div
                    className="w-[280px] rounded-2xl p-5 md:w-[310px] md:p-6"
                    style={{
                      background: "var(--lc-card-bg)",
                      border: "1px solid var(--lc-card-border)",
                      boxShadow: "var(--lc-card-shadow)",
                    }}
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{
                          background: "var(--lc-icon-bg)",
                          border: "1px solid var(--lc-icon-border)",
                        }}
                      >
                        <Icon size={17} style={{ color: n.color }} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold leading-tight" style={{ color: "var(--lc-card-heading)" }}>
                          {n.name}
                        </h3>
                        <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: "var(--lc-card-step)" }}>
                          Step {n.id + 1} of 6
                        </p>
                      </div>
                    </div>
                    <p className="mb-3 text-[13px] leading-relaxed" style={{ color: "var(--lc-card-desc)" }}>
                      {n.description}
                    </p>
                    <div className="space-y-1.5">
                      {n.features.map((f, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <div
                            className="h-[3px] w-[3px] rounded-full"
                            style={{ background: n.color }}
                          />
                          <span className="text-[11px]" style={{ color: "var(--lc-card-feature)" }}>
                            {f}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })()}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
