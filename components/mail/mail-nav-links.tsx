"use client"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import type { MailFolder } from "@/types/mail"
import { mails, navLinks as defaultNavLinks } from "@/lib/mail-data"

interface NavProps {
  isCollapsed: boolean
  selectedFolder: MailFolder
  onSelectFolder: (folder: MailFolder) => void
}

export function MailNavLinks({ isCollapsed, selectedFolder, onSelectFolder }: NavProps) {
  const getUnreadCount = (folder: MailFolder) => {
    return mails.filter((mail) => mail.folder === folder && !mail.read).length
  }

  return (
    <TooltipProvider delayDuration={0}>
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {Object.entries(defaultNavLinks).map(([folderName, link]) => {
          const unreadCount = getUnreadCount(folderName as MailFolder)
          return isCollapsed ? (
            <Tooltip key={folderName} delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onSelectFolder(folderName as MailFolder)}
                  className={cn(
                    buttonVariants({ variant: link.variant, size: "icon" }),
                    "h-9 w-9",
                    selectedFolder === folderName &&
                      "dark:text-white text-primary font-bold",
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {unreadCount > 0 && <span className="ml-auto text-muted-foreground">{unreadCount}</span>}
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              key={folderName}
              onClick={() => onSelectFolder(folderName as MailFolder)}
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),
                selectedFolder === folderName &&
                  "dark:text-white text-[#D09CF0] font-bold",
                "justify-start",
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {unreadCount > 0 && (
                <span className={cn(
                  "ml-auto",
                  selectedFolder === folderName ? "text-primary font-bold" : "text-muted-foreground"
                )}>
                  {unreadCount}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </TooltipProvider>
  )
}
