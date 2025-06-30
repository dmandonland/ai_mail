import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4">AI Mail Client</h1>
        <p className="text-muted-foreground mb-8">Navigate to the sign-in page or the mail client demo.</p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/auth/sign-in">Sign-In Page</Link>
          </Button>
          {/* <Button asChild variant="secondary">
            <Link href="/mail-client">Mail Client</Link>
          </Button> */}
        </div>
      </div>
    </div>
  )
}
