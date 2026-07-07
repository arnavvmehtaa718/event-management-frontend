import { respond } from "./client"
import { notifications } from "./mockDb"

// GET /api/notifications
export async function getNotifications(userId: string) {
  return respond(notifications.filter((n) => n.userId === userId))
}

// PATCH /api/notifications/read/:id
export async function markRead(id: string) {
  const n = notifications.find((x) => x.id === id)
  if (n) n.read = true
  return respond(n ?? null)
}

// PATCH /api/notifications/read-all
export async function markAllRead(userId: string) {
  notifications.forEach((n) => {
    if (n.userId === userId) n.read = true
  })
  return respond(true, "All notifications marked read")
}
