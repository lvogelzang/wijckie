import { Button } from "@headlessui/react"
import type { MouseEventHandler, ReactNode } from "react"
import type { WButtonVariant } from "./WButtonVariant"

interface Props {
    type?: "submit" | "reset" | "button"
    variant?: WButtonVariant
    onClick?: MouseEventHandler<HTMLButtonElement>
    disabled?: boolean
    children: ReactNode
}

const WButton = ({ type, variant, onClick, disabled, children }: Props) => {
    return (
        <Button onClick={onClick} type={type} disabled={disabled}>
            {children}
        </Button>
    )
}

export default WButton
