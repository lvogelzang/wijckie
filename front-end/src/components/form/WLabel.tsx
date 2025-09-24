import { Label } from "@headlessui/react"
import type { ReactNode } from "react"

interface Props {
    children: ReactNode
}

const WLabel = ({ children }: Props) => {
    return <Label className="block">{children}</Label>
}

export default WLabel
