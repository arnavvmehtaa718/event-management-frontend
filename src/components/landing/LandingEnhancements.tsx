"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { motion, useInView, useReducedMotion } from "framer-motion"
import {
  ArrowRight,
  BarChart3,
  BellRing,
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
  MessageSquareText,
  Music2,
  QrCode,
  Search,
  Sparkles,
  Trophy,
  Users,
  WandSparkles,
  Zap,
} from "lucide-react"
import { Button, Eyebrow } from "@/components/common/ui"

const impact = [
  { value: 4200, suffix: "+", label: "Events hosted" },
  { value: 58000, suffix: "+", label: "Attendees" },
  { value: 860, suffix: "+", label: "Verified organizers" },
  { value: 47000, suffix: "+", label: "Successful check-ins" },
]

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

const aiFeatures = [
  { icon: Search, title: "AI search", text: "Find the right event using natural language, not rigid filters." },
  { icon: Sparkles, title: "Recommendations", text: "A personal event feed shaped around your interests and activity." },
  { icon: BellRing, title: "Smart reminders", text: "Timely nudges before registration deadlines and event start times." },
  { icon: MessageSquareText, title: "Smart notifications", text: "Important venue and schedule updates surfaced without the noise." },
  { icon: WandSparkles, title: "Event discovery", text: "Uncover relevant communities and experiences you might have missed." },
]

const testimonials = [
  { quote: "EventHub replaced three tools for our student community. Check-in finally takes minutes, not an hour.", name: "Riya Kapoor", role: "Community lead · TechCircle" },
  { quote: "The attendee flow is remarkably clear. Our guests register, get a QR, and know exactly what happens next.", name: "Aditya Rao", role: "Organizer · Founders Guild" },
  { quote: "Certificates used to take our team days to prepare. Now the entire post-event process runs itself.", name: "Neha Sharma", role: "Program manager · EduForward" },
  { quote: "I discovered two communities I now attend every month. The experience feels built around people, not forms.", name: "Kabir Mehta", role: "Event attendee" },
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

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.8 })
  const reduce = useReducedMotion()
  const [count, setCount] = useState(reduce ? value : 0)

  useEffect(() => {
    if (!inView || reduce) return
    const duration = 900
    const start = performance.now()
    let frame = 0
    const update = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setCount(Math.round(value * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) frame = requestAnimationFrame(update)
    }
    frame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduce, value])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

export function LandingEnhancements() {
  const reduce = useReducedMotion()

  return (
    <>
      {/* ── Impact Stats ── */}
      <section className="border-t border-border mesh-bg" aria-labelledby="impact-heading">
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-6">
          <Reveal>
            <Eyebrow>trusted by growing communities</Eyebrow>
            <h2 id="impact-heading" className="display mt-5 max-w-2xl text-3xl text-foreground md:text-5xl lg:text-6xl">
              Built for moments that <span className="gradient-text">matter.</span>
            </h2>
          </Reveal>
          <dl className="mt-12 grid grid-cols-2 border-l border-t border-border/60 lg:grid-cols-4">
            {impact.map((item, index) => (
              <motion.div
                key={item.label}
                className="glass border-b border-r border-border/60 p-6 md:p-8"
                variants={reveal}
                initial={reduce ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: reduce ? 0 : index * 0.08, duration: 0.4 }}
              >
                <dd className="display text-3xl text-foreground md:text-4xl">
                  <Counter value={item.value} suffix={item.suffix} />
                </dd>
                <dt className="mt-2 font-mono text-xs text-muted-foreground">{item.label}</dt>
              </motion.div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Why EventHub ── */}
      <section className="border-t border-border" aria-labelledby="why-heading">
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
                  <div key={String(title)} className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/50 p-3.5">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="font-semibold text-foreground">{String(title)}</span>
                    <span className="ml-auto font-mono text-xs text-muted-foreground">{String(note)}</span>
                    {i < 3 && <ChevronDown className="size-3 text-muted-foreground" aria-hidden="true" />}
                  </div>
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
                    {["A single source of truth", "Real-time attendance records", "Automatic attendee communication", "Certificates tied to verified attendance"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                        <Check className="size-4 text-primary" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Browse by Category ── */}
      <section className="border-t border-border mesh-bg" aria-labelledby="categories-heading">
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-6">
          <Reveal>
            <Eyebrow>browse by interest</Eyebrow>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
              <h2 id="categories-heading" className="display text-3xl text-foreground md:text-5xl lg:text-6xl">
                A space for every <span className="gradient-text">community.</span>
              </h2>
              <Link to="/events" className="flex items-center gap-1 font-mono text-sm text-primary hover:underline">
                explore all <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
          <motion.div
            className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4"
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          >
            {categories.map((category) => (
              <motion.div
                key={category.label}
                variants={reveal}
                whileHover={reduce ? undefined : { y: -5, transition: { duration: 0.2 } }}
                className="glass group rounded-2xl border border-border/60 p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
              >
                <category.icon className="size-5 text-primary" aria-hidden="true" />
                <h3 className="mt-5 font-extrabold text-foreground">{category.label}</h3>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{category.count}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Community Hub ── */}
      <section className="border-t border-border" aria-labelledby="community-heading">
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
            <div className="glass rounded-2xl border border-border/60 p-5">
              <div className="flex items-center justify-between">
                <p className="font-bold text-foreground">People you may meet</p>
                <Users className="size-4 text-primary" aria-hidden="true" />
              </div>
              <div className="mt-5 flex flex-col gap-3">
                {[
                  ["AK", "Aarav Khanna", "Product · AI"],
                  ["SM", "Sara Menon", "Design · Startups"],
                  ["RV", "Rohan Verma", "Engineering · OSS"],
                ].map(([initials, name, interests]) => (
                  <div key={name} className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/50 p-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-primary font-mono text-xs font-bold text-primary-foreground">
                      {initials}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground">{name}</p>
                      <p className="font-mono text-[11px] text-muted-foreground">{interests}</p>
                    </div>
                    <button
                      type="button"
                      className="ml-auto shrink-0 rounded-full border border-border/60 px-2.5 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                    >
                      connect
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl border border-border/60 p-5">
              <div className="flex items-center justify-between">
                <p className="font-bold text-foreground">Event chat</p>
                <MessageCircle className="size-4 text-primary" aria-hidden="true" />
              </div>
              <div className="mt-5 flex flex-col gap-3">
                <div className="max-w-[85%] rounded-xl rounded-tl-sm bg-primary/10 p-3">
                  <p className="text-xs font-bold text-primary">Priya S.</p>
                  <p className="mt-1 text-sm text-foreground">Great talk on distributed systems! Anyone have the slides?</p>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">2:34 PM</p>
                </div>
                <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-secondary p-3">
                  <p className="text-xs font-bold text-foreground">You</p>
                  <p className="mt-1 text-sm text-foreground">Yes! I'll share the link here</p>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">2:36 PM</p>
                </div>
                <div className="max-w-[85%] rounded-xl rounded-tl-sm bg-primary/10 p-3">
                  <p className="text-xs font-bold text-primary">Dev M.</p>
                  <p className="mt-1 text-sm text-foreground">Thanks! This community is awesome 🙌</p>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">2:38 PM</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Organizer Dashboard Preview ── */}
      <section className="border-t border-border mesh-bg" aria-labelledby="organizer-heading">
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
              <Button>Start organizing <ArrowRight className="size-4" aria-hidden="true" /></Button>
            </Link>
          </Reveal>
          <Reveal className="glass gradient-border rounded-2xl p-4 shadow-2xl shadow-black/10 md:p-6">
            <div className="relative z-10">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">Organizer overview</p>
                  <p className="mt-1 font-extrabold text-foreground">July performance</p>
                </div>
                <span className="rounded-full bg-success/10 px-2.5 py-1 font-mono text-xs text-success">live</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[
                  ["12", "Total events"],
                  ["2,480", "Registrations"],
                  ["1,916", "QR check-ins"],
                  ["4.8/5", "Avg. rating"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-xl border border-border/60 bg-background/50 p-4">
                    <p className="display text-xl text-foreground">{value}</p>
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-[1.4fr_0.6fr]">
                <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-foreground">Registrations</p>
                    <span className="font-mono text-[11px] text-success">+18.4%</span>
                  </div>
                  <div className="mt-8 flex h-28 items-end gap-2">
                    {[32, 48, 40, 65, 56, 78, 92, 72, 100, 86].map((height, i) => (
                      <motion.span
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${height}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: reduce ? 0 : i * 0.05, duration: reduce ? 0 : 0.4 }}
                        className="flex-1 rounded-t bg-primary/80"
                      />
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                  <p className="text-sm font-bold text-foreground">Check-in rate</p>
                  <div className="mt-5 flex size-28 items-center justify-center rounded-full border-[10px] border-primary border-r-border">
                    <span className="display text-2xl text-foreground">77%</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── AI Features ── */}
      <section className="border-t border-border" aria-labelledby="ai-heading">
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-6">
          <Reveal>
            <Eyebrow>intelligent by design · preview</Eyebrow>
            <h2 id="ai-heading" className="display mt-5 max-w-2xl text-3xl text-foreground md:text-5xl lg:text-6xl">
              Less searching. More <span className="gradient-text">belonging.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              A preview of thoughtful assistance designed to connect attendees with the right events, updates, and communities.
            </p>
          </Reveal>
          <div className="mt-12 bento-grid">
            {aiFeatures.map((feature, i) => (
              <motion.article
                key={feature.title}
                variants={reveal}
                initial={reduce ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: reduce ? 0 : i * 0.07 }}
                whileHover={reduce ? undefined : { y: -5, transition: { duration: 0.2 } }}
                className="glass rounded-2xl border border-border/60 p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 md:p-6"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-extrabold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="overflow-hidden border-t border-border mesh-bg" aria-labelledby="stories-heading">
        <div className="mx-auto max-w-7xl px-4 pt-24 md:px-6">
          <Reveal>
            <Eyebrow>community stories</Eyebrow>
            <h2 id="stories-heading" className="display mt-5 text-3xl text-foreground md:text-5xl lg:text-6xl">
              Built around <span className="gradient-text">real experiences.</span>
            </h2>
          </Reveal>
        </div>
        <div className="mt-10 overflow-hidden pb-24">
          <motion.div
            className="flex w-max gap-5 px-4"
            animate={reduce ? undefined : { x: [0, -1280] }}
            transition={reduce ? undefined : { duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {[...testimonials, ...testimonials].map((item, index) => (
              <figure
                key={`${item.name}-${index}`}
                className="w-[300px] shrink-0 glass rounded-2xl border border-border/60 p-6 md:w-[360px]"
              >
                <span className="font-mono text-3xl text-primary">"</span>
                <blockquote className="mt-3 text-sm leading-relaxed text-foreground">{item.quote}</blockquote>
                <figcaption className="mt-6 border-t border-border/60 pt-4">
                  <p className="font-bold text-foreground">{item.name}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{item.role}</p>
                </figcaption>
              </figure>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-t border-border" aria-labelledby="faq-heading">
        <div className="mx-auto max-w-4xl px-4 py-24 md:px-6">
          <Reveal>
            <Eyebrow>frequently asked</Eyebrow>
            <h2 id="faq-heading" className="display mt-5 text-3xl text-foreground md:text-5xl lg:text-6xl">
              Questions, <span className="gradient-text">answered.</span>
            </h2>
          </Reveal>
          <div className="mt-10 border-t border-border">
            {faqs.map(([question, answer], i) => (
              <details
                key={i}
                className="group border-b border-border"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-bold text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
                  {question}
                  <ChevronDown className="size-4 shrink-0 text-primary transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="max-w-2xl pb-5 text-sm leading-relaxed text-muted-foreground">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
