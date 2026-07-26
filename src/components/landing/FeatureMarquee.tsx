import { Search, Ticket, QrCode, Award, BellRing, BarChart3, CalendarCheck, MessageCircle, ShieldCheck, Users, ScanLine, Sparkles } from "lucide-react"

const FEATURES = [
  { icon: Sparkles, label: "Event Discovery" },
  { icon: Ticket, label: "One-Tap Registration" },
  { icon: QrCode, label: "QR Check-In" },
  { icon: Award, label: "Auto Certificates" },
  { icon: BarChart3, label: "Live Analytics" },
  { icon: MessageCircle, label: "Community Hub" },
  { icon: ShieldCheck, label: "Secure by Design" },
  { icon: Users, label: "Role-Based Access" },
  { icon: ScanLine, label: "Instant Verification" },
]

export default function FeatureMarquee() {
  const loop = [...FEATURES, ...FEATURES]

  return (
    <div className="relative border-t border-border/60 py-8 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10"
        style={{ background: "linear-gradient(to right, var(--background), transparent)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10"
        style={{ background: "linear-gradient(to left, var(--background), transparent)" }}
        aria-hidden="true"
      />
      <div className="marquee-wrap group">
        <div className="marquee-track flex w-max items-center gap-8">
          {loop.map((feat, i) => {
            const Icon = feat.icon
            return (
              <span
                key={i}
                className="flex items-center gap-2.5 whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:[animation-play-state:paused] hover:text-foreground"
              >
                <Icon className="size-4 text-primary" aria-hidden="true" />
                {feat.label}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
