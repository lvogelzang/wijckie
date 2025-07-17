import { createContext } from "react"
import type { AuthInfo } from "../types/AuthInfo"

interface AuthContextProps {
    auth: AuthInfo | undefined
}

const contextValue = {
    auth: undefined,
}

export const AuthContext = createContext<AuthContextProps>(contextValue)
