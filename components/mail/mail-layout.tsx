

import * as React from "react"
import { PenSquare, Search, Menu, Trash2, Paintbrush } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { Input } from "@/components/ui/input"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AccountSwitcher } from "@/components/mail/account-switcher"
import { MailList } from "@/components/mail/mail-list"
import { MailView } from "@/components/mail/mail-view"
import { MailNavLinks } from "@/components/mail/mail-nav-links"
import { MailComposeDialog } from "@/components/mail/mail-compose-dialog"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  mails as defaultMails,
  secondaryNavLinks,
  markAsUnread,
  userLabels as defaultUserLabels,
  fetchAccounts,
} from "@/lib/mail-data"
import type { Mail, Account, MailFolder } from "@/types/mail"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Dialog, DialogTrigger, DialogContent, DialogHeader } from "@/components/ui/dialog"

interface MailLayoutProps {
  defaultLayout?: number[]
  defaultCollapsed?: boolean
  navCollapsedSize?: number
}

export function MailLayout({
  defaultLayout = [265, 440, 1024],
  defaultCollapsed = true,
  navCollapsedSize = 4,
}: MailLayoutProps) {
  const isMobile = useMobile()
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const [accounts, setAccounts] = React.useState<Account[]>([])
  const [selectedAccount, setSelectedAccount] = React.useState<Account["id"] | null>(null)
  const [selectedFolder, setSelectedFolder] = React.useState<MailFolder>("inbox")
  const [selectedMailId, setSelectedMailId] = React.useState<Mail["id"] | null>(null)
  const [isComposeOpen, setIsComposeOpen] = React.useState(false)
  const [mobileView, setMobileView] = React.useState<"list" | "detail">("list")
  const [isNavOpen, setIsNavOpen] = React.useState(false)
  const [refreshKey, setRefreshKey] = React.useState(0)
  const [mails, setMails] = React.useState<Mail[]>(defaultMails)
  const [labels, setLabels] = React.useState<{ name: string; color: string }[]>([])
  const [labelFilter, setLabelFilter] = React.useState<string>("all")
  const [isLabelsDialogOpen, setIsLabelsDialogOpen] = React.useState(false)
  const [userLabels, setUserLabels] = React.useState(defaultUserLabels)
  const [hoveredLabel, setHoveredLabel] = React.useState<string | null>(null)

  const handleAccountChange = (accountId: Account["id"]) => {
    setSelectedAccount(accountId)
    setSelectedMailId(null) // Reset selected mail on account change
  }

  const currentAccount = accounts.find((acc) => acc.id === selectedAccount) || accounts[0]
  React.useEffect(() => {
    const getAccounts = async () => {
      const accs = await fetchAccounts();
      setAccounts(accs);
      if (accs.length > 0) {
        setSelectedAccount(accs[0].id);
      }
    };
    getAccounts();

    // Listen for profile update event to refresh accounts
    const handleProfileUpdate = () => {
      getAccounts();
    };
    window.addEventListener("account-profile-updated", handleProfileUpdate);
    return () => {
      window.removeEventListener("account-profile-updated", handleProfileUpdate);
    };
  }, [])

  const filteredMails = mails.filter(
    (mail) =>
      selectedAccount && mail.accountId === selectedAccount &&
      mail.folder === selectedFolder &&
      (
        labelFilter === "all" ||
        (labelFilter === "__unread__" ? !mail.read : mail.labels.includes(labelFilter))
      )
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
        const currentAccountObj = accounts.find(acc => acc.id === selectedAccount)
        const newSentMail: Mail = {
          id: `sent-${Date.now()}`,
          accountId: typeof selectedAccount === "string" ? selectedAccount : "",
          name: currentAccountObj?.label || "Me",
          email: currentAccountObj?.email || "me@example.com",
          subject: originalMail.subject.startsWith("Re: ") ? originalMail.subject : `Re: ${originalMail.subject}`,
          text: reply.text,
          date: new Date().toISOString(),
          read: true,
          labels: [],
          avatarFallback: (currentAccountObj?.label || "M").split(" ").map(s => s[0]).join("").toUpperCase(),
          folder: "sent",
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
        const currentAccountObj = accounts.find(acc => acc.id === selectedAccount)
        const newSentMail = {
          id: `sent-${Date.now()}`,
          accountId: typeof selectedAccount === "string" ? selectedAccount : "",
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
      const currentAccountObj = accounts.find(acc => acc.id === selectedAccount)
      const newDraftMail: Mail = {
        id: `draft-${Date.now()}`,
        accountId: typeof selectedAccount === "string" ? selectedAccount: "",
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

  // Forward handler (single definition, using Supabase account data)
  const handleForward = async ({ subject, body, originalMail }: { to: string; subject: string; body: string; originalMail: Mail }) => {
    const currentAccountObj = accounts.find(acc => acc.id === selectedAccount)
    if (!currentAccountObj) return;
    if (!selectedAccount) return;
    setMails(prevMails => [
      ...prevMails,
      {
        id: `sent-${Date.now()}`,
        accountId: selectedAccount as string,
        name: currentAccountObj.label || "Me",
        email: currentAccountObj.email || "me@example.com",
        subject,
        text: body,
        date: new Date().toISOString(),
        read: true,
        labels: [],
        avatarFallback: (currentAccountObj.label || "M").split(" ").map(s => s[0]).join("").toUpperCase(),
        folder: "sent",
        replies: [],
        replyToId: originalMail.id,
        // Optionally, add a to field if you want to display recipient in sent mail
        // to,
      },
    ])
    toast.success("Mail forwarded and sent!")
  }

  // Add label to global and mail
  const handleAddLabel = (label: { name: string; color: string }, mailId: string) => {
    setLabels(prev => prev.some(l => l.name === label.name) ? prev : [...prev, label])
    setMails(prevMails => prevMails.map(mail =>
      mail.id === mailId && !mail.labels.includes(label.name)
        ? { ...mail, labels: [...mail.labels, label.name] }
        : mail
    ))
    toast.success(`Label '${label.name}' added!`)
  }

  // Handler to change label color
  const handleChangeLabelColor = (name: string, color: string) => {
    setUserLabels(labels => labels.map(l => l.name === name ? { ...l, color } : l))
  }
  // Handler to delete label
  const handleDeleteLabel = (name: string) => {
    setUserLabels(labels => labels.filter(l => l.name !== name))
  }

  // Calculate counts for each folder
  const folderCounts: Record<string, number> = React.useMemo(() => {
    const counts: Record<string, number> = {};
    const now = new Date();
    mails.forEach(mail => {
      if (mail.accountId !== selectedAccount) return;
      // Inbox: count unread
      if (mail.folder === "inbox") {
        counts["inbox"] = (counts["inbox"] || 0) + (!mail.read ? 1 : 0);
      }
      // Sent: count sent in last 24h
      if (mail.folder === "sent") {
        const sentDate = new Date(mail.date);
        if ((now.getTime() - sentDate.getTime()) < 24 * 60 * 60 * 1000) {
          counts["sent"] = (counts["sent"] || 0) + 1;
        }
      }
      // Trash, Junk, Drafts, Archive: count all mails in folder
      if (["trash", "junk", "drafts", "archive"].includes(mail.folder)) {
        counts[mail.folder] = (counts[mail.folder] || 0) + 1;
      }
    });
    return counts;
  }, [mails, selectedAccount])

  if (isMobile) {
    return (
      <div className="h-screen flex flex-col">
        {mobileView === "list" ? (
          <>
            <div className="z-5">
              <header className="flex items-center justify-between p-2 border-b bg-background z-10">
                <Button variant="ghost" size="icon" onClick={() => setIsNavOpen(!isNavOpen)}>
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open navigation</span>
                </Button>
                <h1 className="text-lg font-bold capitalize">{selectedFolder}</h1>
                <ThemeToggle />
              </header>
              {isNavOpen && (
                <div className="absolute top-14 z-20 left-0 w-full h-full bg-background/60 backdrop-blur-sm">
                  <div className="sm:max-md:max-w-screen border-r h-full p-2 flex flex-col">
                    <AccountSwitcher
                      isCollapsed={false}
                      onAccountChangeAction={handleAccountChange}
                    />
                    <Separator className="my-2" />
                    <MailNavLinks
                      isCollapsed={false}
                      selectedFolder={selectedFolder}
                      onSelectFolderAction={(folder) => {
                        setSelectedFolder(folder)
                        setIsNavOpen(false)
                      }}
                      counts={folderCounts}
                    />
                  </div>
                </div>
              )}
              <div className="bg-background/95 p-4 sticky top-0 z-10 border-b">
                <form>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search" className="pl-8" />
                  </div>
                </form>
              </div>
            </div>
            <div className="flex-1 flex-col flex min-h-0 overflow-hidden">
              <MailList
                key={refreshKey}
                items={filteredMails}
                selectedMail={selectedMailId}
                onSelectMail={handleSelectMail}
                labels={labels}
              />
            </div>
            <Button
              className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-10"
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
            onForward={handleForward}
            onAddLabel={handleAddLabel}
            labels={labels}
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
            "flex flex-col",
          )}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between gap-2 pl-3 pr-2 py-2 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0">
              <div className='flex items-center h-12 w-full'>
                <AccountSwitcher
                  isCollapsed={isCollapsed}
                  onAccountChangeAction={handleAccountChange}
                />
              </div>
            </div>
            <Separator />
            <div className="flex flex-col items-center px-2 py-3">
              {isCollapsed ? (
                <Button
                  variant="default"
                  size="icon"
                  className="h-14 w-14 bg-[#A24AD9] text-primary-foreground shadow-lg hover:scale-105 transition-transform duration-200"
                  onClick={() => setIsComposeOpen(true)}
                  style={{ fontWeight: 500, fontSize: '1rem' }}
                >
                  <PenSquare className="h-7 w-7" />
                  <span className="sr-only">Compose Mail</span>
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="lg"
                  className="w-full py-6 mb-2 text-base font-medium bg-[#A24AD9] text-primary-foreground shadow-lg hover:scale-105 transition-transform duration-200"
                  onClick={() => setIsComposeOpen(true)}
                  style={{ fontWeight: 500, fontSize: '1rem', letterSpacing: '0.01em' }}
                >
                  <PenSquare className="mr-3 h-7 w-7" />
                  Compose Mail
                </Button>
              )}
            </div>
            <div className="flex-grow overflow-y-auto py-2">
              <MailNavLinks
                isCollapsed={isCollapsed}
                selectedFolder={selectedFolder}
                onSelectFolderAction={setSelectedFolder}
                counts={folderCounts}
              />
              {/* Labels Section */}
             {/* Replace the current labels section with this */}
              <div className="mt-6 px-2">
                {!isCollapsed && (
                  <div className="text-xs font-semibold uppercase tracking-wide mb-2 text-muted-foreground">Labels</div>
                )}
                <div className="flex flex-col gap-1">
                  {!isCollapsed && (
                    <button
                      className={`text-left px-2 py-1 rounded hover:bg-muted text-sm ${labelFilter === 'all' ? 'font-bold' : ''}`}
                      onClick={() => setLabelFilter('all')}
                    >
                      All
                    </button>
                  )}
                  {labels.length === 0 && !isCollapsed && (
                    <span className="text-xs text-muted-foreground">No labels</span>
                  )}
                  {labels.map(label => (
                    <button
                      key={label.name}
                      className={`text-left px-2 py-1 rounded hover:bg-muted text-sm flex items-center gap-2 ${labelFilter === label.name ? 'font-bold' : ''}`}
                      onClick={() => setLabelFilter(label.name)}
                    >
                      <span 
                        className="inline-block w-2 h-2 rounded-full" 
                        style={{ background: label.color }}
                        title={isCollapsed ? label.name : undefined}
                      />
                      {!isCollapsed && (
                        <>
                          <span className="mr-2" />
                          {label.name}
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Separator />
            <div className="py-2 flex flex-col items-center gap-1">
              <ThemeToggle />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30} className="flex flex-col h-full">
          <div className="flex-1 flex flex-col h-full min-h-0">
            <div className="h-full flex flex-col min-h-0">
              <div className="flex items-center justify-between gap-2 px-4 py-2 border-b bg-background/80 sticky top-0">
                <div className='flex items-center h-12 w-full'>
                  <h1 className="text-xl font-bold capitalize h-12 flex items-center">{selectedFolder}</h1>
                </div>
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
              <div className="flex items-center gap-2 px-4 py-[10px]">
                <span className="text-sm font-medium">Filter:</span>
                <Select value={labelFilter} onValueChange={setLabelFilter}>
                  <SelectTrigger className="rounded-full border bg-muted text-foreground px-3 py-1 text-sm w-28">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="__unread__">Unread</SelectItem>
                    {labels.map(label => (
                      <SelectItem key={label.name} value={label.name}>{label.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {labelFilter && (
                  <Button size="sm" variant="outline" onClick={() => setLabelFilter("")}>Clear</Button>
                )}
              </div>
              <div className="flex-1 min-h-0">
                <MailList
                  key={refreshKey}
                  items={filteredMails}
                  selectedMail={selectedMailId}
                  onSelectMail={handleSelectMail}
                  labels={labels}
                />
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
          <div className="h-full flex flex-col">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between gap-2 pl-2 pr-6 py-2 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0">
                <div className='flex items-center h-12 w-full'>
                  {secondaryNavLinks.map((link) => (
                    link.title === 'Manage Labels' ? (
                      <Dialog open={isLabelsDialogOpen} onOpenChange={setIsLabelsDialogOpen} key={link.title}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2 h-12"
                            onClick={() => setIsLabelsDialogOpen(true)}
                          >
                            <link.icon className="h-5 w-5 mr-1" />
                            <span className="hidden sm:inline">{link.title}</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader className="font-bold font-inter text-xl">Manage Labels</DialogHeader>
                          <div className="flex flex-col gap-2 mt-4">
                            {userLabels.length === 0 && <div className="text-muted-foreground">No labels created.</div>}
                            {userLabels.map(label => (
                              <div
                                key={label.name}
                                className="flex items-center justify-between group px-2 py-1 rounded hover:bg-accent transition-colors"
                                onMouseEnter={() => setHoveredLabel(label.name)}
                                onMouseLeave={() => setHoveredLabel(null)}
                              >
                                <span className="flex items-center gap-2">
                                  <span style={{ backgroundColor: label.color, width: 16, height: 16, borderRadius: 4, display: 'inline-block' }} />
                                  {label.name}
                                </span>
                                {hoveredLabel === label.name && (
                                  <span className="flex gap-2">
                                    <button
                                      title="Change color"
                                      className="p-1 rounded hover:bg-muted"
                                      onClick={() => {
                                        const newColor = prompt('Enter new color (hex):', label.color) || label.color
                                        handleChangeLabelColor(label.name, newColor)
                                      }}
                                    >
                                      <Paintbrush className="w-4 h-4" />
                                    </button>
                                    <button
                                      title="Delete label"
                                      className="p-1 rounded hover:bg-destructive/20"
                                      onClick={() => handleDeleteLabel(label.name)}
                                    >
                                      <Trash2 className="w-4 h-4 text-destructive" />
                                    </button>
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Button
                        key={link.title}
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 h-12"
                        asChild={link.title === 'Settings'}
                      >
                        {link.title === 'Settings' ? (
                          <Link href="/settings">
                            <link.icon className="h-5 w-5 mr-1" />
                            <span className="hidden sm:inline">{link.title}</span>
                          </Link>
                        ) : (
                          <>
                            <link.icon className="h-5 w-5 mr-1" />
                            <span className="hidden sm:inline">{link.title}</span>
                          </>
                        )}
                      </Button>
                    )
                  ))}
                </div>
              </div>
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
                onForward={handleForward}
                onAddLabel={handleAddLabel}
                labels={labels}
              />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <MailComposeDialog open={isComposeOpen} onOpenChange={setIsComposeOpen} onSaveDraft={handleSaveNewDraft} />
    </TooltipProvider>
  )
}
