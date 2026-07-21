import { Link } from "react-router-dom"
import { Mail } from "lucide-react"
import { GithubIcon, LinkedinIcon } from "@/components/common/SocialIcons"
import { Logo } from "@/components/common/Logo"

const groups = [
  {
    title: "Platform",
    links: [
      { label: "Explore events", to: "/events" },
      { label: "Become an organizer", to: "/register" },
      { label: "Sign in", to: "/login" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "How it works", to: "/about" },
      { label: "About EventHub", to: "/about" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help center", to: "/contact" },
      { label: "Organizer support", to: "/contact" },
      { label: "Report an issue", to: "/contact" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative border-t border-border">
      <div className="shimmer-line absolute top-0 left-0 right-0" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1.8fr]">
          <div className="max-w-sm">
            <Link to="/" className="flex items-center gap-2.5 font-extrabold tracking-tight text-foreground">
              <Logo className="h-8 w-8" />
              <span>event<span className="text-primary">h</span>ub</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              One connected platform for discovering events, seamless registration, QR check-in, and automatic certificates.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <a
                href="https://github.com/arnavvmehtaa718"
                target="_blank"
                rel="noreferrer"
                aria-label="Arnav Mehta on GitHub"
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:text-foreground hover:shadow-lg hover:shadow-primary/5"
              >
                <GithubIcon className="size-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/arnav-mehta-137583329/"
                target="_blank"
                rel="noreferrer"
                aria-label="Arnav Mehta on LinkedIn"
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:text-foreground hover:shadow-lg hover:shadow-primary/5"
              >
                <LinkedinIcon className="size-4" />
              </a>
              <a
                href="mailto:arnavm.396@gmail.com"
                aria-label="Email Arnav Mehta"
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:text-foreground hover:shadow-lg hover:shadow-primary/5"
              >
                <Mail className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {groups.map((group) => (
              <div key={group.title} className="flex flex-col gap-2.5">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">{group.title}</p>
                {group.links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
            <div className="flex flex-col gap-2.5">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">Legal</p>
              <span className="text-sm text-muted-foreground">Privacy</span>
              <span className="text-sm text-muted-foreground">Terms</span>
              <span className="text-sm text-muted-foreground">Cookies</span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-6">
          <p>&copy; {new Date().getFullYear()} EventHub — all rights reserved</p>
          <p>Designed for communities that bring people together.</p>
        </div>
      </div>
    </footer>
  )
}
