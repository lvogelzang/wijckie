import { useContext, useEffect, type FC } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { ensureCsrfToken, UserSettingsContext } from "./contexts/UserSettingsContext"
import DashboardPage from "./pages/DashboardPage"
import LoginPage from "./pages/LoginPage"
import LogoutPage from "./pages/LogoutPage"

const MainLayout: FC = () => {
    const { loading, reloadUserSettings } = useContext(UserSettingsContext)

    useEffect(() => {
        ensureCsrfToken()
        reloadUserSettings()
    }, [reloadUserSettings])

    return loading ? (
        <div>loading...</div>
    ) : (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
    )
}

export default MainLayout
