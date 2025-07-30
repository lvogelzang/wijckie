import { useCallback, useMemo } from "react"
import type { FieldValues, Path, UseFormSetError } from "react-hook-form"
import { useTranslation } from "react-i18next"

// Invalid: shows message that a value is invalid, like an e-mail address without @.
// None: shows no message, useful when input components make the error clear without text.
// General: show a general error message, useful if no field-related errors could be found.
export type ErrorMessageType = "invalid" | "none" | "general" | "incorrect_code" | "required" | "email"

const errorMessageTypes: ErrorMessageType[] = ["invalid", "none", "general", "incorrect_code", "required", "email"]

export const useErrorHandler = () => {
    const { t } = useTranslation()

    const translatedErrorMessages = useMemo(() => {
        const translations: Map<ErrorMessageType, string | null> = new Map()
        translations.set("invalid", t("ErrorMessage.invalid"))
        translations.set("none", null)
        translations.set("general", t("ErrorMessage.general"))
        translations.set("incorrect_code", t("ErrorMessage.incorrect_code"))
        translations.set("required", t("ErrorMessage.required"))
        translations.set("email", t("ErrorMessage.email"))
        return translations
    }, [t])

    const getErrorMap = useCallback((error: unknown) => {
        const map: Map<string, ErrorMessageType> = new Map()
        if (error && typeof error === "object" && "response" in error) {
            const response = error.response
            if (response && typeof response === "object" && "data" in response) {
                const data = response.data
                if (data && typeof data === "object" && "errors" in data) {
                    const errors = data.errors
                    if (Array.isArray(errors)) {
                        for (const e of errors) {
                            if ("code" in e && typeof e.code === "string" && "param" in e && typeof e.param === "string") {
                                if (errorMessageTypes.includes(e.code)) {
                                    map.set(e.param, e.code)
                                } else {
                                    map.set(e.param, "none")
                                }
                            }
                        }
                    }
                }
            }
        }
        if (map.size === 0) {
            map.set("root", "general")
        }
        return map
    }, [])

    const handleFormErrors = useCallback(
        <Type extends FieldValues>(setError: UseFormSetError<Type>, error: unknown, keys: (`root.${string}` | "root" | Path<Type>)[]) => {
            const errorMap = getErrorMap(error)
            errorMap.forEach((errorMessage, id) => {
                const key = keys.find((key) => key === id)
                if (key) {
                    setError(key, { type: errorMessage })
                } else {
                    setError("root", { type: errorMessage })
                }
            })
        },
        [getErrorMap]
    )

    return { handleFormErrors, translatedErrorMessages }
}
