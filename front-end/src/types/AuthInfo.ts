import type { Flow, User } from "../api/models/allauth"

export interface AuthInfo {
    isAuthenticated: boolean
    requiresReauthentication: boolean
    user: User | null
    pendingFlow: Flow | undefined
}
