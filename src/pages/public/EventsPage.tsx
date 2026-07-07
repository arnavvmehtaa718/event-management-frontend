"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, SlidersHorizontal, CalendarX } from "lucide-react"
import { getEvents } from "@/api/eventApi"
import type { EventItem } from "@/constants/types"
import { EventCard } from "@/components/cards/EventCard"
import { Select, Skeleton, EmptyState } from "@/components/common/ui"

const categories = ["All", "Technology", "Business", "Education", "Health", "Arts", "Sports", "Community"]
const modes = [
  { value: "All", label: "All modes" },
  { value: "IN_PERSON", label: "In person" },
  { value: "ONLINE", label: "Online" },
  { value: "HYBRID", label: "Hybrid" },
]

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [mode, setMode] = useState("All")
  const [sort, setSort] = useState<"date" | "popular" | "rating">("date")

  useEffect(() => {
    setLoading(true)
    getEvents()
      .then((res) => setEvents(res.data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let result = events
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q) ||
          e.tags.some((t) => t.includes(q)),
      )
    }
    if (category !== "All") result = result.filter((e) => e.category === category)
    if (mode !== "All") result = result.filter((e) => e.mode === mode)
    return [...result].sort((a, b) => {
      if (sort === "popular") return b.views - a.views
      if (sort === "rating") return b.rating - a.rating
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    })
  }, [events, search, category, mode, sort])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Explore events</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {events.length} published events across every category.
        </p>
      </div>

      {/* Search + filters */}
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, cities, or tags..."
            aria-label="Search events"
            className="h-11 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-2 focus:outline-offset-1 focus:outline-ring"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SlidersHorizontal className="hidden size-4 text-muted-foreground lg:block" aria-hidden="true" />
          <Select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-auto min-w-36">
            {categories.map((c) => (
              <option key={c} value={c}>{c === "All" ? "All categories" : c}</option>
            ))}
          </Select>
          <Select aria-label="Filter by mode" value={mode} onChange={(e) => setMode(e.target.value)} className="w-auto min-w-32">
            {modes.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </Select>
          <Select aria-label="Sort events" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="w-auto min-w-32">
            <option value="date">Soonest first</option>
            <option value="popular">Most popular</option>
            <option value="rating">Top rated</option>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<CalendarX className="size-10" aria-hidden="true" />}
          title="No events match your filters"
          description="Try a different search term or clear the category and mode filters."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  )
}
