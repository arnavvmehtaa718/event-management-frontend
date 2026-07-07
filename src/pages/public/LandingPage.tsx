"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  QrCode,
  Award,
  BellRing,
  BarChart3,
  Search,
  CalendarCheck,
} from "lucide-react"
import { getUpcomingEvents, getPopularEvents } from "@/api/eventApi"
import type { EventItem } from "@/constants/types"
import { EventCard } from "@/components/cards/EventCard"
import { Button, Skeleton } from "@/components/common/ui"

const features = [
  {
    icon: Search,
    title: "Discover events",
    description:
      "Search and filter events by category, city, and mode. Everything in one place instead of scattered group chats.",
  },
  {
    icon: CalendarCheck,
    title: "One-tap registration",
    description:
      "Register in seconds and instantly receive a ticket with a unique QR code — no more Google Forms.",
  },
  {
    icon: QrCode,
    title: "QR check-in",
    description:
      "Organizers scan your QR at the door. Attendance is tracked automatically and accurately.",
  },
  {
    icon: Award,
    title: "Automatic certificates",
    description:
      "Attend an event and your certificate is generated automatically — download it anytime.",
  },
  {
    icon: BellRing,
    title: "Smart notifications",
    description:
      "Registration confirmations, reminders, venue changes, and certificate alerts in one inbox.",
  },
  {
    icon: BarChart3,
    title: "Real-time analytics",
    description:
      "Organizers get live dashboards for registrations, attendance, ratings, and views.",
  },
]

const steps = [
  { step: "01", title: "Create an account", text: "Sign up free as an attendee or a verified organization." },
  { step: "02", title: "Discover & register", text: "Find events you love and register with one tap." },
  { step: "03", title: "Check in with QR", text: "Show your QR ticket at the venue for instant check-in." },
  { step: "04", title: "Get your certificate", text: "Certificates are issued automatically after attendance." },
]

export default function LandingPage() {
  const [upcoming, setUpcoming] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getUpcomingEvents(), getPopularEvents()])
      .then(([up]) => setUpcoming(up.data.slice(0, 3)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="bg-sidebar text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:px-6 md:py-24">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-sidebar-accent bg-sidebar-accent/50 px-3 py-1 text-xs font-semibold text-sidebar-foreground">
              Events, tickets, attendance & certificates — unified
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-balance md:text-5xl">
              Every event.
              <br />
              One platform.
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-sidebar-foreground text-pretty">
              Stop juggling WhatsApp groups, Google Forms, and spreadsheets.
              EventHub lets organizations run events end to end while attendees
              discover, register, and collect certificates effortlessly.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/events">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore events
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-sidebar-accent bg-transparent text-white hover:bg-sidebar-accent sm:w-auto"
                >
                  Host an event
                </Button>
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-sidebar-accent pt-6">
              {[
                ["4,200+", "Events hosted"],
                ["58k+", "Registrations"],
                ["31k+", "Certificates issued"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="sr-only">{label}</dt>
                  <dd className="text-2xl font-extrabold">{value}</dd>
                  <dd className="text-xs text-sidebar-foreground">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative hidden md:block">
            <img
              src="/events/tech-conf.png"
              alt="A packed technology conference hosted on EventHub"
              className="rounded-2xl border border-sidebar-accent object-cover shadow-2xl"
            />
            <div className="absolute -bottom-5 -left-5 flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-xl">
              <span className="flex size-10 items-center justify-center rounded-lg bg-success/10 text-success">
                <QrCode className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">Checked in</p>
                <p className="text-xs text-muted-foreground">Attendance marked PRESENT</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
              Happening soon
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Don&apos;t miss out — these events are filling fast.
            </p>
          </div>
          <Link to="/events" className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:flex">
            View all events
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl text-balance">
              Everything you need to run and attend events
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              From discovery to certificates, the whole lifecycle lives in one platform.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-background p-6">
                <span className="mb-4 flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <f.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="font-bold text-foreground">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h2 className="mb-12 text-center text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
          How it works
        </h2>
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li key={s.step} className="relative">
              <span className="font-mono text-4xl font-bold text-primary/20">{s.step}</span>
              <h3 className="mt-2 font-bold text-foreground">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground">
          <h2 className="max-w-xl text-2xl font-extrabold tracking-tight md:text-3xl text-balance">
            Ready to bring your community together?
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-primary-foreground/85 text-pretty">
            Create your organization account, publish your first event, and start
            scanning attendees in minutes.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary">
              Get started free
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
