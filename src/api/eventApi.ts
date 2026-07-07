import { respond, fail, uid } from "./client"
import { events } from "./mockDb"
import type { EventItem, EventStatus } from "@/constants/types"

export interface EventFilters {
  search?: string
  category?: string
  mode?: string
  city?: string
}

// GET /api/events
export async function getEvents(filters: EventFilters = {}) {
  let result = events.filter((e) => e.status === "PUBLISHED")
  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.tags.some((t) => t.includes(q)),
    )
  }
  if (filters.category && filters.category !== "All") {
    result = result.filter((e) => e.category === filters.category)
  }
  if (filters.mode && filters.mode !== "All") {
    result = result.filter((e) => e.mode === filters.mode)
  }
  return respond(result)
}

// GET /api/events/:id
export async function getEventById(id: string) {
  const event = events.find((e) => e.id === id)
  if (!event) return fail("Event not found")
  event.views += 1
  return respond(event)
}

// GET /api/events/upcoming
export async function getUpcomingEvents() {
  const nowTs = Date.now()
  return respond(
    events
      .filter(
        (e) => e.status === "PUBLISHED" && new Date(e.startDate).getTime() > nowTs,
      )
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      ),
  )
}

// GET /api/events/popular
export async function getPopularEvents() {
  return respond(
    [...events]
      .filter((e) => e.status === "PUBLISHED")
      .sort((a, b) => b.views - a.views)
      .slice(0, 3),
  )
}

// GET /api/organizer/events
export async function getOrganizerEvents(organizerId: string) {
  return respond(events.filter((e) => e.organizerId === organizerId))
}

// POST /api/events
export async function createEvent(
  organizerId: string,
  organizerName: string,
  input: Partial<EventItem>,
) {
  const event: EventItem = {
    id: uid("e"),
    title: input.title ?? "Untitled Event",
    description: input.description ?? "",
    longDescription: input.longDescription ?? input.description ?? "",
    category: (input.category as EventItem["category"]) ?? "Community",
    mode: (input.mode as EventItem["mode"]) ?? "IN_PERSON",
    status: "DRAFT",
    banner: input.banner || "/events/tech-conf.png",
    venue: input.venue ?? "",
    city: input.city ?? "",
    startDate: input.startDate ?? new Date().toISOString(),
    endDate: input.endDate ?? new Date().toISOString(),
    capacity: input.capacity ?? 100,
    registeredCount: 0,
    attendanceCount: 0,
    views: 0,
    price: input.price ?? 0,
    rating: 0,
    ratingCount: 0,
    organizerId,
    organizerName,
    organizerVerified: true,
    tags: input.tags ?? [],
  }
  events.unshift(event)
  return respond(event, "Event created as draft")
}

// PATCH /api/events/:id
export async function updateEvent(id: string, input: Partial<EventItem>) {
  const event = events.find((e) => e.id === id)
  if (!event) return fail("Event not found")
  Object.assign(event, input)
  return respond(event, "Event updated")
}

// PATCH /api/events/:id/publish | /cancel — DELETE /api/events/:id
export async function setEventStatus(id: string, status: EventStatus) {
  const event = events.find((e) => e.id === id)
  if (!event) return fail("Event not found")
  event.status = status
  return respond(event, `Event ${status.toLowerCase()}`)
}

export async function deleteEvent(id: string) {
  const idx = events.findIndex((e) => e.id === id)
  if (idx === -1) return fail("Event not found")
  events.splice(idx, 1)
  return respond(id, "Event deleted")
}
