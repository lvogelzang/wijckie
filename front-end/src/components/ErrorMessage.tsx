import { useMemo, type FC } from "react"
import type { Message } from "react-hook-form"
import { useErrorHandler, type ErrorMessageType } from "../helpers/useErrorHandler"

interface Props {
    error:
        | (Record<
              string,
              Partial<{
                  type: string | number
                  message: Message
              }>
          > &
              Partial<{
                  type: string | number
                  message: Message
              }>)
        | undefined
}

const ErrorMessage: FC<Props> = ({ error }) => {
    const { translatedErrorMessages } = useErrorHandler()

    const message = useMemo(() => {
        if (error && typeof error === "object" && "type" in error && typeof error.type === "string") {
            return translatedErrorMessages.get(error.type as ErrorMessageType)
        }
        return null
    }, [error, translatedErrorMessages])

    return message
}

export default ErrorMessage
