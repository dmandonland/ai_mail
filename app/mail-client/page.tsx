

import { MailLayout } from "@/components/mail/mail-layout"
import { cookies } from "next/headers"

export default async function MailPage() {
  const cookiesStore = await cookies()
  const layout = cookiesStore.get("react-resizable-panels:layout")
  const collapsed = cookiesStore.get("react-resizable-panels:collapsed")
 

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground flex flex-col">
      {/* You could add a global header/navbar for the app here if needed */}
      {/* <header className="h-14 border-b flex items-center px-4">App Name</header> */}
      <div className="flex-grow">
        <MailLayout defaultLayout={defaultLayout} defaultCollapsed={defaultCollapsed} navCollapsedSize={4} />
      </div>
    </div>
  )
}
