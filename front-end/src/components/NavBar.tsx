import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import type { FC } from "react"
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
                        {isAuthenticated ? <NavBarItem to="/modules" name="Modules" /> : null}
                        <Popover>
                            <PopoverButton className="block text-sm/6 font-semibold text-white/50 focus:outline-none data-active:text-white data-focus:outline data-focus:outline-white data-hover:text-white">
                                {t("NavBar.language")}
                            </PopoverButton>
                            <PopoverPanel
                                transition
                                anchor="bottom"
                                className="divide-y divide-white/5 rounded-xl bg-white/5 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0"
                            >
                                {({ close }) => (
                                    <div className="p-3">
                                        {languageOptions.map((language) => (
                                            <LanguageButton key={language} language={language} close={close} />
                                        ))}
                                    </div>
                                )}
                            </PopoverPanel>
                        </Popover>
                        {user ? <NavBarItem to="/account/my" name={user.username ?? ""} /> : null}
                        {isAuthenticated ? <NavBarItem to="/account/logout" name="Logout" /> : null}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default NavBar
