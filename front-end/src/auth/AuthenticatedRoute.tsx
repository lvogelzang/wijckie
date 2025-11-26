import { makeUrl } from "@/helpers/LinkTreeHelper"
import useLinkTree from "@/hooks/UseLinkTree"
import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "./useAuth"

interface Props {
    children: ReactNode
}

const AuthenticatedRoute = ({ children }: Props) => {
    const location = useLocation()
    const { isAuthenticated } = useAuth()
    const l = useLinkTree()

    let url = makeUrl(l.ACCOUNT_LOGIN_WEBAUTHN, [])
    if (!location.pathname.includes(l.LOGOUT.slug)) {
        url += `?next=${encodeURIComponent(location.pathname + location.search)}`
    }

    if (isAuthenticated) {
        return children
    } else {
        return <Navigate to={url} />
    }
}

export default AuthenticatedRoute
