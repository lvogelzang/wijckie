import type { FieldErrors } from "react-hook-form"
import FormErrorMessage from "./form-error-message"

interface Props {
    errors: FieldErrors
}

const RootErrorMessage = ({ errors }: Props) => {
    return <FormErrorMessage error={errors.root} />
}

export default RootErrorMessage
