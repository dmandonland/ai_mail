"use client"

import { formatDistanceToNow } from "date-fns"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Mail } from "@/types/mail"

interface MailListProps {
  items: Mail[]
  selectedMail: Mail["id"] | null
  onSelectMail: (id: Mail["id"]) => void
  labels?: { name: string; color: string }[]
}

export function MailList({ items, selectedMail, onSelectMail, labels = [] }: MailListProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">No messages in this folder.</div>
    )
  }
  return (
    <ScrollArea className="flex-1 h-full">
      <div className="flex flex-col gap-2 p-4 pt-0 h-full">
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
              <div className="flex items-center gap-2 mt-1">
                {item.labels.map((label) => {
                  const labelObj = labels.find(l => l.name === label)
                  if (!labelObj) return null
                  return (
                    <span
                      key={label}
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ backgroundColor: labelObj.color, color: '#fff' }}
                    >
                      {label}
                    </span>
                  )
                })}
              </div>
            ) : null}
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}
