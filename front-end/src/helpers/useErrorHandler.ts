import { useCallback, useMemo } from "react"
import type { FieldValues, Path, UseFormSetError } from "react-hook-form"
import { useTranslation } from "react-i18next"

// Invalid: shows message that a value is invalid, like an e-mail address without @.
// None: shows no message, useful when input components make the error clear without text.
// General: show a general error message, useful if no field-related errors could be found.

// Sources:
// - allauth docs
// - rest_framework.exceptions
// - rest_framework.validators
// - rest_framework.authtoken.serializers
// - https://docs.djangoproject.com/en/3.1/ref/forms/fields/#built-in-field-classes
export type ErrorMessageType =
    | "invalid"
    | "none"
    | "general"
    | "incorrect_code"
    | "required" // rest_framework.validators
    | "email"
    | "blank"
    | "error"
    | "parse_error"
    | "authentication_failed"
    | "not_authenticated"
    | "permission_denied"
    | "not_found"
    | "method_not_allowed"
    | "not_acceptable"
    | "unsupported_media_type"
    | "throttled"
    | "unique" // rest_framework.validators
    | "authorization" // rest_framework.authtoken.serializers
    | "max_length"
    | "min_length"
    | "invalid_choice"
    | "max_digits"
    | "max_decimal_places"
    | "max_whole_digits"
    | "overflow"
    | "missing" // missing file
    | "empty" // empty file
    | "invalid_list"
    | "incomplete"
    | "invalid_date"
    | "invalid_time"
    | "invalid_pk_value"
    | "file_too_big"

const errorMessageTypes: ErrorMessageType[] = ["invalid", "none", "general", "incorrect_code", "required", "email", "blank", "file_too_big"]

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
        translations.set("blank", t("ErrorMessage.required"))
        translations.set("file_too_big", t("ErrorMessage.file_too_big"))
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
                            // Allauth error response handling:
                            if ("code" in e && typeof e.code === "string" && "param" in e && typeof e.param === "string") {
                                if (errorMessageTypes.includes(e.code)) {
                                    map.set(e.param, e.code)
                                } else {
                                    map.set(e.param, "none")
                                }
                            }
                            // Django Rest Framework error response handling:
                            else if ("code" in e && typeof e.code === "string" && "attr" in e && typeof e.attr === "string") {
                                if (errorMessageTypes.includes(e.code)) {
                                    map.set(e.attr, e.code)
                                } else {
                                    map.set(e.attr, "none")
                                }
                            }
                        }
                    }
                }
            }
        } else if (error && typeof error === "object" && "manualErrors" in error) {
            const manualErrors = error.manualErrors
            if (Array.isArray(manualErrors)) {
                for (const e of manualErrors) {
                    // Allauth error response handling:
                    if ("code" in e && typeof e.code === "string" && "field" in e && typeof e.param === "string") {
                        if (errorMessageTypes.includes(e.code)) {
                            map.set(e.field, e.code)
                        } else {
                            map.set(e.field, "none")
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
