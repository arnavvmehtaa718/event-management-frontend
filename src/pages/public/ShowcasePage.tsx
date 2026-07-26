import { useRef, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Play,
  Search,
  CalendarCheck,
  Ticket,
  QrCode,
  Award,
  MessageCircle,
  Rocket,
  ChevronRight,
} from "lucide-react"
import { Logo } from "@/components/common/Logo"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { useTheme } from "@/hooks/useTheme"

const steps = [
  { icon: Rocket, label: "Discover", desc: "Browse curated events on the homepage" },
  { icon: Search, label: "Search", desc: "Filter by category, date, or location" },
  { icon: CalendarCheck, label: "Details", desc: "View full event info and ticket tiers" },
  { icon: ChevronRight, label: "Confirm", desc: "Instant registration with confirmation" },
  { icon: Ticket, label: "Ticket", desc: "QR-coded digital ticket, ready to go" },
  { icon: QrCode, label: "Check-in", desc: "Scan & go — no lines, no paper" },
  { icon: Award, label: "Certificate", desc: "Auto-issued proof of participation" },
  { icon: MessageCircle, label: "Community", desc: "Chat with fellow attendees live" },
]

export default function ShowcasePage() {
  const demoRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [inView, setInView] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe?.contentWindow) return
    const send = () => {
      try { iframe.contentWindow!.postMessage({ theme }, "*") } catch {}
    }
    send()
    iframe.addEventListener("load", send)
    return () => iframe.removeEventListener("load", send)
  }, [theme])

  useEffect(() => {
    const el = demoRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md md:px-6"
      >
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Logo className="size-7" />
            <span className="text-sm font-bold tracking-tight text-foreground">
              event<span className="text-primary">h</span>ub
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
            <Play className="size-3" aria-hidden="true" />
            Live Demo
          </span>
          <ThemeToggle />
        </div>
      </motion.header>

      {/* Split Layout */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* LHS — Info Panel */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex w-full flex-col gap-8 px-6 py-10 lg:w-[380px] xl:w-[420px] lg:border-r lg:border-border lg:px-8 lg:py-10 xl:px-10"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              EventHub
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Walk through the full user journey — from discovering an event to
              checking in and receiving your certificate.
            </p>
          </div>

          {/* Journey Steps */}
          <div className="space-y-1">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground">
                      <span className="font-mono text-[10px] text-muted-foreground mr-1.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {step.label}
                    </div>
                    <div className="text-xs text-muted-foreground/70 truncate">
                      {step.desc}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-auto pt-4 hidden lg:block">
            <p className="font-mono text-[11px] text-muted-foreground/50">
              Auto-playing demo · Hover to pause
            </p>
          </div>
        </motion.aside>

        {/* RHS — Live Demo */}
        <motion.main
          ref={demoRef}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-1 items-center justify-center px-4 py-6 md:px-6 md:py-8 lg:py-10"
        >
          <div className="relative w-full max-w-[1000px] overflow-hidden rounded-2xl border border-border shadow-2xl shadow-black/20">
            {inView ? (
              <iframe
                ref={iframeRef}
                src="/eventhub-showcase.html"
                title="EventHub Product Showcase"
                className="h-[400px] w-full border-0 sm:h-[460px] md:h-[520px] lg:h-full lg:min-h-[480px]"
                allow="autoplay"
              />
            ) : (
              <div className="flex h-[400px] w-full items-center justify-center bg-muted/30 sm:h-[460px] md:h-[520px] lg:h-full lg:min-h-[480px]">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Play className="size-8 animate-pulse" />
                  <span className="text-xs font-mono">Loading demo…</span>
                </div>
              </div>
            )}
          </div>
        </motion.main>
      </div>
    </div>
  )
}
