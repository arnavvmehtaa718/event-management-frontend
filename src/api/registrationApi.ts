import { respond, fail, uid } from "./client"
import { registrations, events } from "./mockDb"
import type { Registration } from "@/constants/types"

// POST /api/registrations/:eventId
export async function registerForEvent(eventId: string, userId: string) {
  const event = events.find((e) => e.id === eventId)
  if (!event) return fail("Event not found")
  if (
    registrations.some(
      (r) =>
        r.eventId === eventId && r.userId === userId && r.status === "CONFIRMED",
    )
  ) {
    return fail("You are already registered for this event")
  }
  if (event.registeredCount >= event.capacity) {
    return fail("This event is full")
  }
  const id = uid("r")
  const reg: Registration = {
    id,
    eventId,
    userId,
    ticketNumber: `EVT-2026-${String(Math.floor(Math.random() * 900000) + 100000)}`,
    qrValue: `REG:${id}:${eventId}:${userId}`,
    status: "CONFIRMED",
    attendance: "NOT_MARKED",
    registeredAt: new Date().toISOString(),
  }
  registrations.push(reg)
  event.registeredCount += 1
  return respond(reg, "Registration successful — your QR ticket is ready")
}

// DELETE /api/registrations/:eventId
export async function cancelRegistration(eventId: string, userId: string) {
  const reg = registrations.find(
    (r) => r.eventId === eventId && r.userId === userId && r.status === "CONFIRMED",
  )
  if (!reg) return fail("Registration not found")
  reg.status = "CANCELLED"
  const event = events.find((e) => e.id === eventId)
  if (event) event.registeredCount -= 1
  return respond(reg, "Registration cancelled")
}

// GET /api/registrations/my-events
export async function getMyRegistrations(userId: string) {
  return respond(registrations.filter((r) => r.userId === userId))
}

// GET /api/organizer/registrations/:eventId
export async function getEventRegistrations(eventId: string) {
  return respond(registrations.filter((r) => r.eventId === eventId))
}
