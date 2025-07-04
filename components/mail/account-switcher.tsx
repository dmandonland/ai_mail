"use client"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Account } from "@/types/mail"
import { ChevronDown } from "lucide-react"

interface AccountSwitcherProps {
  isCollapsed: boolean
  accounts: Account[]
  selectedAccount: Account
  onAccountChange: (accountId: Account["id"]) => void
}

export function AccountSwitcher({ isCollapsed, accounts, selectedAccount, onAccountChange }: AccountSwitcherProps) {
  // Get initials or empty string
  const getInitials = (label: string) => {
    if (!label) return ""
    return label
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 h-10 w-full px-2 flex items-center justify-start">
          <Avatar className="h-8 w-8 border border-white">
            <AvatarImage src={selectedAccount.avatar} alt={selectedAccount.label} />
            <AvatarFallback className="text-base font-bold">
              {getInitials(selectedAccount.label)}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col items-start ml-2">
              <span className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{selectedAccount.label}</span>
              <span className="text-xs text-muted-foreground leading-tight">{selectedAccount.email}</span>
            </div>
          )}
          {!isCollapsed && (
            <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        {accounts.map((account) => (
          <DropdownMenuItem key={account.id} onSelect={() => onAccountChange(account.id)}>
            <div className="flex items-center gap-2 w-full">
              <Avatar className="h-6 w-6 border border-white">
                <AvatarImage src={account.avatar} alt={account.label} />
                <AvatarFallback className="text-xs font-bold">
                  {getInitials(account.label)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="font-bold text-xs text-foreground">{account.label}</span>
                <span className="text-[10px] text-muted-foreground">{account.email}</span>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
