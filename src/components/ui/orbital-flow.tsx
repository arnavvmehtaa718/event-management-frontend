"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { useReducedMotion } from "framer-motion"
import {
  Search,
  Ticket,
  QrCode,
  Award,
  BellRing,
  BarChart3,
  type LucideIcon,
} from "lucide-react"

interface PlanetData {
  id: number
  title: string
  icon: LucideIcon
  baseAngle: number
  orbitRadius: number
  size: number
  speed: number
  amplitude: number
}

const planetDefs: PlanetData[] = [
  { id: 1, title: "Discover", icon: Search, baseAngle: 0, orbitRadius: 0.34, size: 48, speed: 0.6, amplitude: 20 },
  { id: 2, title: "Register", icon: Ticket, baseAngle: 60, orbitRadius: 0.38, size: 44, speed: 0.5, amplitude: 18 },
  { id: 3, title: "Check-In", icon: QrCode, baseAngle: 120, orbitRadius: 0.32, size: 46, speed: 0.65, amplitude: 22 },
  { id: 4, title: "Certs", icon: Award, baseAngle: 180, orbitRadius: 0.36, size: 42, speed: 0.55, amplitude: 16 },
  { id: 5, title: "Updates", icon: BellRing, baseAngle: 240, orbitRadius: 0.33, size: 44, speed: 0.62, amplitude: 19 },
  { id: 6, title: "Insights", icon: BarChart3, baseAngle: 300, orbitRadius: 0.37, size: 46, speed: 0.52, amplitude: 21 },
]

export default function OrbitalFlow() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [time, setTime] = useState(0)
  const reduce = useReducedMotion()
  const rafRef = useRef<number>(0)
  const startRef = useRef<number>(0)
  const [dims, setDims] = useState({ w: 900, h: 520 })

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return
      const r = containerRef.current.getBoundingClientRect()
      setDims({ w: r.width, h: Math.min(r.width * 0.55, 520) })
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  useEffect(() => {
    if (reduce) return
    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now
      setTime((now - startRef.current) / 1000)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [reduce])

  const cx = dims.w / 2
  const cy = dims.h / 2

  const planetPositions = useMemo(() => {
    return planetDefs.map((p) => {
      const osc = Math.sin(time * p.speed * 0.6 + p.baseAngle * (Math.PI / 180)) * p.amplitude
      const angle = ((p.baseAngle + osc) * Math.PI) / 180
      const rx = dims.w * p.orbitRadius
      const ry = dims.h * p.orbitRadius * 0.55
      const x = cx + rx * Math.cos(angle)
      const y = cy + ry * Math.sin(angle)
      const depth = Math.sin(angle)
      return { ...p, x, y, depth, angle }
    })
  }, [time, dims, cx, cy])

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none"
      style={{ height: dims.h, pointerEvents: "none" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: cx - 200,
          top: cy - 200,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(204,163,0,0.1) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Orbit ring (ellipse) */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={dims.w}
        height={dims.h}
        style={{ overflow: "visible" }}
      >
        <ellipse
          cx={cx}
          cy={cy}
          rx={dims.w * 0.35}
          ry={dims.h * 0.2}
          fill="none"
          stroke="#CCA300"
          strokeWidth={1}
          strokeOpacity={0.08}
          strokeDasharray="6 10"
        />

        {/* Connector lines */}
        {planetPositions.map((p) => (
          <line
            key={`connector-${p.id}`}
            x1={p.x}
            y1={p.y}
            x2={cx}
            y2={cy}
            stroke="#CCA300"
            strokeWidth={1}
            strokeOpacity={0.06}
          />
        ))}
      </svg>

      {/* Single ticket per connection — travels from planet toward center */}
      {!reduce &&
        planetPositions.map((p) => {
          const travelDuration = 12
          const pauseDuration = 1.5
          const cycleDuration = travelDuration + pauseDuration
          const staggerOffset = p.id * 2.2
          const rawT = ((time - staggerOffset) % cycleDuration + cycleDuration) % cycleDuration
          const travelT = Math.min(rawT / travelDuration, 1)

          const dotX = p.x + (cx - p.x) * travelT
          const dotY = p.y + (cy - p.y) * travelT

          const fadeIn = Math.min(travelT / 0.08, 1)
          const fadeOut = Math.max(1 - (travelT - 0.88) / 0.12, 0)
          const opacity = fadeIn * fadeOut

          const pulseScale = 0.8 + Math.sin(travelT * Math.PI * 6) * 0.15

          return (
            <div
              key={`ticket-${p.id}`}
              className="absolute pointer-events-none"
              style={{
                left: dotX,
                top: dotY,
                transform: "translate(-50%, -50%)",
                opacity: Math.max(opacity, 0),
              }}
            >
              {/* Outer glow */}
              <div
                className="absolute rounded-full"
                style={{
                  inset: -8,
                  background: "radial-gradient(circle, rgba(204,163,0,0.5) 0%, rgba(204,163,0,0.15) 40%, transparent 70%)",
                  filter: "blur(6px)",
                  transform: `scale(${pulseScale})`,
                }}
              />
              {/* Core dot */}
              <div
                className="relative rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  background: "radial-gradient(circle, #FFD54A 0%, #CCA300 60%, rgba(204,163,0,0.6) 100%)",
                  boxShadow: "0 0 10px rgba(204,163,0,0.8), 0 0 20px rgba(204,163,0,0.4), 0 0 40px rgba(204,163,0,0.15)",
                }}
              />
            </div>
          )
        })}

      {/* Sort planets by depth for proper z-ordering */}
      {[...planetPositions]
        .sort((a, b) => a.depth - b.depth)
        .map((p) => {
          const Icon = p.icon
          const depthScale = 0.85 + 0.15 * ((p.depth + 1) / 2)
          const depthOpacity = 0.6 + 0.4 * ((p.depth + 1) / 2)
          const planetSize = p.size * depthScale
          const glowIntensity = 0.3 + 0.3 * ((p.depth + 1) / 2)

          return (
            <div
              key={p.id}
              className="absolute flex flex-col items-center pointer-events-none"
              style={{
                left: p.x - planetSize / 2,
                top: p.y - planetSize / 2,
                width: planetSize,
                zIndex: Math.round(p.depth * 50 + 50),
                opacity: depthOpacity,
              }}
            >
              {/* Outer glow */}
              <div
                className="absolute rounded-full"
                style={{
                  inset: -14,
                  background: `radial-gradient(circle, rgba(204,163,0,${glowIntensity * 0.3}) 0%, rgba(204,163,0,${glowIntensity * 0.08}) 50%, transparent 70%)`,
                  filter: "blur(10px)",
                }}
              />
              {/* Outer accent ring */}
              <div
                className="absolute rounded-full"
                style={{
                  inset: -8,
                  border: `1px solid rgba(204,163,0,${glowIntensity * 0.15})`,
                }}
              />
              {/* Pulse ring */}
              <div
                className="absolute rounded-full"
                style={{
                  inset: -4,
                  border: `1px solid rgba(204,163,0,${glowIntensity * 0.25})`,
                  animation: `planetRingPulse 3.5s ease-in-out ${p.id * 0.5}s infinite`,
                }}
              />
              {/* Planet body — premium layered */}
              <div
                className="relative rounded-full flex items-center justify-center"
                style={{
                  width: planetSize,
                  height: planetSize,
                  background:
                    "radial-gradient(circle at 35% 30%, rgba(204,163,0,0.15) 0%, #1a1a14 45%, #0a0a09 100%)",
                  border: "2px solid rgba(204,163,0,0.6)",
                  boxShadow: `
                    0 0 0 1px rgba(204,163,0,0.08),
                    0 0 ${14 * glowIntensity}px rgba(204,163,0,${glowIntensity * 0.5}),
                    0 0 ${28 * glowIntensity}px rgba(204,163,0,${glowIntensity * 0.25}),
                    inset 0 1px 2px rgba(255,255,255,0.08),
                    inset 0 -1px 3px rgba(0,0,0,0.4)
                  `,
                }}
              >
                <Icon
                  size={planetSize * 0.38}
                  strokeWidth={2}
                  style={{ color: "#CCA300" }}
                />
              </div>
              {/* Label */}
              <span
                className="mt-2 font-mono text-[10px] font-semibold tracking-widest uppercase whitespace-nowrap"
                style={{
                  color: "#CCA300",
                  opacity: 0.8,
                  textShadow: "0 0 8px rgba(204,163,0,0.3)",
                }}
              >
                {p.title}
              </span>
            </div>
          )
        })}

      {/* ── Central Planet ── */}
      <div
        className="absolute flex flex-col items-center pointer-events-none"
        style={{
          left: cx - 50,
          top: cy - 50,
          width: 100,
          zIndex: 40,
        }}
      >
        {/* Big outer glow */}
        <div
          className="absolute rounded-full"
          style={{
            inset: -35,
            background:
              "radial-gradient(circle, rgba(204,163,0,0.18) 0%, rgba(204,163,0,0.05) 50%, transparent 70%)",
            filter: "blur(24px)",
          }}
        />
        {/* Outer accent ring */}
        <div
          className="absolute rounded-full"
          style={{
            inset: -18,
            border: "1px solid rgba(204,163,0,0.1)",
          }}
        />
        {/* Pulse rings */}
        <div
          className="absolute rounded-full"
          style={{
            inset: -12,
            border: "1px solid rgba(204,163,0,0.15)",
            animation: "planetRingPulse 4.5s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            inset: -24,
            border: "1px solid rgba(204,163,0,0.06)",
            animation: "planetRingPulse 4.5s ease-in-out 1.2s infinite",
          }}
        />
        {/* Planet body — premium */}
        <div
          className="relative rounded-full flex items-center justify-center"
          style={{
            width: 100,
            height: 100,
            background:
              "radial-gradient(circle at 35% 30%, rgba(204,163,0,0.2) 0%, #1c1a10 40%, #0a0a09 100%)",
            border: "3px solid rgba(204,163,0,0.8)",
            boxShadow: `
              0 0 0 1px rgba(204,163,0,0.1),
              0 0 22px rgba(204,163,0,0.5),
              0 0 44px rgba(204,163,0,0.25),
              0 0 66px rgba(204,163,0,0.1),
              inset 0 2px 3px rgba(255,255,255,0.1),
              inset 0 -2px 4px rgba(0,0,0,0.4)
            `,
          }}
        >
          {/* EH logo text */}
          <span
            className="font-extrabold"
            style={{
              fontSize: 28,
              color: "#CCA300",
              fontFamily: "Archivo, sans-serif",
              letterSpacing: -1,
              textShadow: "0 0 12px rgba(204,163,0,0.5)",
            }}
          >
            EH
          </span>
        </div>
        {/* Label */}
        <span
          className="mt-3 font-bold tracking-[0.15em] uppercase"
          style={{
            fontSize: 12,
            color: "#CCA300",
            fontFamily: "Archivo, sans-serif",
            textShadow: "0 0 10px rgba(204,163,0,0.3)",
          }}
        >
          EventHub
        </span>
      </div>

      <style>{`
        @keyframes planetRingPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
