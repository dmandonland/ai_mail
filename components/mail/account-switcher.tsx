"use server"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Account } from "@/types/mail"
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import { ChevronDown, CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import * as React from "react"
import { useState } from "react"
import { cookies } from "next/headers"


  const cookieStore = await cookies()

export async function AccountSwitcher({
  isCollapsed,
  onAccountChangeAction,
}: {
  isCollapsed: boolean
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

  const supabase = createClient(cookieStore);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setUser(null);
      } else {
        setUser(data.user);
      }
      setLoading(false);
    };
    fetchUser();

    // Listen for profile update event to refresh user
    const handleProfileUpdate = () => {
      fetchUser();
    };
    window.addEventListener("account-profile-updated", handleProfileUpdate);
    return () => {
      window.removeEventListener("account-profile-updated", handleProfileUpdate);
    };
  }, []);

  const handleAccountChange = () => {
    if (user) {
      onAccountChangeAction(user.id);
    }
  };

  // When fully collapsed (minimum width), show just the avatar icon

  if (loading) {
    return <div className="p-4 text-center text-muted-foreground">Loading account...</div>;
  }
  if (!user) {
    return <div className="p-4 text-center text-muted-foreground">No user found.</div>;
  }


  if (isCollapsed) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            aria-label="Account"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar || undefined} alt={user.user_metadata?.name || user.email || "User"} />
              <AvatarFallback className="text-sm font-bold">
                {getInitials(user.user_metadata?.name || user.email || "User")}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start" forceMount>
          <DropdownMenuItem 
            key={user.id} 
            onSelect={handleAccountChange}
            className="flex items-center gap-2"
          >
            <Avatar className="h-5 w-5">
              <AvatarImage src={user.user_metadata?.avatar || undefined} alt={user.user_metadata?.name || user.email || "User"} />
              <AvatarFallback className="text-xs font-bold">
                {getInitials(user.user_metadata?.name || user.email || "User")}
              </AvatarFallback>
            </Avatar>
            {user.user_metadata?.name || user.email || "User"}
            <CheckIcon className="ml-auto h-4 w-4 opacity-100" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
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
            <AvatarImage src={user.user_metadata?.avatar || undefined} alt={user.user_metadata?.name || user.email || "User"} />
            <AvatarFallback className="text-sm font-bold">
              {getInitials(user.user_metadata?.name || user.email || "User")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start ml-2">
            <span className="font-bold text-sm text-foreground leading-tight">
              {user.user_metadata?.name || user.email || "User"}
            </span>
            <span className="text-xs text-muted-foreground leading-tight">
              {user.email}
            </span>
          </div>
          <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuItem 
          key={user.id} 
          onSelect={handleAccountChange}
          className="flex items-center gap-2 w-full"
        >
          <Avatar className="h-6 w-6 border border-white">
            <AvatarImage src={user.user_metadata?.avatar || undefined} alt={user.user_metadata?.name || user.email || "User"} />
            <AvatarFallback className="text-xs font-bold">
              {getInitials(user.user_metadata?.name || user.email || "User")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="font-bold text-xs text-foreground">
              {user.user_metadata?.name || user.email || "User"}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {user.email}
            </span>
          </div>
          <CheckIcon className="ml-auto h-4 w-4 opacity-100" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}