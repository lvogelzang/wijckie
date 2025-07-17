import Cookies from "js-cookie"
import { useCallback, useMemo } from "react"
import { NavDropdown } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import type { UserLanguageType } from "../types/UserLanguageType"

interface Props {
    language: UserLanguageType
}

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

    return <NavDropdown.Item onClick={onClick}>{title}</NavDropdown.Item>
}

export default LanguageButton
