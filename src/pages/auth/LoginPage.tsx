"use client"

import { useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarDays } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { login, clearError } from "@/features/auth/authSlice"
import { pushToast } from "@/features/toast/toastSlice"
import { Button, Input, Card } from "@/components/common/ui"

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormValues = z.infer<typeof schema>

const demoAccounts = [
  { role: "User", email: "user@demo.com" },
  { role: "Organizer", email: "organizer@demo.com" },
  { role: "Admin", email: "admin@demo.com" },
]

function dashboardPathFor(role: string) {
  if (role === "ADMIN") return "/admin"
  if (role === "ORGANIZER") return "/organizer"
  return "/dashboard"
}

const rolePrefix: Record<string, string> = {
  USER: "/user",
  ORGANIZER: "/organizer",
  ADMIN: "/admin",
}

function safeRedirect(from: string | undefined, role: string) {
  if (!from) return dashboardPathFor(role)
  const dashboardPrefixes = Object.values(rolePrefix)
  const isDashboardPath = dashboardPrefixes.some((p) => from.startsWith(p))
  // Only honor dashboard deep-links that belong to this user's role
  if (isDashboardPath && !from.startsWith(rolePrefix[role] ?? "")) {
    return dashboardPathFor(role)
  }
  return from
}

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading, error } = useAppSelector((s) => s.auth)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      const from = (location.state as { from?: string } | null)?.from
      navigate(safeRedirect(from, user.role), { replace: true })
    }
  }, [user, navigate, location.state])

  const onSubmit = async (values: FormValues) => {
    const result = await dispatch(login(values))
    if (login.fulfilled.match(result)) {
      dispatch(pushToast({ type: "success", message: `Welcome back, ${result.payload.user.name}!` }))
    }
  }

  const fillDemo = (email: string) => {
    setValue("email", email)
    setValue("password", "password123")
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-2">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <CalendarDays className="size-8" aria-hidden="true" />
            <span className="text-2xl font-bold text-foreground">EventHub</span>
          </Link>
          <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
        </div>

        <Card className="p-6 sm:p-8">
          <h1 className="mb-6 text-xl font-bold text-foreground">Sign in</h1>

          {error && (
            <div role="alert" className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register("password")}
            />
            <Button type="submit" loading={loading} className="mt-2 w-full">
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {"Don't have an account? "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create one
            </Link>
          </p>
        </Card>

        <Card className="mt-4 p-4">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Demo accounts (password: password123)
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {demoAccounts.map((d) => (
              <Button key={d.email} variant="outline" size="sm" onClick={() => fillDemo(d.email)}>
                {d.role}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </main>
  )
}
