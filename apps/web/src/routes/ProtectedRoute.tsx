import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuthStore } from "@/stores/auth"

export default function ProtectedRoute() {
  const { status } = useAuthStore()
  const location = useLocation()

  if (status === "idle" || status === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="size-3 animate-spin rounded-full border-2 border-ring border-t-transparent" />
          <span>Checking session…</span>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    const params = new URLSearchParams({ returnTo: location.pathname + location.search })
    return <Navigate to={`/login?${params.toString()}`} replace />
  }

  return <Outlet />
}
