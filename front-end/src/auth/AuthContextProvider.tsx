import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { getAllauthClientV1AuthSession } from "../api/endpoints/allauth"
import type { AuthenticationMeta, AuthenticationMethod, Flow, User } from "../api/models/allauth"
import Loader from "../components/Loader"
import type { AuthInfo } from "../types/AuthInfo"
import { AuthContext } from "./AuthContext"

interface Props {
    children: ReactNode
}

// AuthenticationResponse | AuthenticatedResponse
type AllauthResponse = {
    data?: {
        methods?: AuthenticationMethod[]
        user?: User
        flows?: Flow[]
    }
    meta?: AuthenticationMeta
    status?: number
}

interface AuthChangeEvent extends Event {
    detail: AllauthResponse
}

const authInfo: (auth: AllauthResponse) => AuthInfo = (auth) => {
    let isAuthenticated = false
    let requiresReauthentication = false
    if (auth && auth?.status === 200) {
        isAuthenticated = true
    } else if (auth && auth.status === 401 && auth.meta && auth.meta.is_authenticated) {
        isAuthenticated = true
        requiresReauthentication = true
    }
    let user = null
    if (auth && auth.data?.user) {
        user = auth.data.user
    }
    const pendingFlow = auth ? auth.data?.flows?.find((flow) => flow.is_pending) : undefined
    return { isAuthenticated, requiresReauthentication, user, pendingFlow }
}

const AuthContextProvider = ({ children }: Props) => {
    const [auth, setAuth] = useState<AuthInfo | undefined>(undefined)

    const handleAuthUpdate = useCallback(
        (newAuth: AllauthResponse) => {
            setAuth(authInfo(newAuth))
        },
        [setAuth]
    )

    const handleAuthUpdateEvent = useCallback(
        (event: Event) => {
            handleAuthUpdate((event as AuthChangeEvent).detail)
        },
        [handleAuthUpdate]
    )

    useEffect(() => {
        document.addEventListener("allauth.auth.change", handleAuthUpdateEvent)

        getAllauthClientV1AuthSession("browser")
            .then((response) => handleAuthUpdate(response as AllauthResponse))
            .catch(() => {})

        return () => {
            document.removeEventListener("allauth.auth.change", handleAuthUpdateEvent)
        }
    }, [handleAuthUpdate, handleAuthUpdateEvent])

    const loading = useMemo(() => auth === undefined, [auth])

    return <AuthContext.Provider value={{ auth }}>{loading ? <Loader /> : children}</AuthContext.Provider>
}

export default AuthContextProvider
