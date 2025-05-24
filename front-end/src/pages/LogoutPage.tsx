import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useIsAuthenticated, UserSettingsContext } from "../contexts/UserSettingsContext"
import { logout } from "../services/User"

const LogoutPage = () => {
    const isAuthenticated = useIsAuthenticated()
    const navigate = useNavigate()
    const { reloadUserSettings } = useContext(UserSettingsContext)

    useEffect(() => {
        logout().then(reloadUserSettings)
    }, [])

    useEffect(() => {
        console.log(isAuthenticated)
        if (!isAuthenticated) {
            navigate("/login")
        }
    }, [isAuthenticated])

    return null
}

export default LogoutPage
