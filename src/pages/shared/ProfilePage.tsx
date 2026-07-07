"use client"

import { useState } from "react"
import dayjs from "dayjs"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { updateProfile } from "@/features/auth/authSlice"
import { pushToast } from "@/features/toast/toastSlice"
import { PageHeader } from "@/components/common/PageHeader"
import { Card, Button, Input, Badge } from "@/components/common/ui"

export default function ProfilePage() {
  const user = useAppSelector((s) => s.auth.user)!
  const dispatch = useAppDispatch()
  const [name, setName] = useState(user.name)
  const [organization, setOrganization] = useState(user.organization ?? "")

  const save = () => {
    if (name.trim().length < 2) {
      dispatch(pushToast({ type: "error", message: "Name must be at least 2 characters" }))
      return
    }
    dispatch(
      updateProfile({
        name: name.trim(),
        organization: user.role === "ORGANIZER" ? organization.trim() || undefined : user.organization,
      }),
    )
    dispatch(pushToast({ type: "success", message: "Profile updated" }))
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Profile" description="Manage your account information." />

      <Card className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <span className="flex size-16 items-center justify-center rounded-full bg-accent text-2xl font-bold text-accent-foreground">
            {user.name.charAt(0)}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-foreground">{user.name}</p>
              <Badge variant="accent">{user.role}</Badge>
              {user.verified && <Badge variant="success">Verified</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">
              Member since {dayjs(user.joinedAt).format("MMMM YYYY")}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Input id="profile-name" label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input id="profile-email" label="Email" value={user.email} disabled />
          {user.role === "ORGANIZER" && (
            <Input
              id="profile-org"
              label="Organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Your organization name"
            />
          )}
          <div>
            <Button onClick={save}>Save changes</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
