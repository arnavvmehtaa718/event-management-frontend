"use client"

import { useCallback, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  CalendarDays,
  MapPin,
  Users,
  Star,
  BadgeCheck,
  Eye,
  Ticket,
  ArrowLeft,
  QrCode,
} from "lucide-react"
import dayjs from "dayjs"
import { QRCodeSVG } from "qrcode.react"
import { getEventById } from "@/api/eventApi"
import { registerForEvent, getMyRegistrations } from "@/api/registrationApi"
import type { EventItem, Registration } from "@/constants/types"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { pushToast } from "@/features/toast/toastSlice"
import { Badge, Button, Card, Loader, EmptyState } from "@/components/common/ui"
import { Modal } from "@/components/common/Modal"
import { FallbackImage } from "@/components/common/FallbackImage"

const modeLabel = { IN_PERSON: "In person", ONLINE: "Online", HYBRID: "Hybrid" }

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)

  const [event, setEvent] = useState<EventItem | null>(null)
  const [myReg, setMyReg] = useState<Registration | null>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [ticketOpen, setTicketOpen] = useState(false)

  const load = useCallback(async () => {
    if (!id) return
    try {
      const eventRes = await getEventById(id)
      setEvent(eventRes.data)
      if (user) {
        const regs = await getMyRegistrations(user.id)
        setMyReg(
          regs.data.find((r) => r.eventId === id && r.status === "CONFIRMED") ?? null,
        )
      }
    } finally {
      setLoading(false)
    }
  }, [id, user])

  useEffect(() => {
    load()
  }, [load])

  if (loading) return <Loader label="Loading event..." />
  if (!event) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          title="Event not found"
          description="This event may have been removed or unpublished."
          action={
            <Link to="/events">
              <Button variant="outline">Browse events</Button>
            </Link>
          }
        />
      </div>
    )
  }

  const isPast = new Date(event.endDate).getTime() < Date.now()
  const isFull = event.registeredCount >= event.capacity

  const handleRegister = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/events/${event.id}` } })
      return
    }
    setRegistering(true)
    try {
      const res = await registerForEvent(event.id, user.id)
      setMyReg(res.data)
      setEvent({ ...event, registeredCount: event.registeredCount + 1 })
      dispatch(pushToast({ type: "success", message: res.message }))
      setConfirmOpen(false)
      setTicketOpen(true)
    } catch (e) {
      dispatch(pushToast({ type: "error", message: (e as Error).message }))
    } finally {
      setRegistering(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <Link
        to="/events"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to events
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl">
            <FallbackImage src={event.banner} alt={event.title} className="aspect-video w-full object-cover" />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge variant="accent">{event.category}</Badge>
            <Badge>{modeLabel[event.mode]}</Badge>
            {isPast && <Badge variant="outline">Ended</Badge>}
            {event.rating > 0 && (
              <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
                <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
                {event.rating}
                <span className="font-normal text-muted-foreground">({event.ratingCount} reviews)</span>
              </span>
            )}
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Eye className="size-4" aria-hidden="true" />
              {event.views.toLocaleString()} views
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground text-balance">
            {event.title}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            Hosted by <span className="font-semibold text-foreground">{event.organizerName}</span>
            {event.organizerVerified && (
              <BadgeCheck className="size-4 text-primary" aria-label="Verified organizer" />
            )}
          </p>

          <div className="prose-sm mt-6 max-w-none">
            <h2 className="text-lg font-bold text-foreground">About this event</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
              {event.longDescription}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {event.tags.map((t) => (
              <Badge key={t} variant="outline">#{t}</Badge>
            ))}
          </div>


        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="p-6">
            <p className="text-2xl font-extrabold text-foreground">
              {event.price === 0 ? "Free" : `₹${event.price}`}
            </p>
            <div className="mt-5 flex flex-col gap-4 border-t border-border pt-5 text-sm">
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-foreground">
                    {dayjs(event.startDate).format("dddd, MMMM D, YYYY")}
                  </p>
                  <p className="text-muted-foreground">
                    {dayjs(event.startDate).format("h:mm A")} – {dayjs(event.endDate).format("h:mm A")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-foreground">{event.venue}</p>
                  <p className="text-muted-foreground">{event.city}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-foreground">
                    {event.registeredCount.toLocaleString()} / {event.capacity.toLocaleString()} registered
                  </p>
                  <div className="mt-1.5 h-1.5 w-40 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.min(100, (event.registeredCount / event.capacity) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              {myReg ? (
                <Button className="w-full" variant="success" onClick={() => setTicketOpen(true)}>
                  <QrCode className="size-4" aria-hidden="true" />
                  View my ticket
                </Button>
              ) : isPast ? (
                <Button className="w-full" disabled>
                  Event has ended
                </Button>
              ) : isFull ? (
                <Button className="w-full" disabled>
                  Event is full
                </Button>
              ) : (
                <Button className="w-full" onClick={() => (user ? setConfirmOpen(true) : navigate("/login", { state: { from: `/events/${event.id}` } }))}>
                  <Ticket className="size-4" aria-hidden="true" />
                  Register now
                </Button>
              )}
              {!user && !isPast && !isFull && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  You&apos;ll be asked to log in first.
                </p>
              )}
            </div>
          </Card>
        </aside>
      </div>

      {/* Confirm registration modal */}
      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm registration">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Register for <span className="font-semibold text-foreground">{event.title}</span> on{" "}
          {dayjs(event.startDate).format("MMM D, YYYY")}? Your QR ticket will be generated instantly.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button loading={registering} onClick={handleRegister}>
            Confirm registration
          </Button>
        </div>
      </Modal>

      {/* Ticket modal */}
      <Modal open={ticketOpen} onClose={() => setTicketOpen(false)} title="Your ticket">
        {myReg && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-xl border border-border bg-white p-4">
              <QRCodeSVG value={myReg.qrValue} size={180} aria-label="Ticket QR code" />
            </div>
            <div>
              <p className="font-mono text-sm font-semibold text-foreground">{myReg.ticketNumber}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Show this QR code at the venue for check-in.
              </p>
            </div>
            <Link to="/user/registrations" className="w-full">
              <Button variant="outline" className="w-full">
                View all my registrations
              </Button>
            </Link>
          </div>
        )}
      </Modal>
    </div>
  )
}
