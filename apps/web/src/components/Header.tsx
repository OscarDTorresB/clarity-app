import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth"
import { motion } from "motion/react"

export default function Header() {
  const { status, user, signOut, signInHosted } = useAuthStore()
  const navigate = useNavigate()
  const onSignOut = async () => {
    await signOut()
    navigate("/login", { replace: true })
  }

  return (
    <motion.header
      className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link to="/" className="font-semibold tracking-wide text-primary">Clarity</Link>
        <div className="flex items-center gap-2">
          {status === "authenticated" ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">{user?.username}</span>
              <Button variant="outline" onClick={onSignOut}>Sign out</Button>
            </>
          ) : (
            <Button onClick={signInHosted}>Sign in</Button>
          )}
        </div>
      </div>
    </motion.header>
  )
}
