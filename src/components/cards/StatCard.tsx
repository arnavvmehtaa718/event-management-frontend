import type { LucideIcon } from "lucide-react"
import { CardGlow } from "@/components/common/ui"
import clsx from "clsx"

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
}: {
  label: string
  value: string | number
  icon: LucideIcon
  tone?: "primary" | "success" | "warning" | "destructive"
}) {
  return (
    <CardGlow className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <span
        className={clsx(
          "flex size-12 shrink-0 items-center justify-center rounded-xl",
          tone === "primary" && "bg-primary/10 text-primary",
          tone === "success" && "bg-success/10 text-success",
          tone === "warning" && "bg-warning/10 text-warning",
          tone === "destructive" && "bg-destructive/10 text-destructive",
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div>
        <p className="text-2xl font-extrabold tracking-tight text-foreground">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      </div>
    </CardGlow>
  )
}
