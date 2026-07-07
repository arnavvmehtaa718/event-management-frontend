import { respond, fail } from "./client"
import { users, events, registrations, certificates } from "./mockDb"

// GET /api/admin/users
export async function getAllUsers() {
  return respond([...users])
}

// PATCH /api/admin/verify-organizer/:id
export async function verifyOrganizer(id: string) {
  const user = users.find((u) => u.id === id && u.role === "ORGANIZER")
  if (!user) return fail("Organizer not found")
  user.verified = true
  return respond(user, "Organizer verified")
}

// PATCH /api/admin/block-user/:id
export async function toggleBlockUser(id: string) {
  const user = users.find((u) => u.id === id)
  if (!user) return fail("User not found")
  user.blocked = !user.blocked
  return respond(user, user.blocked ? "User blocked" : "User unblocked")
}

// GET /api/admin/dashboard
export async function getAdminStats() {
  return respond({
    totalUsers: users.filter((u) => u.role === "USER").length,
    totalOrganizers: users.filter((u) => u.role === "ORGANIZER").length,
    totalEvents: events.length,
    publishedEvents: events.filter((e) => e.status === "PUBLISHED").length,
    totalRegistrations: registrations.filter((r) => r.status === "CONFIRMED")
      .length,
    certificatesIssued: certificates.length,
  })
}

// GET /api/admin/events (all statuses)
export async function getAllEvents() {
  return respond([...events])
}
