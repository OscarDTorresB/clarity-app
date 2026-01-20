import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/stores/auth"
import { motion } from "motion/react"

export default function Dashboard() {
  const { user } = useAuthStore()
  return (
    <motion.div
      className="mx-auto max-w-3xl p-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <Card className="border-border/60 bg-card/80 shadow-2xl shadow-black/30 backdrop-blur">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>You're signed in{user?.firstName ? ` as ${[user.firstName, user.lastName].filter(Boolean).join(" ")}` : ""}.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <motion.p className="text-sm text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            This is a protected page. Replace with your app content.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Button asChild>
              <a href="https://docs.amplify.aws/javascript/build-a-backend/auth/manage-user-session/" target="_blank" rel="noreferrer">
                Amplify Auth Docs
              </a>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
