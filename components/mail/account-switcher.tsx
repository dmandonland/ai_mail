"use client"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Account } from "@/types/mail"
import { ChevronDown, CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import * as React from "react"

export function AccountSwitcher({
  isCollapsed,
  accounts,
  selectedAccount,
  onAccountChangeAction,
}: {
  isCollapsed: boolean
  accounts: Account[]
  selectedAccount: Account
  onAccountChangeAction: (id: string) => void
}) {
  const getInitials = (label: string): string => {
    return label
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .toUpperCase()
  }

  // When fully collapsed (minimum width), show just the avatar icon
  if (isCollapsed) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            aria-label="Switch account"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={selectedAccount.avatar} alt={selectedAccount.label} />
              <AvatarFallback className="text-sm font-bold">
                {getInitials(selectedAccount.label)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start" forceMount>
          {accounts.map((account) => (
            <DropdownMenuItem 
              key={account.id} 
              onSelect={() => onAccountChangeAction(account.id)}
              className="flex items-center gap-2"
            >
              <Avatar className="h-5 w-5">
                <AvatarImage src={account.avatar} alt={account.label} />
                <AvatarFallback className="text-xs font-bold">
                  {getInitials(account.label)}
                </AvatarFallback>
              </Avatar>
              {account.label}
              <CheckIcon
                className={cn(
                  "ml-auto h-4 w-4",
                  account.id === selectedAccount.id ? "opacity-100" : "opacity-0"
                )}
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Default expanded view
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="gap-2 h-12 w-full px-2 flex items-center justify-start"
        >
          <Avatar className="h-8 w-8 border border-white">
            <AvatarImage src={selectedAccount.avatar} alt={selectedAccount.label} />
            <AvatarFallback className="text-sm font-bold">
              {getInitials(selectedAccount.label)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start ml-2">
            <span className="font-bold text-sm text-foreground leading-tight">
              {selectedAccount.label}
            </span>
            <span className="text-xs text-muted-foreground leading-tight">
              {selectedAccount.email}
            </span>
          </div>
          <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        {accounts.map((account) => (
          <DropdownMenuItem 
            key={account.id} 
            onSelect={() => onAccountChangeAction(account.id)}
            className="flex items-center gap-2 w-full"
          >
            <Avatar className="h-6 w-6 border border-white">
              <AvatarImage src={account.avatar} alt={account.label} />
              <AvatarFallback className="text-xs font-bold">
                {getInitials(account.label)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="font-bold text-xs text-foreground">
                {account.label}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {account.email}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}