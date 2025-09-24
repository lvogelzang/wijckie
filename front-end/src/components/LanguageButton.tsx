import { Button } from "@headlessui/react"
import Cookies from "js-cookie"
import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import type { UserLanguageType } from "../types/UserLanguageType"

interface Props {
    language: UserLanguageType
    close: () => void
}

function LanguageButton({ language, close }: Props) {
    const { i18n } = useTranslation()

    const onClick = useCallback(() => {
        i18n.changeLanguage(language)
        Cookies.set("django_language", language)
        close()
    }, [i18n, language, close])

    const title = useMemo(() => {
        switch (language) {
            case "en-GB":
                return "English"
            case "nl":
                return "Nederlands"
        }
    }, [language])

    return <Button onClick={onClick}>{title}</Button>
}

export default LanguageButton
