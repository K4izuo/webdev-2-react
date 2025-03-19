import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log({ email, password, rememberMe })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/50 font-sans">
      <Card className="flex flex-col md:flex-row w-full max-w-[800px] overflow-hidden rounded-2xl shadow-lg">
        {/* Left side - Blue section */}
        <div className="flex-1 bg-primary text-primary-foreground flex items-center justify-center p-8 text-center">
          <div className="max-w-[220px]">
            <h2 className="font-mono text-2xl font-bold mt-4 mb-2">Be Verified</h2>
            <p className="opacity-90 text-sm leading-relaxed">Join experienced Designers on this platform.</p>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex-1 p-8">
          <div className="max-w-[320px] mx-auto">
            <h1 className="text-2xl font-semibold text-center mb-1">LOGIN</h1>
            <p className="text-muted-foreground text-center text-sm mb-6">We are happy to have you back.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  id="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Input
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground">
                    Remember Me
                  </Label>
                </div>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot Password?
                </a>
              </div>

              <Button type="submit" className="w-full">
                Login
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have account?{" "}
                <a href="#" className="text-primary hover:underline">
                  Sign Up
                </a>
              </p>
            </form>
          </div>
        </div>
      </Card>
    </div>
  )
}

