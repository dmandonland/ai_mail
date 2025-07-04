"use client"

import { format } from "date-fns"
import {
  Archive,
  ArchiveX,
  Bot,
  ChevronLeft,
  Clock,
  Forward,
  MoreVertical,
  Paperclip,
  Reply,
  ReplyAll,
  RotateCcw,
  Sparkles,
  Trash2,
} from "lucide-react"
import { Mail as MailIcon } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Mail, MailFolder } from "@/types/mail"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface MailViewProps {
  mail: Mail | null
  onBack?: () => void
  onArchive?: (mailId: string) => void
  onDelete?: (mailId: string) => void
  onRestore?: (mailId: string) => void
  onMarkAsUnread?: (mailId: string) => void
  currentFolder?: MailFolder
  onSendReply?: (
    mailId: string,
    reply: { text: string; date: string; sender: string }
  ) => void
  onSaveDraft?: (
    mailId: string,
    updates: { subject: string; text: string }
  ) => void
  onSendDraft?: (
    mailId: string,
    updates: { subject: string; text: string }
  ) => void
  mails?: Mail[]
  onMoveToJunk?: (mailId: string) => void
  onForward?: (forward: { to: string; subject: string; body: string; originalMail: Mail }) => Promise<void> | void
  onAddLabel?: (label: { name: string; color: string }, mailId: string) => void
  labels?: { name: string; color: string }[]
}

export function MailView({
  mail,
  onBack,
  onArchive,
  onDelete,
  onRestore,
  onMarkAsUnread,
  currentFolder,
  onSendReply,
  onSaveDraft,
  onSendDraft,
  mails = [],
  onMoveToJunk,
  onForward,
  onAddLabel,
  labels = [],
}: MailViewProps) {
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [draftSubject, setDraftSubject] = useState(mail?.subject || "")
  const [draftBody, setDraftBody] = useState(mail?.text || "")
  const [isEditingDraft, setIsEditingDraft] = useState(
    currentFolder === "drafts"
  )
  const [showOverlay, setShowOverlay] = useState(false)
  const draftBodyRef = useRef<HTMLDivElement>(null)
  const [showForwardDialog, setShowForwardDialog] = useState(false)
  const [forwardTo, setForwardTo] = useState("")
  const [forwardSubject, setForwardSubject] = useState("")
  const [forwardBody, setForwardBody] = useState("")
  const [isForwarding, setIsForwarding] = useState(false)
  const [showLabelDialog, setShowLabelDialog] = useState(false)
  const [newLabelName, setNewLabelName] = useState("")
  const [newLabelColor, setNewLabelColor] = useState("#1976d2")

  const softColors = [
    "#D84949", // red
    "#4ED849", // green
    "#4976D8", // blue
    "#D8B849", // yellow
    "#B849D8", // purple
    "#49D8B8", // teal
    "#D88C49", // orange
  ]

  useEffect(() => {
    if (
      currentFolder === "drafts" &&
      !isEditingDraft &&
      draftBodyRef.current
    ) {
      setShowOverlay(draftBodyRef.current.scrollHeight > 300)
    }
  }, [isEditingDraft, draftBody, currentFolder])

  useEffect(() => {
    setDraftSubject(mail?.subject || "")
    setDraftBody(mail?.text || "")
    setIsEditingDraft(currentFolder === "drafts")
    setShowReply(false)
    setShowForwardDialog(false)
    setForwardTo("")
    setForwardSubject(mail ? `Fwd: ${mail.subject}` : "")
    setForwardBody(mail ? `\n\n---------- Forwarded message ----------\nFrom: ${mail?.name} <${mail?.email}>\nDate: ${mail ? format(new Date(mail.date), "PPpp") : ""}\nSubject: ${mail?.subject}\n\n${mail?.text}` : "")
  }, [mail, currentFolder])

  if (!mail) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No message selected.
      </div>
    )
  }

  const handleArchive = () => onArchive?.(mail.id)
  const handleDelete = () => onDelete?.(mail.id)
  const handleRestore = () => onRestore?.(mail.id)
  const handleMarkAsUnread = () => onMarkAsUnread?.(mail.id)

  const handleReply = () => {
    setShowReply(true)
  }

  const handleSendReply = () => {
    if (replyText.trim() && onSendReply) {
      const newReply = {
        text: replyText,
        date: new Date().toISOString(),
        sender: "You",
      }
      onSendReply(mail.id, newReply)
      setReplyText("")
      setShowReply(false)
    }
  }

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(mail.id, { subject: draftSubject, text: draftBody })
      setIsEditingDraft(false)
    }
  }

  const handleSendDraft = () => {
    if (onSendDraft) {
      onSendDraft(mail.id, { subject: draftSubject, text: draftBody })
      setIsEditingDraft(false)
    }
  }

  const handleAIWrite = () => {
    setDraftBody(
      "Hi there,\n\nThis is an AI-generated email body. Please review and edit as needed.\n\nBest regards,\nAI Writer"
    )
  }

  const handleMoveToJunk = () => onMoveToJunk?.(mail.id)

  const handleOpenForward = () => {
    setShowForwardDialog(true)
    setForwardTo("")
    setForwardSubject(mail ? `Fwd: ${mail.subject}` : "")
    setForwardBody(mail ? `\n\n---------- Forwarded message ----------\nFrom: ${mail?.name} <${mail?.email}>\nDate: ${mail ? format(new Date(mail.date), "PPpp") : ""}\nSubject: ${mail?.subject}\n\n${mail?.text}` : "")
  }

  const handleSendForward = async () => {
    if (!onForward || !mail) return
    setIsForwarding(true)
    await onForward({
      to: forwardTo,
      subject: forwardSubject,
      body: forwardBody,
      originalMail: mail,
    })
    setIsForwarding(false)
    setShowForwardDialog(false)
    setForwardTo("")
    setForwardSubject("")
    setForwardBody("")
  }

  const handleAddLabel = () => {
    if (onAddLabel && mail && newLabelName.trim()) {
      onAddLabel({ name: newLabelName.trim(), color: newLabelColor }, mail.id)
      setShowLabelDialog(false)
      setNewLabelName("")
      setNewLabelColor("#1976d2")
    }
  }

  const isInTrash = currentFolder === "trash"
  const isInArchive = currentFolder === "archive"
  const isInSent = currentFolder === "sent"

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full flex-col">
        <div className="flex items-center p-2">
          {onBack && (
            <>
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
              <Separator orientation="vertical" className="mx-2 h-6" />
            </>
          )}
          <div className="flex items-center gap-2">
            {isInTrash || isInArchive ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleRestore}>
                    <RotateCcw className="h-4 w-4" />
                    <span className="sr-only">Restore to Inbox</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Restore to Inbox</TooltipContent>
              </Tooltip>
            ) : !isInSent && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleArchive}>
                      <Archive className="h-4 w-4" />
                      <span className="sr-only">Archive</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Archive</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={!mail}
                      onClick={handleMoveToJunk}
                    >
                      <ArchiveX className="h-4 w-4" />
                      <span className="sr-only">Move to junk</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Move to junk</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleDelete}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">
                        {isInTrash ? "Delete Permanently" : "Move to trash"}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isInTrash ? "Delete Permanently" : "Move to trash"}
                  </TooltipContent>
                </Tooltip>
              </>
            )}
            <Separator orientation="vertical" className="mx-1 h-6" />
            <Tooltip>
              <Popover>
                <PopoverTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={!mail}>
                      <Clock className="h-4 w-4" />
                      <span className="sr-only">Snooze</span>
                    </Button>
                  </TooltipTrigger>
                </PopoverTrigger>
                <PopoverContent className="flex w-[535px] p-0">
                  <div className="flex flex-col gap-2 border-r px-2 py-4">
                    <div className="px-4 text-sm font-medium">
                      Snooze until
                    </div>
                    <div className="grid min-w-[250px] gap-1">
                      <Button
                        variant="ghost"
                        className="justify-start font-normal"
                      >
                        Later today{" "}
                        <span className="ml-auto text-muted-foreground">
                          Mon 9:00 PM
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start font-normal"
                      >
                        Tomorrow{" "}
                        <span className="ml-auto text-muted-foreground">
                          Tue 9:00 AM
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start font-normal"
                      >
                        This weekend{" "}
                        <span className="ml-auto text-muted-foreground">
                          Sat 9:00 AM
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start font-normal"
                      >
                        Next week{" "}
                        <span className="ml-auto text-muted-foreground">
                          Mon 9:00 AM
                        </span>
                      </Button>
                    </div>
                  </div>
                  <div className="p-2">
                    <Calendar />
                  </div>
                </PopoverContent>
              </Popover>
              <TooltipContent>Snooze</TooltipContent>
            </Tooltip>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleReply}>
              <Reply className="h-4 w-4" />
              <span className="sr-only">Reply</span>
            </Button>
            <Button variant="ghost" size="icon" disabled={!mail}>
              <ReplyAll className="h-4 w-4" />
              <span className="sr-only">Reply all</span>
            </Button>
            <Button variant="ghost" size="icon" disabled={!mail} onClick={handleOpenForward}>
              <Forward className="h-4 w-4" />
              <span className="sr-only">Forward</span>
            </Button>
            <Separator orientation="vertical" className="mx-2 h-6" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!mail}>
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleMarkAsUnread}>
                  <MailIcon className="mr-2 h-4 w-4" />
                  Mark as unread
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleReply}>
                  <Reply className="mr-2 h-4 w-4" />
                  Start thread
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowLabelDialog(true)}>
                  Add label
                </DropdownMenuItem>
                <DropdownMenuItem>Mute thread</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Separator />
        <div className="flex-1 overflow-y-auto p-6">
          {currentFolder === "sent" && mail.replyToId && mails.length > 0 && (
            (() => {
              const original = mails.find((m) => m.id === mail.replyToId)
              if (!original) return null
              return (
                <div className="mb-6">
                  <div className="rounded border bg-muted p-4 mb-2">
                    <div className="font-semibold mb-1">{original.subject}</div>
                    <div className="text-xs text-muted-foreground mb-2">
                      From: {original.name} ({original.email})
                    </div>
                    <div className="whitespace-pre-line text-sm">
                      {original.text}
                    </div>
                  </div>
                  <div className="flex items-center my-2 justify-center">
                    <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary font-semibold">Forwarded</span>
                  </div>
                  <div className="rounded border bg-background p-4">
                    <div className="mb-4 flex items-center gap-4">
                      <Avatar>
                        {mail.avatar && (
                          <AvatarImage src={mail.avatar} alt={mail.name} />
                        )}
                        <AvatarFallback>{mail.avatarFallback}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{mail.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {mail.email}
                        </div>
                      </div>
                      <div className="ml-auto text-xs text-muted-foreground">
                        {format(new Date(mail.date), "PPpp")}
                      </div>
                    </div>
                    <div className="mb-4 whitespace-pre-line text-sm">{mail.text}</div>
                  </div>
                </div>
              )
            })()
          )}
          {!(currentFolder === "sent" && mail.replyToId && mails.length > 0) && (
            <div className="mb-4 flex items-center gap-4">
              <Avatar>
                {mail.avatar && (
                  <AvatarImage src={mail.avatar} alt={mail.name} />
                )}
                <AvatarFallback>{mail.avatarFallback}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{mail.name}</div>
                <div className="text-xs text-muted-foreground">
                  {mail.email}
                </div>
              </div>
              <div className="ml-auto text-xs text-muted-foreground">
                {format(new Date(mail.date), "PPpp")}
              </div>
            </div>
          )}
          {!(currentFolder === "sent" && mail.replyToId && mails.length > 0) && (
            currentFolder === "drafts" ? (
              isEditingDraft ? (
                <div className="mb-4 space-y-4">
                  <input
                    className="w-full rounded border px-3 py-2 text-base bg-background text-foreground"
                    value={draftSubject}
                    onChange={(e) => setDraftSubject(e.target.value)}
                    placeholder="Subject"
                  />
                  <Textarea
                    value={draftBody}
                    onChange={(e) => setDraftBody(e.target.value)}
                    placeholder="Type your email here..."
                    rows={8}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveDraft}
                      disabled={
                        !draftSubject.trim() && !draftBody.trim()
                      }
                    >
                      Save Draft
                    </Button>
                    <Button
                      onClick={handleSendDraft}
                      disabled={
                        !draftSubject.trim() || !draftBody.trim()
                      }
                    >
                      Send
                    </Button>
                    <Button variant="outline" onClick={handleAIWrite}>
                      <Bot className="h-4 w-4 mr-2" />
                      AI Write Email
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mb-4 space-y-2 relative">
                  <div className="font-semibold">{draftSubject}</div>
                  <div
                    ref={draftBodyRef}
                    className="whitespace-pre-line text-sm max-h-[300px] overflow-hidden relative"
                    style={{ position: "relative" }}
                  >
                    {draftBody}
                    {showOverlay && (
                      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background/95 to-transparent flex items-end justify-center pointer-events-none" />
                    )}
                  </div>
                  {showOverlay ? (
                    <button
                      className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded bg-primary text-primary-foreground shadow-lg pointer-events-auto"
                      onClick={() => setIsEditingDraft(true)}
                    >
                      Edit Email
                    </button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditingDraft(true)}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              )
            ) : (
              <div className="mb-4 whitespace-pre-line text-sm">{mail.text}</div>
            )
          )}
          {mail.attachments && mail.attachments.length > 0 && (
            <>
              <Separator className="mt-4" />
              <div className="p-4">
                <h3 className="text-sm font-medium mb-2">Attachments</h3>
                <div className="flex gap-2 flex-wrap">
                  {mail.attachments.map((att) => (
                    <Button
                      variant="outline"
                      size="sm"
                      key={att.name}
                      className="bg-background text-foreground"
                    >
                      <Paperclip className="h-3 w-3 mr-2" />
                      {att.name} ({att.size})
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
          {mail.replies && mail.replies.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-bold mb-4">Replies</h3>
              {mail.replies.map((reply, idx) => (
                <div key={idx} className="mb-4 rounded-lg border bg-muted p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">{reply.sender}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(reply.date), "PPpp")}
                    </div>
                  </div>
                  <div className="text-sm whitespace-pre-line">{reply.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        {showReply && (
          <div className="p-4 bg-background border-t">
            <div className="grid gap-4">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply here..."
                className="p-4"
                rows={3}
                autoFocus
              />
              <div className="flex items-center">
                <Button
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                >
                  Send Reply
                </Button>
                <div className="ml-auto flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReplyText("Sounds good, thanks!")}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Smart Reply
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bot className="h-4 w-4 mr-2" />
                    Summarize
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Forward Dialog */}
        <Dialog open={showForwardDialog} onOpenChange={setShowForwardDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Forward Email</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Recipient's email address"
                value={forwardTo}
                onChange={e => setForwardTo(e.target.value)}
                autoFocus
              />
              <Input
                placeholder="Subject"
                value={forwardSubject}
                onChange={e => setForwardSubject(e.target.value)}
              />
              <Textarea
                rows={8}
                value={forwardBody}
                onChange={e => setForwardBody(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                onClick={handleSendForward}
                disabled={!forwardTo.trim() || !forwardSubject.trim() || !forwardBody.trim() || isForwarding}
              >
                {isForwarding ? "Sending..." : "Send"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Label Dialog */}
        <Dialog open={showLabelDialog} onOpenChange={setShowLabelDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Add Label</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm">Select existing label:</label>
                <select
                  className="border rounded px-2 py-1 text-sm bg-background"
                  value={newLabelName && labels.some(l => l.name === newLabelName) ? newLabelName : ''}
                  onChange={e => {
                    const selected = labels.find(l => l.name === e.target.value)
                    if (selected) {
                      setNewLabelName(selected.name)
                      setNewLabelColor(selected.color)
                    }
                  }}
                >
                  <option value="">-- Select label --</option>
                  {labels.map(label => (
                    <option key={label.name} value={label.name}>{label.name}</option>
                  ))}
                </select>
              </div>
              <Input
                placeholder="Label name"
                value={newLabelName}
                onChange={e => setNewLabelName(e.target.value)}
                autoFocus
              />
              <div className="flex items-center gap-2">
                <span className="text-sm">Color:</span>
                <div className="flex gap-2">
                  {softColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center focus:outline-none ${newLabelColor === color ? 'border-black dark:border-white ring-2 ring-primary' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewLabelColor(color)}
                    >
                      {newLabelColor === color && (
                        <span className="w-3 h-3 rounded-full bg-white border border-black dark:border-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleAddLabel}
                disabled={!newLabelName.trim()}
              >
                Add Label
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
