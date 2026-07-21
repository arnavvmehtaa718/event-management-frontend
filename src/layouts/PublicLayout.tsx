import { Outlet, useNavigate } from "react-router-dom"
import { Footer } from "@/components/layout/Footer"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { Button } from "@/components/common/ui"
import { useAppSelector } from "@/app/store"

const dashboardPath: Record<string, string> = {
  USER: "/user/dashboard",
  ORGANIZER: "/organizer/dashboard",
  ADMIN: "/admin/dashboard",
}

export default function PublicLayout() {
  const user = useAppSelector((s) => s.auth.user)
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top-right actions (theme toggle + auth) */}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex items-center gap-2 md:right-6 md:top-6">
        <div className="pointer-events-auto">
          <ThemeToggle />
        </div>
        {user ? (
          <div className="pointer-events-auto">
            <Button variant="outline" size="sm" onClick={() => navigate(dashboardPath[user.role])}>
              Dashboard
            </Button>
          </div>
        ) : (
          <>
            <div className="pointer-events-auto">
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                Log in
              </Button>
            </div>
            <div className="pointer-events-auto">
              <Button size="sm" onClick={() => navigate("/register")}>
                Sign up
              </Button>
            </div>
          </>
        )}
      </div>

      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
