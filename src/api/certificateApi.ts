import { respond } from "./client"
import { certificates } from "./mockDb"

// GET /api/certificates/my-certificates
export async function getMyCertificates(userId: string) {
  return respond(certificates.filter((c) => c.userId === userId))
}

// GET /api/certificates (organizer/admin view)
export async function getAllCertificates() {
  return respond([...certificates])
}
