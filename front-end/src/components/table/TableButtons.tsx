import TableButton from "./TableButton"
import type { TableButtonDef } from "./TableButtonDef"

interface Props {
    buttons?: TableButtonDef[]
}

const TableButtons = ({ buttons }: Props) => {
    if (!buttons) {
        return null
    }

    return (
        <div>
            {buttons.map(({ label, href, target, link, onClick, variant }) => (
                <TableButton key={label} label={label} href={href} target={target} link={link} onClick={onClick} variant={variant} />
            ))}
        </div>
    )
}

export default TableButtons
