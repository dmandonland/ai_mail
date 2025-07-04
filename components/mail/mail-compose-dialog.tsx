"use client"

import { useState } from "react"
import { CornerDownLeft, Paperclip, Mic, ImageIcon, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { sendEmailAction } from "@/app/mail/actions" // We'll create this action
import { DialogClose } from "@radix-ui/react-dialog"

interface MailComposeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaveDraft?: (draft: { to: string; subject: string; body: string }) => void
}

export function MailComposeDialog({ open, onOpenChange, onSaveDraft }: MailComposeDialogProps) {
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [wasSent, setWasSent] = useState(false)

  const handleSend = async () => {
    // In a real app, you'd have better form handling and validation
    const formData = new FormData()
    formData.append("to", to)
    formData.append("subject", subject)
    formData.append("body", body)

    const result = await sendEmailAction(formData)
    if (result.success) {
      toast.success("Mail Sent!", {
        description: `Your email to ${to} has been successfully sent.`,
      })
      onOpenChange(false)
      // Reset form
      setTo("")
      setSubject("")
      setBody("")
      setWasSent(true)
    } else {
      toast.error("Failed to send email", {
        description: result.message,
      })
    }
  }

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      if (!wasSent && (subject.trim() || body.trim())) {
        onSaveDraft?.({ to, subject, body })
      }
      setTo("")
      setSubject("")
      setBody("")
      setWasSent(false)
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-[625px] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Compose New Mail</DialogTitle>
          <DialogDescription>Draft your email below. Click send when you&apos;re ready.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 p-6 pt-0">
          <div className="grid gap-2">
            <Label htmlFor="to">To</Label>
            <Input id="to" placeholder="recipient@example.com" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Email Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="body">Body</Label>
            <Textarea
              id="body"
              placeholder="Type your message here."
              className="min-h-[200px]"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row items-center justify-between p-6 pt-0 border-t">
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-9 w-9">
                    <Paperclip className="h-4 w-4" />
                    <span className="sr-only">Attach file</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Attach File</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-9 w-9">
                    <Mic className="h-4 w-4" />
                    <span className="sr-only">Use Microphone</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Use Microphone</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-9 w-9">
                    <ImageIcon className="h-4 w-4" />
                    <span className="sr-only">Insert Photo</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Insert Photo</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-9 w-9">
                    <Sparkles className="h-4 w-4" />
                    <span className="sr-only">AI Assist Compose</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">AI Assist (Conceptual)</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-background text-foreground" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="bg-[#A24AD9] text-primary-foreground" onClick={handleSend}>
              Send <CornerDownLeft className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
