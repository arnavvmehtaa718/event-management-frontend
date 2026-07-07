import { respond, fail, uid } from "./client"
import { users, demoAccounts } from "./mockDb"
import type { User } from "@/constants/types"

// POST /api/auth/login
export async function login(email: string, password: string) {
  const account = demoAccounts.find((a) => a.email === email)
  const user = users.find((u) => u.email === email)
  if (!user || (account && account.password !== password)) {
    return fail("Invalid email or password")
  }
  if (user.blocked) return fail("This account has been blocked by an admin")
  const token = `mock-jwt-${user.id}-${Date.now()}`
  return respond({ user, token }, "Login successful")
}

// POST /api/auth/register
export async function register(input: {
  name: string
  email: string
  password: string
  role: "USER" | "ORGANIZER"
  organization?: string
}) {
  if (users.some((u) => u.email === input.email)) {
    return fail("An account with this email already exists")
  }
  const user: User = {
    id: uid("u"),
    name: input.name,
    email: input.email,
    role: input.role,
    organization: input.organization,
    verified: input.role === "ORGANIZER" ? false : undefined,
    joinedAt: new Date().toISOString(),
  }
  users.push(user)
  const token = `mock-jwt-${user.id}-${Date.now()}`
  return respond({ user, token }, "Registration successful")
}

// GET /api/auth/me
export async function me(token: string) {
  const id = token.split("-")[2]
  const user = users.find((u) => u.id === id)
  if (!user) return fail("Session expired")
  return respond(user)
}
