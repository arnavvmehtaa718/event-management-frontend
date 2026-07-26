import { Link } from "react-router-dom"
import { CalendarDays, MapPin, Users, Star, BadgeCheck, ArrowUpRight } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import dayjs from "dayjs"
import type { EventItem } from "@/constants/types"
import { Badge, CardGlow } from "@/components/common/ui"
import { FallbackImage } from "@/components/common/FallbackImage"
import clsx from "clsx"

const modeLabel = { IN_PERSON: "In person", ONLINE: "Online", HYBRID: "Hybrid" }

export function EventCard({ event, featured = false }: { event: EventItem; featured?: boolean }) {
  const spotsLeft = event.capacity - event.registeredCount
  const isPast = new Date(event.endDate).getTime() < Date.now()
  const reduce = useReducedMotion()

  return (
    <CardGlow className={clsx("group rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5", featured && "lg:col-span-2")}>
      <Link to={`/events/${event.id}`} className="flex h-full flex-col">
        <div className="relative aspect-video overflow-hidden">
          <FallbackImage
            src={event.banner}
            alt={event.title}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge className="border border-white/20 bg-black/40 text-white backdrop-blur-md">{event.category.toLowerCase()}</Badge>
            <Badge className="border border-white/20 bg-black/40 text-white/80 backdrop-blur-md">{modeLabel[event.mode].toLowerCase()}</Badge>
          </div>
          <div className="absolute right-3 top-3">
            {event.price === 0 ? (
              <Badge variant="success" className="bg-success/90 text-success-foreground shadow-lg shadow-success/20">free</Badge>
            ) : (
              <Badge className="border border-white/20 bg-black/40 text-white backdrop-blur-md">{"₹"}{event.price}</Badge>
            )}
          </div>
          <div className="absolute bottom-3 right-3 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30">
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div>
            <h3 className="text-lg font-extrabold leading-snug tracking-tight text-foreground text-balance group-hover:text-primary transition-colors duration-200">{event.title}</h3>
            <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
              {event.organizerName}
              {event.organizerVerified && (
                <BadgeCheck className="size-3.5 text-primary" aria-label="Verified organizer" />
              )}
            </p>
          </div>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {event.description}
          </p>
          <div className="mt-auto flex flex-col gap-2 font-mono text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <CalendarDays className="size-3.5 text-primary" aria-hidden="true" />
              {dayjs(event.startDate).format("ddd, MMM D, YYYY · h:mm A")}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="size-3.5 text-primary" aria-hidden="true" />
              {event.venue}, {event.city}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="size-3.5" aria-hidden="true" />
              {event.registeredCount.toLocaleString()} registered
            </span>
            {event.rating > 0 && (
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <Star className="size-3.5 fill-warning text-warning" aria-hidden="true" />
                {event.rating}
              </span>
            )}
            {!isPast && spotsLeft > 0 && spotsLeft <= 20 && (
              <span className="relative flex items-center gap-1">
                <span className="absolute inline-flex size-2 animate-ping rounded-full bg-warning/60" />
                <Badge variant="warning">{spotsLeft} spots left</Badge>
              </span>
            )}
            {!isPast && spotsLeft <= 0 && <Badge variant="destructive">Full</Badge>}
            {isPast && <Badge variant="outline">Ended</Badge>}
          </div>
        </div>
      </Link>
    </CardGlow>
  )
}
