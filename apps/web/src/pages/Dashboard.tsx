import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/stores/auth"

export default function Dashboard() {
  const { user } = useAuthStore()
  return (
    <div className="mx-auto max-w-3xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>You're signed in{user?.username ? ` as ${user.username}` : ""}.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <p className="text-sm text-muted-foreground">
            This is a protected page. Replace with your app content.
          </p>
          <div>
            <Button asChild>
              <a href="https://docs.amplify.aws/javascript/build-a-backend/auth/manage-user-session/" target="_blank" rel="noreferrer">
                Amplify Auth Docs
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
