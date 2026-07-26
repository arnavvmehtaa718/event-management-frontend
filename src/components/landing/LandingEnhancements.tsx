"use client"

import { type ReactNode, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import {
  ArrowRight,
  BarChart3,
  Bot,
  BriefcaseBusiness,
  CalendarCheck,
  Check,
  ChevronDown,
  FileSpreadsheet,
  Gamepad2,
  GraduationCap,
  Lightbulb,
  MessageCircle,
  Music2,
  Trophy,
  Users,
  Zap,
} from "lucide-react"
import { Button, Eyebrow, CardGlow } from "@/components/common/ui"

const categories = [
  { icon: Zap, label: "Technology", count: "840+ events" },
  { icon: BriefcaseBusiness, label: "Business", count: "620+ events" },
  { icon: Lightbulb, label: "Startups", count: "510+ events" },
  { icon: GraduationCap, label: "Education", count: "730+ events" },
  { icon: Music2, label: "Music", count: "390+ events" },
  { icon: Trophy, label: "Sports", count: "460+ events" },
  { icon: Gamepad2, label: "Gaming", count: "280+ events" },
  { icon: Bot, label: "Hackathons", count: "190+ events" },
]

const faqs = [
  ["Is EventHub free for attendees?", "Yes. Browsing events, registering, accessing QR tickets, and downloading earned certificates are free for attendees."],
  ["Can anyone publish an event?", "Organizer accounts can create events after their organization profile is verified, helping attendees trust what they discover."],
  ["How does QR check-in work?", "Every registration receives a unique QR ticket. Organizers scan it from the attendance page to verify the ticket and mark the attendee present."],
  ["When are certificates issued?", "For eligible events, certificates are issued automatically after a successful attendance check-in and remain available in the attendee dashboard."],
  ["Does EventHub support online events?", "Yes. Organizers can publish online, offline, and hybrid events, while attendees can filter by the format they prefer."],
]

const reveal = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      variants={reveal}
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: reduce ? 0 : 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  return (
    <motion.div
      className="border-b border-border"
      initial={reduce ? false : { opacity: 0, y: 10 }}
      whileInView={reduce ? false : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: reduce ? 0 : index * 0.08 }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left font-bold text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono text-xs font-bold text-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
          {question}
        </span>
        <ChevronDown className={`size-4 shrink-0 text-primary transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      <div className="accordion-content" data-open={open ? "true" : "false"}>
        <div>
          <p className="pl-10 pb-5 text-sm leading-relaxed text-muted-foreground">{answer}</p>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Animated Bar Chart ── */
function AnimatedBarChart({ reduce }: { reduce: boolean }) {
  const [mounted, setMounted] = useState(false)
  const ref = useState(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const bars = [32, 48, 40, 65, 56, 78, 92, 72, 100, 86]
  return (
    <div className="mt-8 flex h-28 items-end gap-2">
      {bars.map((height, i) => (
        <motion.span
          key={i}
          initial={{ height: 0 }}
          animate={mounted ? { height: `${height}%` } : {}}
          transition={{ delay: reduce ? 0 : i * 0.06, duration: 0.5, ease: "easeOut" }}
          className="flex-1 rounded-t bg-primary/80 relative group/bar"
        >
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[9px] text-primary opacity-0 group-hover/bar:opacity-100 transition-opacity">
            {height}
          </span>
        </motion.span>
      ))}
    </div>
  )
}

export function LandingEnhancements() {
  const reduce = useReducedMotion()

  return (
    <>
      {/* ── Why EventHub ── */}
      <section className="border-t border-border mesh-bg" aria-labelledby="why-heading">
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-6">
          <Reveal>
            <Eyebrow>why EventHub</Eyebrow>
            <h2 id="why-heading" className="display mt-5 max-w-3xl text-3xl text-foreground md:text-5xl lg:text-6xl">
              One clear workflow, <span className="gradient-text">not four disconnected tools.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <Reveal className="glass rounded-2xl border border-border/60 p-6 md:p-8">
              <p className="font-mono text-xs text-muted-foreground">The traditional way</p>
              <div className="mt-6 flex flex-col gap-3">
                {[
                  [FileSpreadsheet, "Google Forms", "registrations"],
                  [MessageCircle, "WhatsApp", "updates"],
                  [BarChart3, "Excel", "tracking"],
                  [Users, "Manual lists", "check-in"],
                ].map(([Icon, title, note], i) => (
                  <motion.div
                    key={String(title)}
                    initial={reduce ? false : { opacity: 0, x: -20 }}
                    whileInView={reduce ? false : { opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: reduce ? 0 : i * 0.1 }}
                    className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/50 p-3.5"
                  >
                    <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="font-semibold text-foreground">{String(title)}</span>
                    <span className="ml-auto font-mono text-xs text-muted-foreground">{String(note)}</span>
                  </motion.div>
                ))}
              </div>
            </Reveal>
            <Reveal className="gradient-border rounded-2xl border border-primary/40 bg-accent/80 p-6 md:p-8">
              <div className="relative z-10">
                <p className="font-mono text-xs text-accent-foreground">The EventHub way</p>
                <div className="mt-6 rounded-2xl border border-primary/30 bg-card p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <CalendarCheck className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-extrabold text-foreground">One connected platform</p>
                      <p className="text-sm text-muted-foreground">Discover → register → check in → certify</p>
                    </div>
                  </div>
                  <ul className="mt-6 flex flex-col gap-3">
                    {["A single source of truth", "Real-time attendance records", "Automatic attendee communication", "Certificates tied to verified attendance"].map((item, i) => (
                      <motion.li
                        key={item}
                        initial={reduce ? false : { opacity: 0, x: 10 }}
                        whileInView={reduce ? false : { opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: reduce ? 0 : 0.2 + i * 0.08 }}
                        className="flex items-center gap-2 text-sm text-foreground"
                      >
                        <Check className="size-4 text-primary" aria-hidden="true" />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Browse by Category ── */}
      <section className="border-t border-border" aria-labelledby="categories-heading">
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-6">
          <Reveal>
            <Eyebrow>browse by interest</Eyebrow>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
              <h2 id="categories-heading" className="display text-3xl text-foreground md:text-5xl lg:text-6xl">
                A space for every <span className="gradient-text">community.</span>
              </h2>
            </div>
          </Reveal>
          <motion.div
            className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4"
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {categories.map((category) => (
              <motion.div
                key={category.label}
                variants={reveal}
                whileHover={reduce ? undefined : { y: -6, scale: 1.03, transition: { duration: 0.2 } }}
                className="glass group rounded-2xl border border-border/60 p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 cursor-default"
              >
                <motion.div
                  whileHover={reduce ? undefined : { rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  <category.icon className="size-5 text-primary" aria-hidden="true" />
                </motion.div>
                <h3 className="mt-5 font-extrabold text-foreground">{category.label}</h3>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{category.count}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Community Hub ── */}
      <section className="border-t border-border mesh-bg" aria-labelledby="community-heading">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 md:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <Reveal>
            <Eyebrow>community · preview</Eyebrow>
            <h2 id="community-heading" className="display mt-5 text-3xl text-foreground md:text-5xl">
              The event ends. The <span className="gradient-text">connection doesn't.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              Meet people with shared interests and continue meaningful conversations around the events you attend.
            </p>
          </Reveal>
          <Reveal className="grid gap-4 md:grid-cols-2">
            <CardGlow className="glass rounded-2xl border border-border/60 p-5">
              <div className="flex items-center justify-between">
                <p className="font-bold text-foreground">People you may meet</p>
                <Users className="size-4 text-primary" aria-hidden="true" />
              </div>
              <div className="mt-5 flex flex-col gap-3">
                {[
                  ["AK", "Aarav Khanna", "Product · AI"],
                  ["SM", "Sara Menon", "Design · Startups"],
                  ["RV", "Rohan Verma", "Engineering · OSS"],
                ].map(([initials, name, interests], i) => (
                  <motion.div
                    key={name}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    whileInView={reduce ? false : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: reduce ? 0 : i * 0.1 }}
                    className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/50 p-3 transition-all hover:border-primary/30"
                  >
                    <span className="flex size-9 items-center justify-center rounded-full bg-primary font-mono text-xs font-bold text-primary-foreground">
                      {initials}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground">{name}</p>
                      <p className="font-mono text-[11px] text-muted-foreground">{interests}</p>
                    </div>
                    <button
                      type="button"
                      className="ml-auto shrink-0 rounded-full border border-border/60 px-2.5 py-1 font-mono text-[11px] text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground hover:bg-primary/5"
                    >
                      connect
                    </button>
                  </motion.div>
                ))}
              </div>
            </CardGlow>
            <CardGlow className="glass rounded-2xl border border-border/60 p-5">
              <div className="flex items-center justify-between">
                <p className="font-bold text-foreground">Event chat</p>
                <MessageCircle className="size-4 text-primary" aria-hidden="true" />
              </div>
              <div className="mt-5 flex flex-col gap-3">
                <motion.div
                  initial={reduce ? false : { opacity: 0, x: -10 }}
                  whileInView={reduce ? false : { opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="max-w-[85%] rounded-xl rounded-tl-sm bg-primary/10 p-3"
                >
                  <p className="text-xs font-bold text-primary">Priya S.</p>
                  <p className="mt-1 text-sm text-foreground">Great talk on distributed systems! Anyone have the slides?</p>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">2:34 PM</p>
                </motion.div>
                <motion.div
                  initial={reduce ? false : { opacity: 0, x: 10 }}
                  whileInView={reduce ? false : { opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-secondary p-3"
                >
                  <p className="text-xs font-bold text-foreground">You</p>
                  <p className="mt-1 text-sm text-foreground">Yes! I'll share the link here</p>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">2:36 PM</p>
                </motion.div>
                <motion.div
                  initial={reduce ? false : { opacity: 0, x: -10 }}
                  whileInView={reduce ? false : { opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="max-w-[85%] rounded-xl rounded-tl-sm bg-primary/10 p-3"
                >
                  <p className="text-xs font-bold text-primary">Dev M.</p>
                  <p className="mt-1 text-sm text-foreground">Thanks! This community is awesome</p>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">2:38 PM</p>
                </motion.div>
              </div>
            </CardGlow>
          </Reveal>
        </div>
      </section>

      {/* ── Organizer Dashboard Preview ── */}
      <section className="border-t border-border" aria-labelledby="organizer-heading">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 md:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <Reveal>
            <Eyebrow>organizer preview</Eyebrow>
            <h2 id="organizer-heading" className="display mt-5 text-3xl text-foreground md:text-5xl">
              Know what's happening, <span className="gradient-text">as it happens.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              A focused command center for registrations, check-ins, engagement, and event performance — without turning organizers into analysts.
            </p>
            <Link to="/register" className="mt-8 inline-flex">
              <Button className="group">Start organizing <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></Button>
            </Link>
          </Reveal>
          <Reveal>
            <CardGlow className="glass gradient-border rounded-2xl p-4 shadow-2xl shadow-black/10 md:p-6">
              <div className="relative z-10">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">Organizer overview</p>
                    <p className="mt-1 font-extrabold text-foreground">July performance</p>
                  </div>
                  <motion.span
                    className="rounded-full bg-success/10 px-2.5 py-1 font-mono text-xs text-success"
                    animate={reduce ? {} : { opacity: [1, 0.6, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    live
                  </motion.span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {[
                    ["12", "Total events"],
                    ["2,480", "Registrations"],
                    ["1,916", "QR check-ins"],
                    ["4.8/5", "Avg. rating"],
                  ].map(([value, label], i) => (
                    <motion.div
                      key={label}
                      initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                      whileInView={reduce ? false : { opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: reduce ? 0 : i * 0.08 }}
                      className="rounded-xl border border-border/60 bg-background/50 p-4"
                    >
                      <p className="display text-xl text-foreground">{value}</p>
                      <p className="mt-1 font-mono text-[11px] text-muted-foreground">{label}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-[1.4fr_0.6fr]">
                  <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-foreground">Registrations</p>
                      <span className="font-mono text-[11px] text-success">+18.4%</span>
                    </div>
                    <AnimatedBarChart reduce={!!reduce} />
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                    <p className="text-sm font-bold text-foreground">Check-in rate</p>
                    <div className="mt-5 flex size-28 items-center justify-center rounded-full border-[10px] border-primary border-r-border">
                      <motion.span
                        className="display text-2xl text-foreground"
                        initial={reduce ? false : { opacity: 0, scale: 0.5 }}
                        whileInView={reduce ? false : { opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, type: "spring" }}
                      >
                        77%
                      </motion.span>
                    </div>
                  </div>
                </div>
              </div>
            </CardGlow>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-t border-border mesh-bg" aria-labelledby="faq-heading">
        <div className="mx-auto max-w-4xl px-4 py-24 md:px-6">
          <Reveal>
            <Eyebrow>frequently asked</Eyebrow>
            <h2 id="faq-heading" className="display mt-5 text-3xl text-foreground md:text-5xl lg:text-6xl">
              Questions, <span className="gradient-text">answered.</span>
            </h2>
          </Reveal>
          <div className="mt-10 border-t border-border">
            {faqs.map(([question, answer], i) => (
              <FaqItem key={i} question={question} answer={answer} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
