import type { FC, ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "./useAuth"

interface Props {
    children: ReactNode
}

const AnonymousRoute: FC<Props> = ({ children }) => {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return children
    } else {
        return <Navigate to="/dashboard" />
    }
}

export default AnonymousRoute
