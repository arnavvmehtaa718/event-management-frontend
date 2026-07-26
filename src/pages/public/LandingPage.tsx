"use client"

import { lazy, Suspense, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import {
  ArrowRight,
  QrCode,
  Award,
  BellRing,
  BarChart3,
  Search,
  MessageCircle,
  CalendarCheck,
  ChevronRight,
  Star,
  UserPlus,
  Ticket,
  ScanLine,
} from "lucide-react"
import { getUpcomingEvents, getPopularEvents } from "@/api/eventApi"
import type { EventItem } from "@/constants/types"
import { Button, Eyebrow } from "@/components/common/ui"
import { Logo } from "@/components/common/Logo"
import { LandingEnhancements } from "@/components/landing/LandingEnhancements"
import HorizontalJourney from "@/components/landing/HorizontalJourney"
import FeatureMarquee from "@/components/landing/FeatureMarquee"

const EventLifecycle = lazy(
  () => import("@/components/landing/event-lifecycle/EventLifecycle")
)

const timelineData = [
  {
    id: 1,
    title: "Browse & Discover",
    date: "Step 1",
    content: "Find events by category, city, or mode. Smart search understands what you're looking for and surfaces the best matches.",
    category: "Discovery",
    icon: Search,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "One-Tap Registration",
    date: "Step 2",
    content: "Register in one tap and get a QR ticket. No more Google Forms or spreadsheet chaos. Instant confirmation delivered.",
    category: "Registration",
    icon: Ticket,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "QR Check-In",
    date: "Step 3",
    content: "Organizers scan your QR at entry. Attendance tracked in real-time with zero manual work. Seamless and instant.",
    category: "Attendance",
    icon: QrCode,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 70,
  },
  {
    id: 4,
    title: "Auto Certificates",
    date: "Step 4",
    content: "Certificate generated automatically after attendance. Verified, shareable, and downloadable anytime.",
    category: "Rewards",
    icon: Award,
    relatedIds: [3, 5],
    status: "pending" as const,
    energy: 45,
  },
  {
    id: 5,
    title: "Smart Notifications",
    date: "Step 5",
    content: "Registration confirmations, reminders, venue changes, and certificate alerts — all in one intelligent inbox.",
    category: "Updates",
    icon: BellRing,
    relatedIds: [4, 6],
    status: "pending" as const,
    energy: 30,
  },
  {
    id: 6,
    title: "Organizer Analytics",
    date: "Step 6",
    content: "Live dashboards for registrations, attendance, ratings, and engagement. Make data-driven decisions.",
    category: "Insights",
    icon: BarChart3,
    relatedIds: [5],
    status: "pending" as const,
    energy: 15,
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

const scaleFade = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
}

/* ── Floating Particle ── */
function FloatingParticle({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-primary/20 pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
      animate={{
        y: [0, -30, 0],
        opacity: [0, 0.6, 0],
        scale: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 4 + Math.random() * 2,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  )
}



/* ── Hero Product Mockup ── */
function HeroMockup() {
  const reduce = useReducedMotion()
  const [activeRow, setActiveRow] = useState(0)

  useEffect(() => {
    if (reduce) return
    const interval = setInterval(() => {
      setActiveRow((prev) => (prev + 1) % 4)
    }, 2000)
    return () => clearInterval(interval)
  }, [reduce])

  const rows = [
    { icon: Search, label: "Discover events", note: "browse" },
    { icon: CalendarCheck, label: "Register in one tap", note: "ticket + QR" },
    { icon: QrCode, label: "Check in via QR", note: "scanned" },
    { icon: Award, label: "Receive certificate", note: "auto-issued" },
  ]

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, x: 40, rotate: 1 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      transition={{ delay: reduce ? 0 : 0.3, duration: 0.6, ease: "easeOut" }}
      className="relative hidden md:block"
    >
      <div className="glass gradient-border rounded-2xl p-6 shadow-2xl shadow-black/20">
        <div className="relative z-10 flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">your event journey</span>
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-destructive/60" />
            <span className="size-2.5 rounded-full bg-warning/60" />
            <span className="size-2.5 rounded-full bg-success/60" />
          </span>
        </div>
        <div className="relative z-10 mt-5 flex flex-col gap-2.5">
          {rows.map((row, i) => (
            <motion.div
              key={row.label}
              animate={i === activeRow && !reduce ? { x: 6, borderColor: "var(--primary)" } : { x: 0, borderColor: "var(--border)" }}
              transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-all duration-500 ${
                i === activeRow
                  ? "border-primary/40 bg-accent/80 shadow-[0_0_16px_var(--primary)]"
                  : "border-border/60 bg-background/50"
              }`}
            >
              <span className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
                <row.icon className={`size-4 transition-colors duration-300 ${i === activeRow ? "text-primary" : "text-muted-foreground"}`} aria-hidden="true" />
                {row.label}
              </span>
              <span className={`font-mono text-xs transition-colors duration-300 ${i === activeRow ? "text-accent-foreground" : "text-muted-foreground"}`}>
                {row.note}
              </span>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="relative z-10 mt-5 rounded-xl bg-secondary/80 p-4 overflow-hidden"
          initial={reduce ? false : {}}
          animate={reduce ? {} : { opacity: 1 }}
        >
          <p className="font-mono text-xs leading-relaxed text-muted-foreground">
            <motion.span
              animate={reduce ? {} : { opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-success"
            >
              ✓
            </motion.span>{" "}
            ticket scanned at entry
            <br />
            <motion.span
              animate={reduce ? {} : { opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              className="text-success"
            >
              ✓
            </motion.span>{" "}
            attendance marked present
            <br />
            <motion.span
              animate={reduce ? {} : { opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              className="text-primary"
            >
              →
            </motion.span>{" "}
            certificate issued automatically
          </p>
        </motion.div>
      </div>
      {/* Floating background image */}
      <motion.img
        src="/events/tech-conf.png"
        alt=""
        aria-hidden="true"
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
        className="absolute -bottom-8 -left-10 -z-10 w-64 rotate-[-4deg] rounded-2xl border border-border object-cover"
      />
    </motion.div>
  )
}

export default function LandingPage() {
  const reduce = useReducedMotion()
  const [upcoming, setUpcoming] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getUpcomingEvents(), getPopularEvents()])
      .then(([up]) => setUpcoming(up.data.slice(0, 3)))
      .finally(() => setLoading(false))
  }, [])

  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    delay: i * 0.5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 3 + Math.random() * 5,
  }))

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Ambient effects */}
        <div className="glow-orb -top-40 left-1/2 -translate-x-1/2 size-[700px] bg-primary animate-pulse-glow" aria-hidden="true" />
        <div className="glow-orb top-32 -right-40 size-[400px] bg-primary/40" aria-hidden="true" />
        <div className="glow-orb -bottom-20 -left-40 size-[300px] bg-primary/30" aria-hidden="true" />
        <div className="bg-grid bg-grid-fade pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

        {/* Floating particles */}
        {!reduce && particles.map((p) => (
          <FloatingParticle key={p.id} delay={p.delay} x={p.x} y={p.y} size={p.size} />
        ))}

        {/* Navbar logo */}
        <div className="relative mx-auto max-w-7xl px-4 pt-10 md:px-6 md:pt-14">
          <motion.div
            variants={fadeUp}
            initial={reduce ? false : "hidden"}
            animate="visible"
            transition={{ duration: reduce ? 0 : 0.4 }}
            className="flex items-center gap-3"
          >
            <Logo className="h-10 w-10" />
            <span className="font-extrabold tracking-tight text-foreground">
              event<span className="text-primary">h</span>ub
            </span>
          </motion.div>
        </div>

        {/* Hero content */}
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-12 pt-8 md:grid-cols-[1.15fr_0.85fr] md:items-center md:px-6 md:pb-16 md:pt-12">
          <motion.div variants={stagger} initial={reduce ? false : "hidden"} animate="visible">
            <motion.h1
              variants={fadeUp}
              transition={{ duration: reduce ? 0 : 0.55 }}
              className="display text-4xl text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Where every
              <br />
              event becomes
              <br />
              <span className="gradient-text">a memory.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              transition={{ duration: reduce ? 0 : 0.5 }}
              className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground text-pretty md:text-base"
            >
              Smart discovery, seamless registration, QR check-in, and automatic
              certificates — all in one platform built for modern communities.
            </motion.p>
            <motion.div
              variants={fadeUp}
              transition={{ duration: reduce ? 0 : 0.5 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link to="/events">
                <Button size="lg" className="w-full sm:w-auto group">
                  Explore events
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Start organizing
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <HeroMockup />
        </div>

        {/* Feature Marquee */}
        <FeatureMarquee />

        {/* Horizontal Journey */}
        <HorizontalJourney />
      </section>

      {/* ── Cinematic Event Lifecycle: Space Journey ── */}
      <Suspense fallback={null}>
        <EventLifecycle />
      </Suspense>

      

      {/* ── Product Showcase: Registration ── */}
      <section className="border-t border-border mesh-bg" aria-labelledby="showcase-registration">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 md:px-6 lg:grid-cols-[1fr_1fr] lg:items-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : 0.1 }}
            className="order-2 glass gradient-border rounded-2xl p-5 shadow-2xl shadow-black/10 md:order-1 md:p-6"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <p className="font-mono text-xs text-muted-foreground">registration flow</p>
                <span className="rounded-full bg-success/10 px-2.5 py-1 font-mono text-xs text-success">one tap</span>
              </div>
              <div className="mt-4 rounded-xl border border-border/60 bg-background/50 p-5">
                <p className="text-sm font-bold text-foreground">AI/ML Workshop 2026</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">Aug 15, 2026 · Bangalore · Hybrid</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <QrCode className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Ticket #EH-4829</p>
                    <p className="font-mono text-[11px] text-muted-foreground">QR issued instantly</p>
                  </div>
                </div>
                <div className="mt-4 rounded-lg bg-success/10 p-3">
                  <p className="font-mono text-xs text-success">✓ Registration confirmed — check your inbox</p>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: reduce ? 0 : 0.5 }}
            className="order-1 md:order-2"
          >
            <Eyebrow>registration</Eyebrow>
            <h2 id="showcase-registration" className="display mt-5 text-3xl text-foreground md:text-5xl">
              Register in seconds. <span className="gradient-text">Literally.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              One tap and you're in. Confirmation email and calendar invite — no more Google Forms or spreadsheet chaos.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {["One-tap registration", "Email confirmation", "Calendar invite"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                  <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/register" className="mt-8 inline-flex">
              <Button variant="outline" className="group">Create account <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Product Showcase: Check-in ── */}
      <section className="border-t border-border" aria-labelledby="showcase-checkin">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 md:px-6 lg:grid-cols-[1fr_1fr] lg:items-center">
          <motion.div
            variants={fadeUp}
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: reduce ? 0 : 0.5 }}
          >
            <Eyebrow>check-in</Eyebrow>
            <h2 id="showcase-checkin" className="display mt-5 text-3xl text-foreground md:text-5xl">
              Scan. Verify. <span className="gradient-text">Done.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              Organizers scan your QR. Attendance is tracked automatically, certificates are issued instantly, and you're on your way.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {["QR scan at entry", "Instant attendance marking", "Auto-issued certificates", "Real-time organizer dashboard"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                  <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/events" className="mt-8 inline-flex">
              <Button variant="outline" className="group">See how it works <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></Button>
            </Link>
          </motion.div>
          <motion.div
            initial={reduce ? false : { opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : 0.1 }}
            className="glass gradient-border rounded-2xl p-5 shadow-2xl shadow-black/10 md:p-6"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <p className="font-mono text-xs text-muted-foreground">check-in portal</p>
                <motion.span
                  className="rounded-full bg-success/10 px-2.5 py-1 font-mono text-xs text-success"
                  animate={reduce ? {} : { opacity: [1, 0.6, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  live
                </motion.span>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                      <QrCode className="size-5 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Scan QR Ticket</p>
                      <p className="font-mono text-[11px] text-muted-foreground">Point camera at attendee QR</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-success/30 bg-success/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-success/10">
                      <Award className="size-5 text-success" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Certificate Issued</p>
                      <p className="font-mono text-[11px] text-success">Auto-generated for attendee</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <LandingEnhancements />

      {/* ── CTA ── */}
      <section className="border-t border-border" aria-labelledby="cta-heading">
        <div className="relative mx-auto max-w-7xl overflow-hidden px-4 py-28 md:px-6">
          <div className="glow-orb left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] bg-primary" aria-hidden="true" />
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />
          {!reduce && Array.from({ length: 8 }).map((_, i) => (
            <FloatingParticle key={i} delay={i * 0.7} x={10 + Math.random() * 80} y={10 + Math.random() * 80} size={2 + Math.random() * 4} />
          ))}
          <motion.div
            variants={stagger}
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="relative flex flex-col items-center gap-6 text-center"
          >
            <motion.div variants={fadeUp}>
              <Eyebrow>no forms · no spreadsheets · just events</Eyebrow>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              id="cta-heading"
              className="display max-w-3xl text-4xl text-foreground md:text-6xl lg:text-7xl text-balance"
            >
              Ready to bring your community <span className="gradient-text">together?</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="max-w-md text-sm leading-relaxed text-muted-foreground text-pretty md:text-base">
              Create your organization account, publish your first event, and start scanning attendees in minutes.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col gap-3 sm:flex-row">
              <Link to="/register">
                <Button size="lg" className="group">
                  Get started free
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline">
                  See how it works
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
