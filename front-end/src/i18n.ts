import "bootstrap/dist/js/bootstrap.js"
import i18n from "i18next"
import Cookies from "js-cookie"
import { initReactI18next } from "react-i18next"
import translationEnGb from "./locales/en-GB/translation.json"
import translationNl from "./locales/nl/translation.json"
import "./sass/main.scss"

const getLocale = () => {
    const cookieLocale = Cookies.get("django_language")
    if (cookieLocale && ["en-GB", "nl"].includes(cookieLocale)) {
        return cookieLocale
    }
    Cookies.set("django_language", import.meta.env.VITE_APP_DEFAULT_LOCALE!)
    return import.meta.env.VITE_APP_DEFAULT_LOCALE!
}

i18n.use(initReactI18next).init({
    resources: {
        "en-GB": {
            translation: translationEnGb,
        },
        nl: {
            translation: translationNl,
        },
    },
    lng: getLocale(),
    fallbackLng: "en-GB",
    supportedLngs: ["en-GB", "nl"],
    interpolation: { escapeValue: false },
})
