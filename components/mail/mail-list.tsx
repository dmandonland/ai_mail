"use client"

import type { ComponentProps } from "react"
import { formatDistanceToNow } from "date-fns/formatDistanceToNow"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Mail } from "@/types/mail"

interface MailListProps {
  items: Mail[]
  selectedMail: Mail["id"] | null
  onSelectMail: (id: Mail["id"]) => void
}

export function MailList({ items, selectedMail, onSelectMail }: MailListProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">No messages in this folder.</div>
    )
  }
  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              selectedMail === item.id && "bg-muted",
            )}
            onClick={() => onSelectMail(item.id)}
          >
            <div className="flex w-full items-center">
              <div className="flex items-center gap-2">
                <div className={cn("font-semibold", !item.read && "font-bold")}>{item.name}</div>
                {!item.read && <span className="flex h-2 w-2 rounded-full bg-blue-600" />}
              </div>
              <div
                className={cn(
                  "ml-auto text-xs",
                  selectedMail === item.id
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
              </div>
            </div>
            <div className={cn("text-xs font-medium", !item.read && "font-bold")}>{item.subject}</div>
            <div className="line-clamp-2 text-xs text-muted-foreground">{item.text.substring(0, 300)}</div>
            {item.labels.length ? (
              <div className="flex items-center gap-2">
                {item.labels.map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}

function getBadgeVariantFromLabel(label: string): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default"
  }
  if (["personal"].includes(label.toLowerCase())) {
    return "outline"
  }
  if (["important", "security"].includes(label.toLowerCase())) {
    return "destructive"
  }
  return "secondary"
}
