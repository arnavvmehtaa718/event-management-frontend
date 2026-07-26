import {
  Search,
  Ticket,
  QrCode,
  Award,
  Users,
  type LucideIcon,
} from "lucide-react"

export interface PlanetDef {
  id: number
  key: string
  title: string
  subtitle: string
  icon: LucideIcon
  description: string
  features: string[]
  cta: string
  ctaLink: string
  color: string
  glowColor: string
  accentColor: string
  position: [number, number, number]
  orbitRadius: number
  orbitSpeed: number
  planetScale: number
}

export const PLANETS: PlanetDef[] = [
  {
    id: 0,
    key: "discovery",
    title: "Discovery",
    subtitle: "Find what moves you",
    icon: Search,
    description:
      "Smart search that understands intent. Filter by category, city, format, or let our recommendation engine surface events you'll love.",
    features: [
      "Natural language event search",
      "Filter by category, city & mode",
      "AI-powered recommendations",
      "Online, offline & hybrid events",
    ],
    cta: "Explore events",
    ctaLink: "/events",
    color: "#FFD54A",
    glowColor: "rgba(255,213,74,0.4)",
    accentColor: "#FFECB3",
    position: [0, 0, 0],
    orbitRadius: 1.8,
    orbitSpeed: 0.25,
    planetScale: 1.0,
  },
  {
    id: 1,
    key: "registration",
    title: "Registration",
    subtitle: "One tap, you're in",
    icon: Ticket,
    description:
      "Register in one tap. Confirmation email, calendar invite, and QR ticket — all delivered instantly. No more Google Forms.",
    features: [
      "One-tap registration",
      "Instant email confirmation",
      "Calendar invite included",
      "QR ticket issued automatically",
    ],
    cta: "Start registering",
    ctaLink: "/events",
    color: "#4ADE80",
    glowColor: "rgba(74,222,128,0.4)",
    accentColor: "#BBF7D0",
    position: [3.5, 1.2, -18],
    orbitRadius: 1.5,
    orbitSpeed: 0.3,
    planetScale: 0.95,
  },
  {
    id: 2,
    key: "checkin",
    title: "QR Check-in",
    subtitle: "Scan. Verify. Done.",
    icon: QrCode,
    description:
      "Organizers scan your QR at entry. Attendance tracked in real-time with zero manual work. Seamless, instant, verifiable.",
    features: [
      "QR scan at entry",
      "Instant attendance marking",
      "Real-time organizer dashboard",
      "Zero manual data entry",
    ],
    cta: "See how it works",
    ctaLink: "/about",
    color: "#60A5FA",
    glowColor: "rgba(96,165,250,0.4)",
    accentColor: "#BFDBFE",
    position: [-2.5, -0.8, -36],
    orbitRadius: 1.6,
    orbitSpeed: 0.28,
    planetScale: 1.05,
  },
  {
    id: 3,
    key: "certificate",
    title: "Certificate",
    subtitle: "Automatically rewarded",
    icon: Award,
    description:
      "Auto-generated after attendance. Verified, shareable, and downloadable.",
    features: [
      "Auto-generated certificates",
      "Tamper-proof verification",
      "Shareable & downloadable",
      "Digital credential badges",
    ],
    cta: "View certificates",
    ctaLink: "/user/certificates",
    color: "#F59E0B",
    glowColor: "rgba(245,158,11,0.4)",
    accentColor: "#FDE68A",
    position: [2, 1.5, -54],
    orbitRadius: 1.4,
    orbitSpeed: 0.32,
    planetScale: 0.9,
  },
  {
    id: 4,
    key: "community",
    title: "Community",
    subtitle: "Connected forever",
    icon: Users,
    description:
      "Stay connected with attendees, organizers, and speakers. Network, share, and build lasting relationships beyond the event.",
    features: [
      "Attendee networking",
      "Post-event discussions",
      "Community feeds & updates",
      "Speaker connections",
    ],
    cta: "Join community",
    ctaLink: "/about",
    color: "#C084FC",
    glowColor: "rgba(192,132,252,0.4)",
    accentColor: "#E9D5FF",
    position: [-3, -0.5, -72],
    orbitRadius: 1.7,
    orbitSpeed: 0.22,
    planetScale: 1.0,
  },
]

export const CAMERA_START_Z = 12
export const CAMERA_END_Z = -80
export const PLANET_SPACING = 18
