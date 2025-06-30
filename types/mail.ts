import type React from "react"
export interface Account {
  id: string
  label: string
  email: string
  icon?: React.ReactNode
}

export interface Mail {
  id: string
  accountId: string
  name: string
  email: string
  subject: string
  text: string
  date: string
  read: boolean
  labels: string[]
  avatar?: string
  avatarFallback: string
  folder: "inbox" | "sent" | "drafts" | "junk" | "trash" | "archive"
  attachments?: { name: string; size: string; type: string }[]
  replies?: { text: string; date: string; sender: string }[]
  replyToId?: string
  starred?: boolean
}

export type MailFolder = Mail["folder"]

export interface MailState {
  accounts: Account[]
  mails: Mail[]
  selectedAccount: Account["id"] | null
  selectedFolder: MailFolder
  selectedMail: Mail["id"] | null
}
