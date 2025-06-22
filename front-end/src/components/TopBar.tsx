import { type FC } from "react"
import { NavDropdown } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { useOptionalCurrentUser } from "../contexts/UserSettingsContext"
import { languageOptions } from "../types/UserLanguageType"
import LanguageButton from "./LanguageButton"

const TopBar: FC = () => {
    const { t } = useTranslation()
    const currentUser = useOptionalCurrentUser()

    return (
        <div>
            <NavDropdown title="LANGUAGE">
                {languageOptions.map((language) => (
                    <LanguageButton key={language} language={language} />
                ))}
            </NavDropdown>
            <h2>{currentUser?.username ?? t("TopBar.anonymous_user")}</h2>
            <div className="d-flex gap-2">
                <Link to="/login">{t("LoginPage.title")}</Link>
                <Link to="/dashboard">{t("DashboardPage.title")}</Link>
                <Link to="/logout">{t("Buttons.logout")}</Link>
            </div>
        </div>
    )
}

export default TopBar
