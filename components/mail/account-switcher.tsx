"use client"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Account } from "@/types/mail"

interface AccountSwitcherProps {
  isCollapsed: boolean
  accounts: Account[]
  selectedAccount: Account
  onAccountChange: (accountId: Account["id"]) => void
}

export function AccountSwitcher({ isCollapsed, accounts, selectedAccount, onAccountChange }: AccountSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className=" gap-2 h-9 w-full px-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={selectedAccount.icon ? undefined : selectedAccount.email} />
            <AvatarFallback>{selectedAccount.label.substring(0, 2)}</AvatarFallback>
          </Avatar>
          {!isCollapsed && <span className="text-sm font-medium">{selectedAccount.label}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {accounts.map((account) => (
          <DropdownMenuItem key={account.id} onSelect={() => onAccountChange(account.id)}>
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={account.icon ? undefined : account.email} />
                <AvatarFallback>{account.label.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span>{account.label}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
