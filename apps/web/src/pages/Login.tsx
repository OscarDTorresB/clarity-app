import type { FormEvent } from "react"
import { useMemo, useState } from "react"
import { useSearchParams, Navigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuthStore } from "@/stores/auth"

export default function Login() {
  const { status, signIn, signInHosted, error } = useAuthStore()
  const [search] = useSearchParams()
  const returnTo = useMemo(() => search.get("returnTo") ?? "/", [search])

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [formError, setFormError] = useState<string | undefined>()

  if (status === "authenticated") {
    return <Navigate to={returnTo} replace />
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(undefined)
    if (!username || !password) {
      setFormError("Please enter username and password")
      return
    }
    await signIn(username, password)
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Use your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            </div>
            {(formError || error) && (
              <p className="text-sm text-destructive">{formError ?? error}</p>
            )}
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <Separator className="my-4" />
          <div className="grid gap-2">
            <Button variant="outline" onClick={signInHosted} disabled={status === "loading"}>
              Continue with Cognito
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">You may be redirected to your IdP.</p>
        </CardFooter>
      </Card>
    </div>
  )
}
