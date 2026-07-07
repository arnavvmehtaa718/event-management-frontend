import { respond, uid } from "./client"
import { feedbacks, events } from "./mockDb"
import type { Feedback } from "@/constants/types"

// GET /api/feedback/:eventId
export async function getEventFeedback(eventId: string) {
  return respond(feedbacks.filter((f) => f.eventId === eventId))
}

// POST /api/feedback/:eventId
export async function submitFeedback(input: {
  eventId: string
  userId: string
  userName: string
  rating: number
  review: string
}) {
  const feedback: Feedback = {
    id: uid("f"),
    ...input,
    createdAt: new Date().toISOString(),
  }
  feedbacks.unshift(feedback)
  const event = events.find((e) => e.id === input.eventId)
  if (event) {
    const total = event.rating * event.ratingCount + input.rating
    event.ratingCount += 1
    event.rating = Math.round((total / event.ratingCount) * 10) / 10
  }
  return respond(feedback, "Thanks for your feedback")
}
