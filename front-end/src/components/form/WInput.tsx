import { Input } from "@headlessui/react"
import type { HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute } from "react"

interface Props {
    name: string
    type: HTMLInputTypeAttribute
    invalid: boolean
    autoFocus?: boolean
    autoComplete?: HTMLInputAutoCompleteAttribute
}

const WInput = ({ name, type, invalid, autoFocus, autoComplete }: Props) => {
    return <Input type={type} className="mt-1 block" name={name} invalid={invalid} autoFocus={autoFocus} autoComplete={autoComplete} />
}

export default WInput
