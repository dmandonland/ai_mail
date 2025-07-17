import LogoEnter from "@/components/motion/enteranimation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from '@/lib/server/supabase'





export default function HomePage() {

  const supabase = createClient()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <LogoEnter/>
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4">AI Mail Solution</h1>
        <p className="text-muted-foreground mb-8">Where AI revolutionalizes E-mail Communication</p>
        <div className="flex gap-4 justify-center">
          <Button className="bg-[#A24AD9]" asChild>
            <Link href="/auth/sign-in">Sign-In</Link>
          </Button>
          {/* <Button asChild variant="secondary">
            <Link href="/mail-client">Mail Client</Link>
          </Button> */}
        </div>
      </div>
    </div>
  )
}
