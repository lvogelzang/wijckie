import { useErrorHandler, type ErrorMessageType } from "@/helpers/useErrorHandler"
import { useMemo } from "react"
import { InlineErrorMessage } from "./inline-error-message"

interface Props {
    error: { type: ErrorMessageType } | undefined
}

const ErrorMessage = ({ error }: Props) => {
    const { translatedErrorMessages } = useErrorHandler()

    const message = useMemo(() => {
        if (error && typeof error === "object" && "type" in error && typeof error.type === "string") {
            return translatedErrorMessages.get(error.type as ErrorMessageType)
        }
        return null
    }, [error, translatedErrorMessages])

    return (
        <InlineErrorMessage hidden={!error} data-cy="errorMessage">
            {message}
        </InlineErrorMessage>
    )
}

export default ErrorMessage
