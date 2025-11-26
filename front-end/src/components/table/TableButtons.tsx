import TableButton from "@/components/table/TableButton"
import type { TableButtonDef } from "@/components/table/TableButtonDef"

interface Props {
    buttons?: TableButtonDef[]
}

const TableButtons = ({ buttons }: Props) => {
    if (!buttons) {
        return null
    }

    return (
        <div>
            {buttons.map(({ id, label, link, onClick, variant }) => (
                <TableButton key={id} id={id} label={label} link={link} onClick={onClick} variant={variant} />
            ))}
        </div>
    )
}

export default TableButtons
