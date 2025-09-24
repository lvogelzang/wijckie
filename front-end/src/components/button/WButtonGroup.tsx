import type { ReactNode } from "react"

interface Props {
    children: ReactNode
}

const WButtonGroup = ({ children }: Props) => {
    return <div>{children}</div>
}

export default WButtonGroup
