import type { UserLanguageType } from "@/types/UserLanguageType"
import Cookies from "js-cookie"
import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"

interface Props {
    language: UserLanguageType
}

// TODO: handle styling for mobile sidebar menu variant.
function LanguageButton({ language }: Props) {
    const { i18n } = useTranslation()

    const onClick = useCallback(() => {
        i18n.changeLanguage(language)
        Cookies.set("django_language", language)
    }, [i18n, language])

    const title = useMemo(() => {
        switch (language) {
            case "en-GB":
                return "English"
            case "nl":
                return "Nederlands"
        }
    }, [language])

    return (
        <div
            onClick={onClick}
            className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
        >
            <span className="text-sm font-medium leading-none text-nowrap">{title}</span>
        </div>
    )
}

export default LanguageButton
