import type { FC } from "react"
import { NavDropdown } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { useAuth } from "../auth/useAuth"
import { languageOptions } from "../types/UserLanguageType"
import LanguageButton from "./LanguageButton"
import NavBarItem from "./NavBarItem"

const NavBar: FC = () => {
    const { t } = useTranslation()
    const { isAuthenticated, user } = useAuth()

    return (
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">
                    Wijckie
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarCollapse"
                    aria-controls="navbarCollapse"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <ul className="navbar-nav me-auto mb-2 mb-md-0">
                        {isAuthenticated ? <NavBarItem to="/dashboard" name="Dashboard" /> : null}
                        {isAuthenticated ? <NavBarItem to="/account/logout" name="Logout" /> : null}
                        {user ? <NavBarItem to="/account/my" name={user.username ?? ""} /> : null}
                        <NavDropdown title={t("NavBar.language")}>
                            {languageOptions.map((language) => (
                                <LanguageButton key={language} language={language} />
                            ))}
                        </NavDropdown>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default NavBar
