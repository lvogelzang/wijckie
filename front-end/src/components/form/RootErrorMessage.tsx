import type { FieldErrors } from "react-hook-form"
import WErrorMessage from "./WErrorMessage"
import WField from "./WField"

interface Props {
    errors: FieldErrors
}

const RootErrorMessage = ({ errors }: Props) => {
    return (
        <WField hidden={!errors.root}>
            <WErrorMessage error={errors.root} />
        </WField>
    )
}

export default RootErrorMessage
