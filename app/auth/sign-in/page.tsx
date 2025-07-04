'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChromeIcon, CheckCircle2, CircleDashed } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function SignInPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [validators, setValidators] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  })

  useEffect(() => {
    setValidators({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
    })
  }, [password])

  const allValid = Object.values(validators).every(Boolean)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (allValid) {
      router.push("../mail-client")
    }
  }

  const getValidatorIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
    ) : (
      <CircleDashed className="mr-2 h-4 w-4 text-muted-foreground" />
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <form onSubmit={handleSubmit}>
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={handlePasswordChange}
              />
              <div className="validator-hint text-sm text-muted-foreground mt-2 grid gap-1">
                <p className={`flex items-center ${validators.length ? 'text-green-500' : ''}`}>
                  {getValidatorIcon(validators.length)}
                  Must be more than 8 characters
                </p>
                <p className={`flex items-center ${validators.number ? 'text-green-500' : ''}`}>
                  {getValidatorIcon(validators.number)}
                  At least one number
                </p>
                <p className={`flex items-center ${validators.lowercase ? 'text-green-500' : ''}`}>
                  {getValidatorIcon(validators.lowercase)}
                  At least one lowercase letter
                </p>
                <p className={`flex items-center ${validators.uppercase ? 'text-green-500' : ''}`}>
                  {getValidatorIcon(validators.uppercase)}
                  At least one uppercase letter
                </p>
              </div>
            </div>
            <Button type="submit" className="w-full bg-[#a24ad9]" disabled={!allValid}>
              Sign In
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <ChromeIcon className="mr-2 h-4 w-4" />
              Sign in with Google
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="./forgot-password" className="text-sm text-muted-foreground hover:text-primary">
              Forgot your password?
            </Link>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
