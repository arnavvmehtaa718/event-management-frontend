"use client"

import { useEffect, useState } from "react"
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
  Sparkles,
  Zap,
  Shield,
  Globe,
} from "lucide-react"
import { getUpcomingEvents, getPopularEvents } from "@/api/eventApi"
import type { EventItem } from "@/constants/types"
import { EventCard } from "@/components/cards/EventCard"
import { Button, Skeleton, Eyebrow } from "@/components/common/ui"
import { Logo } from "@/components/common/Logo"
import { LandingEnhancements } from "@/components/landing/LandingEnhancements"

const features = [
  {
    icon: Search,
    title: "Create Account",
    tag: "quick start",
    description: "Sign up in seconds and set up your profile. Join as an attendee or organizer instantly.",
    rows: ["One-click sign up", "Attendee & organizer roles"],
  },
  {
    icon: Search,
    title: "Browse Events",
    tag: "search + filters",
    description: "Search and filter events by category, city, and mode. Everything in one place instead of scattered group chats.",
    rows: ["Filter by category, city & mode", "Online, offline & hybrid events"],
  },
  {
    icon: CalendarCheck,
    title: "Registration",
    tag: "one tap",
    description: "Register in seconds and instantly receive a ticket with a unique QR code. No more Google Forms.",
    rows: ["One-tap registration", "Ticket + QR issued instantly"],
  },
  {
    icon: QrCode,
    title: "QR Check-In",
    tag: "seamless",
    description: "Organizers scan your QR code. Attendance is tracked automatically and accurately.",
    rows: ["Scan QR at entry", "Attendance marked automatically"],
  },
  {
    icon: Award,
    title: "Certificates",
    tag: "auto-issued",
    description: "Attend an event and your certificate is generated automatically. Download it anytime.",
    rows: ["Issued on attendance", "Download anytime"],
  },
  {
    icon: BellRing,
    title: "Notifications",
    tag: "smart inbox",
    description: "Registration confirmations, reminders, venue changes, and certificate alerts in one inbox.",
    rows: ["Confirmations & reminders", "Venue change alerts"],
  },
  {
    icon: MessageCircle,
    title: "Feedback",
    tag: "reviews",
    description: "Share your experience after events. Rate, review, and help the community discover great events.",
    rows: ["Star ratings & reviews", "Help others decide"],
  },
  {
    icon: BarChart3,
    title: "Analytics",
    tag: "live",
    description: "Organizers get live dashboards for registrations, attendance, ratings, and views.",
    rows: ["Registrations over time", "Attendance & ratings"],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
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

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="glow-orb -top-40 left-1/2 -translate-x-1/2 size-[700px] bg-primary animate-pulse-glow" aria-hidden="true" />
        <div className="glow-orb top-32 -right-40 size-[400px] bg-primary/40" aria-hidden="true" />
        <div className="glow-orb -bottom-20 -left-40 size-[300px] bg-primary/30" aria-hidden="true" />

        <div className="bg-grid bg-grid-fade pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-4 pt-10 md:px-6 md:pt-14">
          <motion.div
            variants={fadeUp}
            initial={reduce ? false : "hidden"}
            animate="visible"
            transition={{ duration: reduce ? 0 : 0.4 }}
            className="flex items-center gap-3"
          >
            <Logo className="h-10 w-10" />
            <span className="font-extrabold tracking-tight text-foreground">event<span className="text-primary">h</span>ub</span>
          </motion.div>
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-16 pt-8 md:grid-cols-[1.15fr_0.85fr] md:items-center md:px-6 md:pb-20 md:pt-12">
          <motion.div
            variants={stagger}
            initial={reduce ? false : "hidden"}
            animate="visible"
          >
            <motion.h1
              variants={fadeUp}
              transition={{ duration: reduce ? 0 : 0.55 }}
              className="display mt-5 text-4xl text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
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
              AI-powered discovery, seamless registration, QR check-in, and automatic
              certificates — all in one platform built for modern communities.
            </motion.p>
            <motion.div
              variants={fadeUp}
              transition={{ duration: reduce ? 0 : 0.5 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link to="/events">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore events
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Start organizing
                </Button>
              </Link>
            </motion.div>
            <motion.dl
              variants={fadeUp}
              transition={{ duration: reduce ? 0 : 0.5 }}
              className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-5"
            >
              {[
                ["4,200+", "events hosted"],
                ["58k+", "registrations"],
                ["31k+", "certificates"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="sr-only">{label}</dt>
                  <dd className="display text-xl text-foreground md:text-2xl">{value}</dd>
                  <dd className="mt-1 font-mono text-[11px] text-muted-foreground">{label}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          {/* Product mockup */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: 40, rotate: 1 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ delay: reduce ? 0 : 0.25, duration: reduce ? 0 : 0.6, ease: "easeOut" }}
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
                {[
                  { icon: Search, label: "Discover events", note: "browse", active: false },
                  { icon: CalendarCheck, label: "Register in one tap", note: "ticket + QR", active: true },
                  { icon: QrCode, label: "Check in via QR", note: "scanned", active: false },
                  { icon: Award, label: "Receive certificate", note: "auto-issued", active: false },
                ].map((row) => (
                  <motion.div
                    key={row.label}
                    whileHover={reduce ? undefined : { x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={
                      row.active
                        ? "flex items-center justify-between rounded-xl border border-primary/40 bg-accent/80 px-4 py-3"
                        : "flex items-center justify-between rounded-xl border border-border/60 bg-background/50 px-4 py-3"
                    }
                  >
                    <span className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
                      <row.icon className={row.active ? "size-4 text-primary" : "size-4 text-muted-foreground"} aria-hidden="true" />
                      {row.label}
                    </span>
                    <span className={row.active ? "font-mono text-xs text-accent-foreground" : "font-mono text-xs text-muted-foreground"}>
                      {row.note}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div className="relative z-10 mt-5 rounded-xl bg-secondary/80 p-4">
                <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                  <span className="text-success">✓</span> ticket scanned at entry
                  <br />
                  <span className="text-success">✓</span> attendance marked present
                  <br />
                  <span className="text-primary">→</span> certificate issued automatically
                </p>
              </div>
            </div>
            <motion.img
              src="/events/tech-conf.png"
              alt=""
              aria-hidden="true"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
              className="absolute -bottom-8 -left-10 -z-10 w-64 rotate-[-4deg] rounded-2xl border border-border object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Trusted By ── */}
      <section className="border-t border-border" aria-labelledby="trusted-heading">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <motion.div
            variants={fadeUp}
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: reduce ? 0 : 0.45 }}
            className="text-center"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Trusted by forward-thinking organizations
            </p>
          </motion.div>
          <motion.div
            variants={stagger}
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 md:gap-10"
          >
            {[
              { icon: Zap, label: "Lightning Fast" },
              { icon: Shield, label: "Enterprise Security" },
              { icon: Globe, label: "Global Reach" },
              { icon: Sparkles, label: "AI-Powered" },
              { icon: CalendarCheck, label: "Trusted Platform" },
            ].map((item) => (
              <motion.div
                key={item.label}
                variants={fadeUp}
                className="flex items-center gap-2 text-muted-foreground/60 transition-colors hover:text-muted-foreground"
              >
                <item.icon className="size-5" aria-hidden="true" />
                <span className="font-mono text-sm">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features Bento Grid ── */}
      <section className="border-t border-border mesh-bg" aria-labelledby="features-heading">
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-6">
          <motion.div
            variants={fadeUp}
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: reduce ? 0 : 0.45 }}
          >
            <Eyebrow>everything you need</Eyebrow>
            <h2 id="features-heading" className="display mt-5 text-3xl text-foreground md:text-5xl lg:text-6xl">
              Six lanes. <span className="gradient-text">One platform.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Each piece mirrors how real events actually run — so the whole lifecycle lives in one place, from the first
              search to the final certificate.
            </p>
          </motion.div>
          <motion.div
            variants={stagger}
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="mt-14 flex flex-wrap justify-center gap-5"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                whileHover={reduce ? undefined : { y: -6, transition: { duration: 0.25 } }}
                transition={{ duration: reduce ? 0 : 0.3 }}
                className="group glass w-full rounded-2xl border border-border/60 p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 sm:w-[calc(50%-10px)] lg:w-[calc(33.333333%-14px)]"
              >
                <div className="flex items-start justify-between">
                  <span className="flex size-12 items-center justify-center rounded-xl border border-border/60 bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <f.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="rounded-full border border-border/60 bg-background/50 px-2.5 py-1 font-mono text-xs text-muted-foreground">
                    {f.tag}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-extrabold tracking-tight text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                <div className="mt-4 flex flex-col gap-1.5 border-t border-border/60 pt-4">
                  {f.rows.map((row) => (
                    <p key={row} className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                      <ChevronRight className="size-3 text-primary" aria-hidden="true" />
                      {row}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Product Showcase: Discovery ── */}
      <section className="border-t border-border" aria-labelledby="showcase-discovery">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 md:px-6 lg:grid-cols-[1fr_1fr] lg:items-center">
          <motion.div
            variants={fadeUp}
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: reduce ? 0 : 0.5 }}
          >
            <Eyebrow>discovery</Eyebrow>
            <h2 id="showcase-discovery" className="display mt-5 text-3xl text-foreground md:text-5xl">
              Find events that <span className="gradient-text">actually matter.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              AI-powered search understands what you're looking for. Filter by category, city, format, or just describe the kind of event you want.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {["Natural language search", "Filter by category, city & mode", "Personalized recommendations", "Online, offline & hybrid"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                  <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/events" className="mt-8 inline-flex">
              <Button variant="outline">Browse events <ArrowRight className="size-4" aria-hidden="true" /></Button>
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
                <p className="font-mono text-xs text-muted-foreground">discovery feed</p>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 font-mono text-xs text-primary">AI-powered</span>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {[
                  { cat: "Technology", name: "AI/ML Workshop 2026", city: "Bangalore", mode: "Hybrid" },
                  { cat: "Design", name: "Design Systems Summit", city: "Mumbai", mode: "Offline" },
                  { cat: "Startups", name: "Founder Meetup", city: "Delhi", mode: "Online" },
                ].map((event) => (
                  <div key={event.name} className="rounded-xl border border-border/60 bg-background/50 p-4 transition-colors hover:border-primary/30">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary">{event.cat}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{event.mode}</span>
                    </div>
                    <p className="mt-2 text-sm font-bold text-foreground">{event.name}</p>
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">{event.city}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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
              <Button variant="outline">Create account <ArrowRight className="size-4" aria-hidden="true" /></Button>
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
              <Button variant="outline">See how it works <ArrowRight className="size-4" aria-hidden="true" /></Button>
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
                <span className="rounded-full bg-success/10 px-2.5 py-1 font-mono text-xs text-success">live</span>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                  <div className="flex items-center justify-between">
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
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ["142", "Checked in"],
                    ["96%", "Show rate"],
                    ["12", "Events today"],
                  ].map(([val, label]) => (
                    <div key={label} className="rounded-lg border border-border/60 bg-background/50 p-3 text-center">
                      <p className="display text-lg text-foreground">{val}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{label}</p>
                    </div>
                  ))}
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
            <motion.div variants={fadeUp} whileHover={reduce ? undefined : { scale: 1.03 }} whileTap={reduce ? undefined : { scale: 0.98 }}>
              <Link to="/register">
                <Button size="lg">
                  Get started free
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
