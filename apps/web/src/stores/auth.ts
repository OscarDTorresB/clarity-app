import { create } from "zustand"
import {
  getCurrentUser,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  signInWithRedirect,
} from "aws-amplify/auth"

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated"

type User = {
  userId: string
  username: string
  signInDetails?: unknown
} | null

type AuthState = {
  status: AuthStatus
  user: User
  error?: string
  init: () => Promise<void>
  signIn: (username: string, password: string) => Promise<void>
  signInHosted: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  status: "idle",
  user: null,

  async init() {
    set({ status: "loading", error: undefined })
    try {
      const user = await getCurrentUser()
      set({ user: { userId: user.userId, username: user.username, signInDetails: user.signInDetails }, status: "authenticated" })
    } catch {
      set({ user: null, status: "unauthenticated" })
    }
  },

  async signIn(username, password) {
    set({ status: "loading", error: undefined })
    try {
      await amplifySignIn({ username, password })
      const user = await getCurrentUser()
      set({ user: { userId: user.userId, username: user.username, signInDetails: user.signInDetails }, status: "authenticated" })
    } catch (e: unknown) {
      console.error("Sign in error:", e)
      set({ error: "Sign in failed", status: "unauthenticated" })
    }
  },

  async signInHosted() {
    try {
      await signInWithRedirect()
    } catch (e: unknown) {
      console.error("Redirect sign in error:", e)
      set({ error: "Redirect sign in failed" })
    }
  },

  async signOut() {
    set({ status: "loading" })
    try {
      await amplifySignOut()
    } finally {
      set({ user: null, status: "unauthenticated" })
    }
  },
}))
