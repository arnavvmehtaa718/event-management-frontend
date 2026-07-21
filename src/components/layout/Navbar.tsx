"use client"

import { useState, useEffect } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { logout } from "@/features/auth/authSlice"
import { Button } from "@/components/common/ui"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { Logo } from "@/components/common/Logo"
import clsx from "clsx"

const dashboardPath: Record<string, string> = {
  USER: "/user/dashboard",
  ORGANIZER: "/organizer/dashboard",
  ADMIN: "/admin/dashboard",
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const user = useAppSelector((s) => s.auth.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const links = [
    { to: "/", label: "home" },
    { to: "/events", label: "events" },
    { to: "/about", label: "about" },
    { to: "/contact", label: "contact" },
  ]

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 md:px-6">
      <nav
        className={clsx(
          "mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 rounded-2xl border px-3 shadow-lg shadow-black/5 backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 md:px-4",
          scrolled
            ? "border-border/60 bg-card/80"
            : "border-transparent bg-transparent"
        )}
        aria-label="Main navigation"
      >
        <Link to="/" className="flex items-center gap-2.5 font-extrabold tracking-tight text-foreground">
          <Logo className="h-8 w-8" />
          <span>
            event<span className="text-primary">h</span>ub
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                clsx(
                  "rounded-full px-3.5 py-1.5 font-mono text-sm transition-colors",
                  isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {user ? (
            <>
              <Button variant="outline" size="sm" onClick={() => navigate(dashboardPath[user.role])}>
                <LayoutDashboard className="size-4" aria-hidden="true" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  dispatch(logout())
                  navigate("/")
                }}
              >
                <LogOut className="size-4" aria-hidden="true" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                Log in
              </Button>
              <Button size="sm" onClick={() => navigate("/register")}>
                Sign up free
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="rounded-lg p-2 text-foreground"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="mx-auto mt-2 max-w-7xl rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    "rounded-lg px-3 py-2 font-mono text-sm",
                    isActive ? "bg-secondary text-foreground" : "text-muted-foreground",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              {user ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => { setOpen(false); navigate(dashboardPath[user.role]) }}>
                    Dashboard
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { dispatch(logout()); setOpen(false); navigate("/") }}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => { setOpen(false); navigate("/login") }}>
                    Log in
                  </Button>
                  <Button size="sm" onClick={() => { setOpen(false); navigate("/register") }}>
                    Sign up free
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
