import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "./useAuth"

interface Props {
    children: ReactNode
}

const AuthenticatedRoute = ({ children }: Props) => {
    const location = useLocation()
    const { isAuthenticated } = useAuth()
    let url = "/account/authenticate/webauthn"
    if (!location.pathname.includes("logout")) {
        url += `?next=${encodeURIComponent(location.pathname + location.search)}`
    }

    if (isAuthenticated) {
        return children
    } else {
        return <Navigate to={url} />
    }
}

export default AuthenticatedRoute
