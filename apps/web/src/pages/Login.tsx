import type { FormEvent } from "react"
import { useMemo, useState } from "react"
import { motion } from "motion/react"
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

  const cardMotion = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45 },
  }

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  }

  const item = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div className="flex min-h-[80vh] items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <motion.div {...cardMotion}>
        <Card className="w-full max-w-sm border-border/60 bg-card/80 shadow-2xl shadow-black/40 backdrop-blur">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Use your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.form onSubmit={onSubmit} className="grid gap-4" variants={stagger} initial="hidden" animate="show">
            <motion.div className="grid gap-2" variants={item}>
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
            </motion.div>
            <motion.div className="grid gap-2" variants={item}>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            </motion.div>
            {(formError || error) && (
              <motion.p className="text-sm text-destructive" variants={item}>{formError ?? error}</motion.p>
            )}
            <motion.div variants={item}>
              <Button type="submit" disabled={status === "loading"} className="w-full">
              {status === "loading" ? "Signing in…" : "Sign in"}
              </Button>
            </motion.div>
          </motion.form>
          <Separator className="my-4" />
          <motion.div className="grid gap-2" variants={stagger} initial="hidden" animate="show">
            <motion.div variants={item}>
              <Button variant="outline" onClick={signInHosted} disabled={status === "loading"} className="w-full">
              Continue with Cognito
              </Button>
            </motion.div>
          </motion.div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">You may be redirected to your IdP.</p>
        </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  )
}
