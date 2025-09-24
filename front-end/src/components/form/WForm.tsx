import { Fieldset } from "@headlessui/react"
import type { FormEventHandler, ReactNode } from "react"

interface Props {
    onSubmit?: FormEventHandler<HTMLFormElement>
    children: ReactNode
}

const WForm = ({ onSubmit, children }: Props) => {
    return (
        <form noValidate={true} onSubmit={onSubmit}>
            <Fieldset className="space-y-8">{children}</Fieldset>
        </form>
    )
}

export default WForm
