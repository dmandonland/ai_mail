import type React from "react"
import type { Mail, Account, MailFolder } from "@/types/mail"
import { Inbox, Send, FileText, Archive, Trash2, AlertOctagon, Users, Tags, Settings, } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

// Fetch accounts from Supabase
export async function fetchAccounts(): Promise<Account[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("accounts").select("*");
  if (error) {
    console.error("Error fetching accounts from Supabase:", error);
    return [];
  }
  return data || [];
}

export const mails: Mail[] = [
  {
    id: "mail-1",
    accountId: "account-1",
    name: "Olivia Davis",
    email: "olivia.davis@example.com",
    subject: "Project Update & Next Steps",
    text: "Hi team,\n\nJust a quick update on the project. We've hit milestone A and are on track for milestone B. Please review the attached document for detailed progress.\n\nNext steps involve finalizing the UI mockups. Let's sync on this tomorrow.\n\nBest,\nOlivia",
    date: "2024-10-24T10:30:00Z",
    read: false,
    labels: ["work", "important"],
    avatar: "/placeholder.svg?width=40&height=40",
    avatarFallback: "OD",
    folder: "inbox",
    replies: [],
    attachments: [{ name: "Progress_Report.pdf", size: "2.5MB", type: "pdf" }],
    starred: false,
  },
  {
    id: "mail-2",
    accountId: "account-1",
    name: "John Doe",
    email: "john.doe@example.com",
    subject: "Weekend Plans - BBQ?",
    text: "Hey!\n\nAre you free this weekend? Thinking of hosting a BBQ on Saturday if the weather holds up. Let me know if you can make it!\n\nCheers,\nJohn",
    date: "2024-10-23T14:15:00Z",
    read: true,
    labels: ["personal"],
    avatar: "/placeholder.svg?width=40&height=40",
    avatarFallback: "JD",
    folder: "inbox",
    replies: [],
    starred: false,
  },
  {
    id: "mail-3",
    accountId: "account-1",
    name: "Acme Corp Newsletter",
    email: "newsletter@acme.com",
    subject: "This Month's Top Deals!",
    text: "Hello valued customer,\n\nCheck out our exclusive deals for October! Save up to 50% on select items. Don't miss out!\n\n[Link to Deals]\n\nThanks,\nThe Acme Team",
    date: "2024-10-22T09:00:00Z",
    read: false,
    labels: ["promotions"],
    avatar: "/placeholder.svg?width=40&height=40",
    avatarFallback: "AC",
    folder: "inbox",
    replies: [],
    starred: false,
  },
  {
    id: "mail-4b",
    accountId: "account-2",
    name: "Your Bank",
    email: "security@yourbank.com",
    subject: "Security Alert: New Device Login",
    text: "Dear Customer,\n\nWe detected a new login to your account from an unrecognized device. If this was not you, please secure your account immediately.\n\n[Link to Secure Account]\n\nSincerely,\nYour Bank Security Team",
    date: "2024-10-24T11:00:00Z",
    read: false,
    labels: ["important", "security"],
    avatar: "/placeholder.svg?width=40&height=40",
    avatarFallback: "YB",
    folder: "inbox",
    replies: [],
    starred: false,
  },
  {
    id: "mail-5",
    accountId: "account-1",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    subject: "Re: Project Update & Next Steps",
    text: "Hi Olivia,\n\nThanks for the update! The progress looks great. I've reviewed the document and have a few minor comments. I'll share them during our sync tomorrow.\n\nLooking forward to it.\n\nBest,\nJane",
    date: "2024-10-24T12:05:00Z",
    read: true,
    labels: ["work"],
    avatar: "/placeholder.svg?width=40&height=40",
    avatarFallback: "JS",
    folder: "sent",
    replies: [],
    starred: false,
  },
  {
    id: "mail-6b",
    accountId: "account-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    subject: "Re: Project Update & Next Steps",
    text: "Hi Olivia,\n\nThanks for the update! The progress looks great. I've reviewed the document and have a few minor comments. I'll share them during our sync tomorrow.\n\nLooking forward to it.\n\nBest,\nJane",
    date: "2024-10-24T12:05:00Z",
    read: true,
    labels: ["work"],
    avatar: "/placeholder.svg?width=40&height=40",
    avatarFallback: "JS",
    folder: "sent",
    replies: [],
    starred: false,
  },
  {
    id: "mail-7b",
    accountId: "account-2",
    name: "Draft Email",
    email: "alicia@example.com",
    subject: "Follow up on client meeting",
    text: "Hi [Client Name],\n\nJust wanted to follow up on our meeting from yesterday regarding...",
    date: "2024-10-21T16:00:00Z",
    read: true,
    labels: [],
    avatarFallback: "AK",
    folder: "drafts",
    replies: [],
    starred: false,
  },
  {
    id: "mail-8b",
    accountId: "account-2",
    name: "Tech Conference",
    email: "events@techconf.com",
    subject: "Your Ticket for TechCon 2024",
    text: "Hi Bob,\n\nYour ticket for TechCon 2024 is attached. We can't wait to see you there!\n\nBest,\nThe TechCon Team",
    date: "2024-10-20T11:45:00Z",
    read: true,
    labels: ["work", "events"],
    avatarFallback: "TC",
    folder: "inbox",
    replies: [],
    starred: false,
  },
  {
    id: "mail-9b",
    accountId: "account-2",
    name: "Online Store",
    email: "deals@shoponline.com",
    subject: "You Won a Prize!",
    text: "CONGRATULATIONS! You've won a special prize. Click here to claim it NOW!",
    date: "2024-10-19T18:00:00Z",
    read: false,
    labels: ["spam"],
    avatarFallback: "OS",
    folder: "junk",
    replies: [],
    starred: false,
  },
  {
    id: "mail-10b",
    accountId: "account-2",
    name: "Old Project Group",
    email: "archive@projects.com",
    subject: "Archived: Project Phoenix Files",
    text: "This thread contains all files for the now-completed Project Phoenix. Archiving for records.",
    date: "2023-01-15T09:30:00Z",
    read: true,
    labels: ["archive"],
    avatarFallback: "OP",
    folder: "archive",
    replies: [],
    starred: false,
  },
  // New emails for Alicia Keys (account-1)
  {
    id: "mail-11",
    accountId: "account-1",
    name: "Galaxy Airlines",
    email: "noreply@galaxy-airlines.com",
    subject: "Your flight details for G-1234",
    text: "Dear Alicia,\n\nYour flight G-1234 to London is confirmed for October 28th. Please find your e-ticket attached.\n\nThank you for flying with us.",
    date: "2024-10-25T08:00:00Z",
    read: false,
    labels: ["travel", "important"],
    avatarFallback: "GA",
    folder: "inbox",
    replies: [],
    starred: false,
  },
  {
    id: "mail-12",
    accountId: "account-1",
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    subject: "Re: Dinner on Friday?",
    text: "Hey Alicia,\n\nThat sounds great! I'm free after 7 PM. Let's go to that new Italian place we talked about.\n\nBest,\nMaria",
    date: "2024-10-24T18:30:00Z",
    read: true,
    labels: ["personal"],
    avatarFallback: "MG",
    folder: "inbox",
    replies: [],
    starred: false,
  },
  {
    id: "mail-13",
    accountId: "account-1",
    name: "Creative Team",
    email: "creative-team@work.com",
    subject: "Design Mockups Attached",
    text: "Hi Team,\n\nPlease find the latest design mockups for the new landing page attached. Let me know your feedback by EOD.\n\nThanks,\nAlicia",
    date: "2024-10-25T11:00:00Z",
    read: true,
    labels: ["work"],
    avatarFallback: "CT",
    folder: "sent",
    replies: [],
    starred: false,
  },
  {
    id: "mail-14",
    accountId: "account-1",
    name: "Social-Connect",
    email: "notification@social-connect.net",
    subject: "You have 5 unread messages!",
    text: "You have new messages waiting for you. Log in to see what you've missed!",
    date: "2024-10-25T10:15:00Z",
    read: false,
    labels: ["spam"],
    avatarFallback: "SC",
    folder: "junk",
    replies: [],
    starred: false,
  },
  {
    id: "mail-15",
    accountId: "account-1",
    name: "Self",
    email: "alicia@example.com",
    subject: "Notes for Q4 planning",
    text: "Remember to bring up budget allocation for the new marketing campaign and the hiring plan for the design team.",
    date: "2024-10-24T15:00:00Z",
    read: true,
    labels: [],
    avatarFallback: "AK",
    folder: "drafts",
    replies: [],
    starred: false,
  },
  {
    id: "mail-16",
    accountId: "account-1",
    name: "ArtStation",
    email: "digest@artstation.com",
    subject: "Your weekly digest is here",
    text: "Check out this week's most popular artwork and trending artists.",
    date: "2024-10-23T09:00:00Z",
    read: true,
    labels: ["promotions"],
    avatarFallback: "AS",
    folder: "inbox",
    replies: [],
    starred: false,
  },
  // New emails for Bob Marley (account-2)
  {
    id: "mail-27",
    accountId: "account-2",
    name: "CloudServices Inc.",
    email: "security@cloudservices.com",
    subject: "Action Required: Verify Your Login",
    text: "Hi Bob,\n\nA new device signed into your account. If this was you, you can ignore this email. If not, please secure your account immediately.",
    date: "2024-10-25T07:45:00Z",
    read: false,
    labels: ["security", "important"],
    avatarFallback: "CS",
    folder: "inbox",
    replies: [],
    starred: false,
  },
  {
    id: "mail-18",
    accountId: "account-2",
    name: "Ziggy",
    email: "ziggy@example.com",
    subject: "Weekend Jam Session",
    text: "Hey Bob, you free for a jam session this Saturday afternoon? Got some new tunes I want to try out.",
    date: "2024-10-24T14:20:00Z",
    read: true,
    labels: ["music", "personal"],
    avatarFallback: "Z",
    folder: "inbox",
    replies: [],
    starred: false,
  },
  {
    id: "mail-19",
    accountId: "account-2",
    name: "The Band",
    email: "band@example.com",
    subject: "Re: Rehearsal schedule",
    text: "Confirming rehearsal for this Thursday at 6 PM. See you all there.",
    date: "2024-10-23T17:00:00Z",
    read: true,
    labels: ["music"],
    avatarFallback: "B",
    folder: "sent",
    replies: [],
    starred: false,
  },
  {
    id: "mail-20",
    accountId: "account-2",
    name: "Rita",
    email: "rita@example.com",
    subject: "FW: Old concert photos",
    text: "Check out these photos from the '08 tour! Good times.",
    date: "2023-05-10T12:00:00Z",
    read: true,
    labels: ["archive"],
    avatarFallback: "R",
    folder: "archive",
    replies: [],
    starred: false,
  },
  {
    id: "mail-21",
    accountId: "account-2",
    name: "Guitar World",
    email: "orders@guitarworld.com",
    subject: "Your order has been shipped!",
    text: "Your order #GW-5678, containing a new set of strings and a capo, has been shipped and will arrive in 3-5 business days.",
    date: "2024-10-22T16:30:00Z",
    read: true,
    labels: ["shopping"],
    avatarFallback: "GW",
    folder: "inbox",
    replies: [],
    starred: false,
  },
  {
    id: "mail-22",
    accountId: "account-2",
    name: "Delivery Service",
    email: "track@delivery-pro.net",
    subject: "URGENT: Your package is waiting",
    text: "We were unable to deliver your package. Please click here to reschedule delivery.",
    date: "2024-10-21T10:00:00Z",
    read: false,
    labels: ["spam"],
    avatarFallback: "DS",
    folder: "junk",
    replies: [],
    starred: false,
  },
  {
    id: "mail-51",
    accountId: "account-1",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    subject: "Design Review Meeting - Tomorrow",
    text: "Hi Alicia,\n\nJust a reminder about our design review meeting tomorrow at 2 PM EST. I've attached the latest mockups for discussion.\n\nLooking forward to your feedback!\n\nBest regards,\nSarah",
    date: "2025-07-03T09:30:00Z",
    read: false,
    labels: ["work", "design"],
    avatar: "/placeholder.svg?width=40&height=40",
    avatarFallback: "SC",
    folder: "inbox",
    replies: [],
    attachments: [{ name: "UI_Mockups_V2.pdf", size: "4.2MB", type: "pdf" }],
    starred: true,
  },
  {
    id: "mail-38",
    accountId: "account-2",
    name: "Spotify Premium",
    email: "no-reply@spotify.com",
    subject: "Your July Premium Features",
    text: "Hey there!\n\nYour July Premium benefits are here! Check out our new AI-powered playlist creator and exclusive artist content.\n\nEnjoy your premium experience!\n\nSpotify Team",
    date: "2025-07-03T08:15:00Z",
    read: false,
    labels: ["promotions"],
    avatar: "/placeholder.svg?width=40&height=40",
    avatarFallback: "SP",
    folder: "inbox",
    replies: [],
    starred: false,
  },
  {
    id: "mail-13",
    accountId: "account-1",
    name: "Team Calendar",
    email: "calendar@company.com",
    subject: "Meeting Reminder: Q3 Planning",
    text: "This is a reminder that you have an upcoming meeting:\n\nQ3 Planning Session\nDate: July 4, 2025\nTime: 10:00 AM - 11:30 AM EST\nLocation: Virtual (Zoom)\n\nAgenda will be shared 1 hour before the meeting.",
    date: "2025-07-03T07:00:00Z",
    read: true,
    labels: ["work", "important"],
    avatar: "/placeholder.svg?width=40&height=40",
    avatarFallback: "TC",
    folder: "inbox",
    replies: [],
    starred: false,
  },
  {
    id: "mail-14",
    accountId: "account-1",
    name: "Michael Rodriguez",
    email: "m.rodriguez@example.com",
    subject: "Vacation Photos!",
    text: "Hey!\n\nFinally got around to sharing those vacation photos from our trip to Hawaii. You can find them in the shared Google Photos album.\n\nSuch great memories!\n\nCheers,\nMike",
    date: "2025-07-02T23:45:00Z",
    read: false,
    labels: ["personal"],
    avatar: "/placeholder.svg?width=40&height=40",
    avatarFallback: "MR",
    folder: "inbox",
    replies: [],
    starred: true,
  },
  {
    id: "mail-25",
    accountId: "account-1",
    name: "GitHub",
    email: "noreply@github.com",
    subject: "Security Alert: New SSH Key Added",
    text: "Hello Alicia,\n\nA new SSH key was added to your GitHub account on July 2, 2025.\n\nIf you did not make this change, please review your account security immediately.\n\nBest,\nGitHub Security",
    date: "2025-07-02T22:30:00Z",
    read: false,
    labels: ["important", "security"],
    avatar: "/placeholder.svg?width=40&height=40",
    avatarFallback: "GH",
    folder: "inbox",
    replies: [],
    starred: false,
  },
  {
    id: "mail-16",
    accountId: "account-2",
    name: "Concert Tickets",
    email: "tickets@venue.com",
    subject: "Your Tickets for Summer Jam 2025",
    text: "Dear Bob,\n\nThank you for your purchase! Attached are your e-tickets for Summer Jam 2025.\n\nEvent Details:\nDate: July 15, 2025\nTime: 7:00 PM\nVenue: Central Park Arena\n\nPlease present these at the entrance.\n\nEnjoy the show!",
    date: "2025-07-03T10:00:00Z",
    read: false,
    labels: ["personal", "important"],
    avatar: "/placeholder.svg?width=40&height=40",
    avatarFallback: "CT",
    folder: "inbox",
    replies: [],
    attachments: [{ name: "SummerJam_Tickets.pdf", size: "1.8MB", type: "pdf" }],
    starred: true,
  },
  {
    id: "mail-17",
    accountId: "account-2",
    name: "Recording Studio",
    email: "bookings@studio.com",
    subject: "Studio Session Confirmation",
    text: "Hi Bob,\n\nThis email confirms your studio session for tomorrow, July 4th, from 2 PM to 6 PM.\n\nOur sound engineer Mike will be there to assist you.\n\nSee you tomorrow!\n\nBest regards,\nStudio Team",
    date: "2025-07-03T09:45:00Z",
    read: false,
    labels: ["work"],
    avatar: "/placeholder.svg?width=40&height=40",
    avatarFallback: "RS",
    folder: "inbox",
    replies: [],
    starred: false,
  },
  {
    id: "mail-28",
    accountId: "account-2",
    name: "Charity Foundation",
    email: "events@charity.org",
    subject: "Speaking Opportunity: Youth Music Program",
    text: "Dear Mr. Marley,\n\nWe would be honored to have you as a guest speaker at our Youth Music Program next month. Your experience would be invaluable to our young musicians.\n\nPlease let us know if you're interested in participating.\n\nWarm regards,\nCharity Foundation Team",
    date: "2025-07-03T08:30:00Z",
    read: true,
    labels: ["work", "important"],
    avatar: "/placeholder.svg?width=40&height=40",
    avatarFallback: "CF",
    folder: "inbox",
    replies: [],
    starred: true,
  },
  {
    id: "mail-19",
    accountId: "account-2",
    name: "Travel Agency",
    email: "bookings@travel.com",
    subject: "Jamaica Trip Itinerary",
    text: "Hello Bob,\n\nAttached is your detailed itinerary for your upcoming trip to Jamaica (August 1-15, 2025).\n\nIncludes:\n- Flight details\n- Hotel reservations\n- Local transportation\n\nPlease review and let us know if any changes are needed.\n\nBest regards,\nYour Travel Team",
    date: "2025-07-03T07:15:00Z",
    read: false,
    labels: ["travel", "important"],
    avatar: "/placeholder.svg?width=40&height=40",
    avatarFallback: "TA",
    folder: "inbox",
    replies: [],
    attachments: [{ name: "Jamaica_Itinerary_2025.pdf", size: "3.1MB", type: "pdf" }],
    starred: false,
  },
  {
    id: "mail-20",
    accountId: "account-2",
    name: "Music Magazine",
    email: "editor@musicmag.com",
    subject: "Interview Request for August Issue",
    text: "Dear Bob,\n\nWe're planning a special feature for our August issue and would love to include an interview with you about your latest project and musical journey.\n\nWould you be available for a 1-hour video interview next week?\n\nBest regards,\nChief Editor",
    date: "2025-07-02T22:00:00Z",
    read: true,
    labels: ["work", "press"],
    avatar: "/placeholder.svg?width=40&height=40",
    avatarFallback: "MM",
    folder: "inbox",
    replies: [],
    starred: true,
  }
]

// Mail management functions
export const archiveMail = (mailId: string): boolean => {
  const mailIndex = mails.findIndex((mail) => mail.id === mailId)
  if (mailIndex !== -1) {
    mails[mailIndex] = { ...mails[mailIndex], folder: "archive" }
    return true
  }
  return false
}

export const deleteMail = (mailId: string): boolean => {
  const mailIndex = mails.findIndex((mail) => mail.id === mailId)
  if (mailIndex !== -1) {
    mails[mailIndex] = { ...mails[mailIndex], folder: "trash" }
    return true
  }
  return false
}

export const restoreMail = (mailId: string, targetFolder: MailFolder = "inbox"): boolean => {
  const mailIndex = mails.findIndex((mail) => mail.id === mailId)
  if (mailIndex !== -1) {
    mails[mailIndex] = { ...mails[mailIndex], folder: targetFolder }
    return true
  }
  return false
}

export const permanentlyDeleteMail = (mailId: string): boolean => {
  const mailIndex = mails.findIndex((mail) => mail.id === mailId)
  if (mailIndex !== -1) {
    mails.splice(mailIndex, 1)
    return true
  }
  return false
}

export const markAsRead = (mailId: string): boolean => {
  const mailIndex = mails.findIndex((mail) => mail.id === mailId)
  if (mailIndex !== -1) {
    mails[mailIndex] = { ...mails[mailIndex], read: true }
    return true
  }
  return false
}

export const markAsUnread = (mailId: string): boolean => {
  const mailIndex = mails.findIndex((mail) => mail.id === mailId)
  if (mailIndex !== -1) {
    mails[mailIndex] = { ...mails[mailIndex], read: false }
    return true
  }
  return false
}

export const navLinks: Record<MailFolder, { title: string; icon: React.ElementType; variant: "default" | "ghost" }> = {
  inbox: { title: "Inbox", icon: Inbox, variant: "ghost" },
  sent: { title: "Sent", icon: Send, variant: "ghost" },
  drafts: { title: "Drafts", icon: FileText, variant: "ghost" },
  junk: { title: "Junk", icon: AlertOctagon, variant: "ghost" },
  trash: { title: "Trash", icon: Trash2, variant: "ghost" },
  archive: { title: "Archive", icon: Archive, variant: "ghost" },
}

export const secondaryNavLinks = [
  { title: "Contacts", icon: Users, variant: "ghost" as const },
  { title: "Manage Labels", icon: Tags, variant: "ghost" as const },
  { title: "Settings", icon: Settings, variant: "ghost" as const },
]

export type UserLabel = {
  name: string;
  color: string;
};

export const userLabels: UserLabel[] = [
  { name: "work", color: "#6366f1" },
  { name: "personal", color: "#f59e42" },
  { name: "important", color: "#ef4444" },
  { name: "promotions", color: "#10b981" },
  { name: "security", color: "#fbbf24" },
]
