"use client"

import { useState } from "react"
import useSWR from "swr"
import dayjs from "dayjs"
import { QrCode, UserCheck, CheckCircle2, XCircle } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import * as eventApi from "@/api/eventApi"
import * as attendanceApi from "@/api/attendanceApi"
import * as adminApi from "@/api/adminApi"
import { pushToast } from "@/features/toast/toastSlice"
import { PageHeader } from "@/components/common/PageHeader"
import { Card, Button, Input, Select, Badge, Loader, EmptyState } from "@/components/common/ui"
import type { AttendanceStatus } from "@/constants/types"

const attendanceBadge: Record<AttendanceStatus, { label: string; variant: "success" | "warning" | "destructive" | "outline" }> = {
  PRESENT: { label: "Present", variant: "success" },
  LATE: { label: "Late", variant: "warning" },
  ABSENT: { label: "Absent", variant: "destructive" },
  NOT_MARKED: { label: "Not marked", variant: "outline" },
}

export default function AttendancePage() {
  const user = useAppSelector((s) => s.auth.user)!
  const dispatch = useAppDispatch()
  const [selectedEventId, setSelectedEventId] = useState("")
  const [code, setCode] = useState("")
  const [lastResult, setLastResult] = useState<{ ok: boolean; message: string; name?: string } | null>(null)
  const [checking, setChecking] = useState(false)

  const { data: myEvents } = useSWR(["organizer-events", user.id], () =>
    eventApi.getOrganizerEvents(user.id).then((r) => r.data),
  )
  const { data: allUsers } = useSWR("all-users", () => adminApi.getAllUsers().then((r) => r.data))
  const eventId = selectedEventId || myEvents?.find((e) => e.status === "PUBLISHED")?.id || ""
  const { data: attendance, mutate } = useSWR(eventId ? ["attendance", eventId] : null, () =>
    attendanceApi.getEventAttendance(eventId).then((r) => r.data),
  )

  if (!myEvents || !allUsers) return <Loader />

  const usersById = new Map(allUsers.map((u) => [u.id, u]))

  const checkIn = async () => {
    if (!code.trim()) return
    setChecking(true)
    try {
      const res = await attendanceApi.verifyAttendance(code)
      setLastResult({ ok: true, message: res.message, name: res.data.attendeeName })
      dispatch(pushToast({ type: "success", message: `${res.data.attendeeName} checked in` }))
      setCode("")
      mutate()
    } catch (e) {
      const message = (e as Error).message
      setLastResult({ ok: false, message })
      dispatch(pushToast({ type: "error", message }))
    } finally {
      setChecking(false)
    }
  }

  const confirmed = (attendance ?? []).filter((r) => r.status === "CONFIRMED")
  const present = confirmed.filter((r) => r.attendance === "PRESENT" || r.attendance === "LATE").length

  return (
    <div>
      <PageHeader
        title="Attendance"
        description="Scan or enter ticket codes to check attendees in. Certificates are issued automatically."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1">
          <h2 className="mb-4 flex items-center gap-2 font-bold text-foreground">
            <QrCode className="size-5 text-primary" aria-hidden="true" />
            Check-in scanner
          </h2>
          <div className="flex flex-col gap-4">
            <Input
              id="qr-code"
              label="QR value or ticket number"
              placeholder="e.g. EVT-2026-123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) checkIn()
              }}
            />
            <Button onClick={checkIn} loading={checking}>
              <UserCheck className="size-4" aria-hidden="true" />
              Check in attendee
            </Button>
            {lastResult && (
              <div
                role="status"
                className={
                  lastResult.ok
                    ? "flex items-start gap-2 rounded-lg bg-success/10 px-4 py-3 text-sm text-success"
                    : "flex items-start gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive"
                }
              >
                {lastResult.ok ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                ) : (
                  <XCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                )}
                <span>
                  {lastResult.name ? `${lastResult.name}: ` : ""}
                  {lastResult.message}
                </span>
              </div>
            )}
            <p className="text-xs text-muted-foreground text-pretty">
              Tip: in this demo, paste a ticket number from the attendee list on the right, or from a user&apos;s
              &quot;My Registrations&quot; ticket.
            </p>
          </div>
        </Card>

        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="w-full sm:max-w-xs">
                <Select
                  id="event-select"
                  label="Event"
                  value={eventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                >
                  {myEvents.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.title}
                    </option>
                  ))}
                </Select>
              </div>
              {eventId && (
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">{present}</strong> of{" "}
                  <strong className="text-foreground">{confirmed.length}</strong> checked in
                </p>
              )}
            </div>

            {!eventId || !attendance ? (
              <EmptyState title="Select an event" description="Choose one of your events to see its attendee list." />
            ) : confirmed.length === 0 ? (
              <EmptyState title="No registrations yet" description="Attendees will appear here once they register." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-3 py-2 font-semibold">Attendee</th>
                      <th className="px-3 py-2 font-semibold">Ticket</th>
                      <th className="px-3 py-2 font-semibold">Registered</th>
                      <th className="px-3 py-2 font-semibold">Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {confirmed.map((r) => {
                      const attendee = usersById.get(r.userId)
                      const badge = attendanceBadge[r.attendance]
                      return (
                        <tr key={r.id} className="hover:bg-muted/50">
                          <td className="px-3 py-2.5 font-medium text-foreground">{attendee?.name ?? "Unknown"}</td>
                          <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">{r.ticketNumber}</td>
                          <td className="px-3 py-2.5 text-muted-foreground">
                            {dayjs(r.registeredAt).format("MMM D, YYYY")}
                          </td>
                          <td className="px-3 py-2.5">
                            <Badge variant={badge.variant}>{badge.label}</Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
