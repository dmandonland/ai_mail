"use client"

import * as React from "react"
import { PenSquare, Search, Menu } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { Input } from "@/components/ui/input"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AccountSwitcher } from "@/components/mail/account-switcher"
import { MailList } from "@/components/mail/mail-list"
import { MailView } from "@/components/mail/mail-view"
import { MailNavLinks } from "@/components/mail/mail-nav-links"
import { MailComposeDialog } from "@/components/mail/mail-compose-dialog"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  accounts as defaultAccounts,
  mails as defaultMails,
  secondaryNavLinks,
  archiveMail,
  deleteMail,
  restoreMail,
  permanentlyDeleteMail,
  markAsRead,
  markAsUnread,
} from "@/lib/mail-data"
import type { Mail, Account, MailFolder } from "@/types/mail"

interface MailLayoutProps {
  defaultLayout?: number[]
  defaultCollapsed?: boolean
  navCollapsedSize?: number
}

export function MailLayout({
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize = 4,
}: MailLayoutProps) {
  const isMobile = useMobile()
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const [selectedAccount, setSelectedAccount] = React.useState<Account["id"]>(defaultAccounts[0].id)
  const [selectedFolder, setSelectedFolder] = React.useState<MailFolder>("inbox")
  const [selectedMailId, setSelectedMailId] = React.useState<Mail["id"] | null>(null)
  const [isComposeOpen, setIsComposeOpen] = React.useState(false)
  const [mobileView, setMobileView] = React.useState<"list" | "detail">("list")
  const [isNavOpen, setIsNavOpen] = React.useState(false)
  const [refreshKey, setRefreshKey] = React.useState(0)
  const [mails, setMails] = React.useState<Mail[]>(defaultMails)

  const handleAccountChange = (accountId: Account["id"]) => {
    setSelectedAccount(accountId)
    setSelectedMailId(null) // Reset selected mail on account change
  }

  const currentAccount = defaultAccounts.find((acc) => acc.id === selectedAccount) || defaultAccounts[0]

  const filteredMails = mails.filter(
    (mail) => mail.accountId === selectedAccount && mail.folder === selectedFolder
  )
  const selectedMail = mails.find((mail) => mail.id === selectedMailId && mail.accountId === selectedAccount) || null

  const handleSendReply = (mailId: string, reply: { text: string; date: string; sender: string }) => {
    setMails((prevMails) => {
      const updatedMails = prevMails.map((mail) =>
        mail.id === mailId
          ? { ...mail, replies: [...(mail.replies || []), reply] }
          : mail
      )
      // Find the original mail
      const originalMail = prevMails.find((mail) => mail.id === mailId)
      if (originalMail) {
        // Create a new sent mail
        const currentAccountObj = defaultAccounts.find(acc => acc.id === selectedAccount)
        const newSentMail = {
          id: `sent-${Date.now()}`,
          accountId: selectedAccount,
          name: currentAccountObj?.label || "Me",
          email: currentAccountObj?.email || "me@example.com",
          subject: originalMail.subject.startsWith("Re: ") ? originalMail.subject : `Re: ${originalMail.subject}`,
          text: reply.text,
          date: new Date().toISOString(),
          read: true,
          labels: [],
          avatarFallback: (currentAccountObj?.label || "M").split(" ").map(s => s[0]).join("").toUpperCase(),
          folder: "sent" as const,
          replies: [],
          replyToId: mailId,
        }
        return [...updatedMails, newSentMail]
      }
      return updatedMails
    })
  }

  const handleSelectMail = (id: Mail["id"]) => {
    setSelectedMailId(id)
    // Mark as read when opening
    setMails((prevMails) =>
      prevMails.map((mail) =>
        mail.id === id ? { ...mail, read: true } : mail
      )
    )
    setRefreshKey((prev) => prev + 1)
    if (isMobile) {
      setMobileView("detail")
    }
  }

  const handleArchiveMail = (mailId: string) => {
    setMails(prevMails =>
      prevMails.map(mail =>
        mail.id === mailId ? { ...mail, folder: "archive" as const } : mail
      )
    )
    toast.success("Mail Archived")
    if (selectedMailId === mailId) {
      setSelectedMailId(null)
    }
    setRefreshKey((prev) => prev + 1)
  }

  const handleDeleteMail = (mailId: string) => {
    if (selectedFolder === "trash") {
      // Permanently delete if already in trash
      setMails(prevMails => prevMails.filter(mail => mail.id !== mailId))
      toast.success("Mail Permanently Deleted")
      if (selectedMailId === mailId) {
        setSelectedMailId(null)
      }
      setRefreshKey((prev) => prev + 1)
    } else {
      // Move to trash
      setMails(prevMails =>
        prevMails.map(mail =>
          mail.id === mailId ? { ...mail, folder: "trash" as const } : mail
        )
      )
      toast.success("Mail Moved to Trash")
      if (selectedMailId === mailId) {
        setSelectedMailId(null)
      }
      setRefreshKey((prev) => prev + 1)
    }
  }

  const handleMoveToJunk = (mailId: string) => {
    setMails(prevMails =>
      prevMails.map(mail =>
        mail.id === mailId ? { ...mail, folder: "junk" as const, read: true } : mail
      )
    )
    toast.success("Mail Moved to Junk")
    if (selectedMailId === mailId) {
      setSelectedMailId(null)
    }
    setRefreshKey((prev) => prev + 1)
  }

  const handleRestoreMail = (mailId: string) => {
    setMails(prevMails =>
      prevMails.map(mail =>
        mail.id === mailId ? { ...mail, folder: "inbox" as const } : mail
      )
    )
    toast.success("Mail restored to Inbox")
    if (selectedMailId === mailId) {
      setSelectedMailId(null)
    }
    setRefreshKey((prev) => prev + 1)
  }

  const handleMarkAsUnread = (mailId: string) => {
    if (markAsUnread(mailId)) {
      setRefreshKey((prev) => prev + 1)
    }
  }

  const handleSaveDraft = (mailId: string, updates: { subject: string; text: string }) => {
    setMails((prevMails) =>
      prevMails.map((mail) =>
        mail.id === mailId ? { ...mail, ...updates } : mail
      )
    )
    toast.success("Draft saved")
  }

  const handleSendDraft = (mailId: string, updates: { subject: string; text: string }) => {
    setMails((prevMails) => {
      const updatedMails = prevMails.map((mail) =>
        mail.id === mailId ? { ...mail, folder: "sent" as const, ...updates } : mail
      )
      // Also create a new sent mail (for threading consistency)
      const originalMail = prevMails.find((mail) => mail.id === mailId)
      if (originalMail) {
        const currentAccountObj = defaultAccounts.find(acc => acc.id === selectedAccount)
        const newSentMail = {
          id: `sent-${Date.now()}`,
          accountId: selectedAccount,
          name: currentAccountObj?.label || "Me",
          email: currentAccountObj?.email || "me@example.com",
          subject: updates.subject,
          text: updates.text,
          date: new Date().toISOString(),
          read: true,
          labels: [],
          avatarFallback: (currentAccountObj?.label || "M").split(" ").map(s => s[0]).join("").toUpperCase(),
          folder: "sent" as const,
          replies: [],
        }
        return [...updatedMails, newSentMail]
      }
      return updatedMails
    })
    toast.success("Mail sent!")
  }

  const handleSaveNewDraft = (draft: { to: string; subject: string; body: string }) => {
    if (!draft.subject.trim() && !draft.body.trim()) return;
    setMails((prevMails) => {
      const currentAccountObj = defaultAccounts.find(acc => acc.id === selectedAccount)
      const newDraftMail: Mail = {
        id: `draft-${Date.now()}`,
        accountId: selectedAccount,
        name: currentAccountObj?.label || "Me",
        email: currentAccountObj?.email || "me@example.com",
        subject: draft.subject,
        text: draft.body,
        date: new Date().toISOString(),
        read: true,
        labels: [],
        avatarFallback: (currentAccountObj?.label || "M").split(" ").map(s => s[0]).join("").toUpperCase(),
        folder: "drafts",
        replies: [],
      }
      return [...prevMails, newDraftMail]
    })
    toast.success("Draft saved!")
  }

  if (isMobile) {
    return (
      <div className="h-full flex flex-col">
        {mobileView === "list" ? (
          <>
            <header className="flex items-center justify-between p-2 border-b">
              <Button variant="ghost" size="icon" onClick={() => setIsNavOpen(!isNavOpen)}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open navigation</span>
              </Button>
              <h1 className="text-lg font-bold capitalize">{selectedFolder}</h1>
              <ThemeToggle />
            </header>
            {isNavOpen && (
              <div className="absolute top-14 left-0 z-10 w-full h-full bg-background/80 backdrop-blur-sm">
                <div className="w-64 bg-background border-r h-full p-2 flex flex-col">
                  <AccountSwitcher
                    isCollapsed={false}
                    accounts={defaultAccounts}
                    selectedAccount={currentAccount}
                    onAccountChange={handleAccountChange}
                  />
                  <Separator className="my-2" />
                  <MailNavLinks
                    isCollapsed={false}
                    selectedFolder={selectedFolder}
                    onSelectFolder={(folder) => {
                      setSelectedFolder(folder)
                      setIsNavOpen(false)
                    }}
                  />
                </div>
              </div>
            )}
            <div className="bg-background/95 p-4">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <MailList
              key={refreshKey}
              items={filteredMails}
              selectedMail={selectedMailId}
              onSelectMail={handleSelectMail}
            />
            <Button
              className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg"
              onClick={() => setIsComposeOpen(true)}
            >
              <PenSquare className="h-6 w-6" />
              <span className="sr-only">Compose</span>
            </Button>
          </>
        ) : (
          <MailView
            mail={selectedMail}
            onBack={() => setMobileView("list")}
            onArchive={handleArchiveMail}
            onDelete={handleDeleteMail}
            onRestore={handleRestoreMail}
            onMarkAsUnread={handleMarkAsUnread}
            onMoveToJunk={handleMoveToJunk}
            onSendReply={handleSendReply}
            onSaveDraft={handleSaveDraft}
            onSendDraft={handleSendDraft}
            currentFolder={selectedFolder}
            mails={mails}
          />
        )}
        <MailComposeDialog open={isComposeOpen} onOpenChange={setIsComposeOpen} onSaveDraft={handleSaveNewDraft} />
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`
        }}
        className="h-full max-h-screen items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => setIsCollapsed(true)}
          onExpand={() => setIsCollapsed(false)}
          className={cn(
            isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out",
            "flex flex-col bg-muted/50",
          )}
        >
          <div className={cn("flex h-[52px] items-center justify-center", isCollapsed ? "h-[52px]" : "px-2")}>
            <AccountSwitcher
              isCollapsed={isCollapsed}
              accounts={defaultAccounts}
              selectedAccount={currentAccount}
              onAccountChange={handleAccountChange}
            />
          </div>
          <Separator />
          <div className="flex-grow overflow-y-auto py-2">
            <MailNavLinks
              isCollapsed={isCollapsed}
              selectedFolder={selectedFolder}
              onSelectFolder={setSelectedFolder}
            />
          </div>
          <Separator />
          <div className="p-2">
            {isCollapsed ? (
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 bg-background text-foreground"
                onClick={() => setIsComposeOpen(true)}
              >
                <PenSquare className="h-4 w-4" />
                <span className="sr-only">Compose Mail</span>
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="w-full justify-start"
                onClick={() => setIsComposeOpen(true)}
              >
                <PenSquare className="mr-2 h-4 w-4" />
                Compose Mail
              </Button>
            )}
          </div>
          <Separator />
          <div className="py-2 flex flex-col items-center gap-1">
            <ThemeToggle />
            {secondaryNavLinks.map((link) =>
              link.title === "Settings" ? (
                <Link key={link.title} href="/settings">
                  {isCollapsed ? (
                    <Button variant="ghost" size="icon" className="h-9 w-9 mx-auto my-1 flex justify-center">
                      <link.icon className="h-4 w-4" />
                      <span className="sr-only">{link.title}</span>
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" className="w-full justify-start px-2">
                      <link.icon className="mr-2 h-4 w-4" />
                      {link.title}
                    </Button>
                  )}
                </Link>
              ) : isCollapsed ? (
                <Button
                  key={link.title}
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 mx-auto my-1 flex justify-center"
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </Button>
              ) : (
                <Button key={link.title} variant="ghost" size="sm" className="w-full justify-start px-2">
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.title}
                </Button>
              ),
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30} className="flex flex-col h-full">
          <Tabs defaultValue="all" className="flex-1 flex flex-col h-full">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold capitalize">{selectedFolder}</h1>
              <TabsList className="ml-auto">
                <TabsTrigger value="all" className="text-zinc-600 dark:text-zinc-200">
                  All mail
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-zinc-600 dark:text-zinc-200">
                  Unread
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0 flex-1 flex flex-col overflow-y-auto">
              <MailList
                key={refreshKey}
                items={filteredMails}
                selectedMail={selectedMailId}
                onSelectMail={handleSelectMail}
              />
            </TabsContent>
            <TabsContent value="unread" className="m-0 flex-1 flex flex-col overflow-y-auto">
              <MailList
                key={refreshKey}
                items={filteredMails.filter((item) => !item.read)}
                selectedMail={selectedMailId}
                onSelectMail={handleSelectMail}
              />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
          <MailView
            mail={selectedMail}
            onArchive={handleArchiveMail}
            onDelete={handleDeleteMail}
            onRestore={handleRestoreMail}
            onMarkAsUnread={handleMarkAsUnread}
            onMoveToJunk={handleMoveToJunk}
            onSendReply={handleSendReply}
            onSaveDraft={handleSaveDraft}
            onSendDraft={handleSendDraft}
            currentFolder={selectedFolder}
            mails={mails}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
      <MailComposeDialog open={isComposeOpen} onOpenChange={setIsComposeOpen} onSaveDraft={handleSaveNewDraft} />
    </TooltipProvider>
  )
}
