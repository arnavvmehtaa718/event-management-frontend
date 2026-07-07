import { respond, fail, uid } from "./client"
import { registrations, events, certificates, users, notifications } from "./mockDb"

// POST /api/attendance/verify — QR value or ticket number
export async function verifyAttendance(qrOrTicket: string) {
  const reg = registrations.find(
    (r) => r.qrValue === qrOrTicket.trim() || r.ticketNumber === qrOrTicket.trim(),
  )
  if (!reg) return fail("Invalid QR code — registration not found")
  if (reg.status !== "CONFIRMED") return fail("This registration was cancelled")
  if (reg.attendance === "PRESENT" || reg.attendance === "LATE") {
    return fail("Already checked in")
  }
  reg.attendance = "PRESENT"
  const event = events.find((e) => e.id === reg.eventId)
  if (event) event.attendanceCount += 1

  // Automatic certificate generation on PRESENT
  const user = users.find((u) => u.id === reg.userId)
  certificates.push({
    id: uid("c"),
    eventId: reg.eventId,
    eventTitle: event?.title ?? "Event",
    userId: reg.userId,
    userName: user?.name ?? "Attendee",
    issuedAt: new Date().toISOString(),
    certificateNumber: `CERT-2026-${String(Math.floor(Math.random() * 90000) + 10000)}`,
  })
  notifications.unshift({
    id: uid("n"),
    userId: reg.userId,
    type: "CERTIFICATE",
    title: "Certificate ready",
    message: `Your certificate for ${event?.title ?? "the event"} is ready.`,
    read: false,
    createdAt: new Date().toISOString(),
  })

  return respond(
    { registration: reg, attendeeName: user?.name ?? "Attendee" },
    "Checked in — attendance marked PRESENT",
  )
}

// GET /api/attendance/event/:eventId
export async function getEventAttendance(eventId: string) {
  return respond(registrations.filter((r) => r.eventId === eventId))
}
