import FormErrorMessage from "@/components/error/form/form-error-message"
import type { FieldErrors } from "react-hook-form"

interface Props {
    errors: FieldErrors
}

const RootErrorMessage = ({ errors }: Props) => {
    return <FormErrorMessage error={errors.root} />
}

export default RootErrorMessage
