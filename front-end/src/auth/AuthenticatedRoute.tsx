import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "./useAuth"

interface Props {
    children: ReactNode
}

const AuthenticatedRoute = ({ children }: Props) => {
    const location = useLocation()
    const { isAuthenticated } = useAuth()
    const next = `next=${encodeURIComponent(location.pathname + location.search)}`

    if (isAuthenticated) {
        return children
    } else {
        return <Navigate to={`/account/authenticate/webauthn?${next}`} />
    }
}

export default AuthenticatedRoute
