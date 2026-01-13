import { useAuth } from "@/auth/useAuth"
import { PopoverItemButton } from "@/components/ui/popover-item-button"
import { applyTheme, type Theme } from "@/helpers/Theme"
import { cn } from "@/lib/utils"
import { languageOptions } from "@/types/UserLanguageType"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faCircleUserCircleMoon, faGlobeAmericas } from "@fortawesome/sharp-solid-svg-icons"
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import Cookies from "js-cookie"
import { useCallback, useState, type MouseEvent } from "react"
import { useTranslation } from "react-i18next"

const Footer = () => {
    const { i18n } = useTranslation()
    const { t } = useTranslation()
    const { isAuthenticated } = useAuth()

    const [theme, setTheme] = useState<Theme>((localStorage.getItem("theme") as Theme) || "auto")

    const onClickLanguage = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            const target = event.target as HTMLButtonElement
            const value = target.id
            i18n.changeLanguage(value)
            Cookies.set("django_language", value)
        },
        [i18n]
    )

    const onClickTheme = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            const target = event.target as HTMLButtonElement
            const value = target.id
            if (!value) return
            setTheme(value as Theme)
            applyTheme(value as Theme)
        },
        [setTheme, applyTheme]
    )

    return (
        <footer className={cn("flex items-center justify-center h-[60px]", isAuthenticated && "bg-(--color-footer-background)")}>
            <span className="text-sm">&copy; Studio Goes</span>
            <Popover>
                <PopoverButton className="text-foreground/60 focus:outline-none data-hover:text-foreground">
                    <FontAwesomeIcon icon={faCircleUserCircleMoon} size="xs" />
                </PopoverButton>
                <PopoverPanel
                    transition
                    anchor={{ to: "top start", gap: "10px" }}
                    className="rounded-xl bg-white text-sm transition duration-200 ease-in-out data-closed:-translate-y-1 data-closed:opacity-0 w-32 z-10"
                >
                    <PopoverItemButton id="light" onClick={onClickTheme}>
                        {theme === "light" ? <FontAwesomeIcon icon={faCheck} /> : null}
                        {t("Theme.light")}
                    </PopoverItemButton>
                    <PopoverItemButton id="dark" onClick={onClickTheme}>
                        {theme === "dark" ? <FontAwesomeIcon icon={faCheck} /> : null}
                        {t("Theme.dark")}
                    </PopoverItemButton>
                    <PopoverItemButton id="auto" onClick={onClickTheme}>
                        {theme === "auto" ? <FontAwesomeIcon icon={faCheck} /> : null}
                        {t("Theme.auto")}
                    </PopoverItemButton>
                </PopoverPanel>
            </Popover>
            <Popover>
                <PopoverButton className="text-foreground/60 focus:outline-none data-hover:text-foreground">
                    <FontAwesomeIcon icon={faGlobeAmericas} size="xs" />
                </PopoverButton>
                <PopoverPanel
                    transition
                    anchor={{ to: "top start", gap: "10px" }}
                    className="rounded-xl bg-white text-sm transition duration-200 ease-in-out data-closed:-translate-y-1 data-closed:opacity-0 w-32 z-10"
                >
                    {languageOptions.map((language) => (
                        <PopoverItemButton key={language} id={language} onClick={onClickLanguage}>
                            {language}
                        </PopoverItemButton>
                    ))}
                </PopoverPanel>
            </Popover>
        </footer>
    )
}

export default Footer
