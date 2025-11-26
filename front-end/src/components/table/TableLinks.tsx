import type { TableLinkDef } from "@/components/table/TableLinkDef"

interface Props {
    links?: TableLinkDef[]
}

const TableLinks = ({ links }: Props) => {
    if (!links) {
        return null
    }

    return (
        <div>
            {links.map(({ label, href, target }) => (
                <a key={label} href={href} target={target}>
                    {label}
                </a>
            ))}
        </div>
    )
}

export default TableLinks
