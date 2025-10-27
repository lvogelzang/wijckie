import { useAuth } from "@/auth/useAuth"
import { applyTheme, type Theme } from "@/helpers/Theme"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"

const Footer = () => {
    const { t } = useTranslation()
    const { isAuthenticated } = useAuth()

    const [theme, setTheme] = useState<Theme>("auto")

    useEffect(() => {
        const saved = (localStorage.getItem("theme") as Theme) || "auto"
        setTheme(saved)
    }, [])

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
        </footer>
    )
}

export default Footer
