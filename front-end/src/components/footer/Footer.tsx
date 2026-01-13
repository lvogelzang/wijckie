import { useAuth } from "@/auth/useAuth"
import { PopoverItemButton } from "@/components/ui/popover-item-button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { applyTheme, type Theme } from "@/helpers/Theme"
import { cn } from "@/lib/utils"
import { languageOptions } from "@/types/UserLanguageType"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGlobeAmericas } from "@fortawesome/sharp-solid-svg-icons"
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import Cookies from "js-cookie"
import { useCallback, useEffect, useState, type MouseEvent } from "react"
import { useTranslation } from "react-i18next"

const Footer = () => {
    const { i18n } = useTranslation()
    const { t } = useTranslation()
    const { isAuthenticated } = useAuth()

    const [theme, setTheme] = useState<Theme>("auto")

    useEffect(() => {
        const saved = (localStorage.getItem("theme") as Theme) || "auto"
        setTheme(saved)
    }, [])

    const onClickLanguage = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            const target = event.target as HTMLButtonElement
            const value = target.id
            i18n.changeLanguage(value)
            Cookies.set("django_language", value)
        },
        [i18n]
    )

    const onValueChange = (value: string) => {
        if (!value) return
        setTheme(value as Theme)
        applyTheme(value as Theme)
    }

    return (
        <footer className={cn("flex items-center justify-center h-[60px] z-10", isAuthenticated && "bg-(--color-footer-background)")}>
            <span className="text-sm">&copy; Studio Goes</span>
            <ToggleGroup type="single" variant="outline" value={theme} onValueChange={onValueChange}>
                <ToggleGroupItem value="light" aria-label="Toggle light">
                    {t("Theme.light")}
                </ToggleGroupItem>
                <ToggleGroupItem value="dark" aria-label="Toggle dark">
                    {t("Theme.dark")}
                </ToggleGroupItem>
                <ToggleGroupItem value="auto" aria-label="Toggle auto">
                    {t("Theme.auto")}
                </ToggleGroupItem>
            </ToggleGroup>
            <Popover>
                <PopoverButton className="text-foreground/60 focus:outline-none data-hover:text-foreground">
                    <FontAwesomeIcon icon={faGlobeAmericas} size="xs" />
                </PopoverButton>
                <PopoverPanel
                    transition
                    anchor={{ to: "top start", gap: "10px" }}
                    className="rounded-xl bg-white text-sm transition duration-200 ease-in-out data-closed:-translate-y-1 data-closed:opacity-0 w-32 z-100"
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
