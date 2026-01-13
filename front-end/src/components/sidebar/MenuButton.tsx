import { useNav } from "@/contexts/NavContext"
import { cn } from "@/lib/utils"
import type MenuItem from "@/types/MenuItem"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useMemo } from "react"
import { Link } from "react-router-dom"

interface Props {
    item: MenuItem
}

const MenuButton = ({ item }: Props) => {
    const { activeTab } = useNav()

    const { id, icon, title, path } = item

    const isCurrent = useMemo(() => activeTab === id, [activeTab, id])

    return (
        <Link
            to={path}
            className={cn(
                isCurrent ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-blue-100 hover:text-blue-700 ",
                "group flex items-baseline gap-x-2 rounded-2xl px-3 py-1 text-xs/6 truncate"
            )}
            data-cy={id}
        >
            <FontAwesomeIcon icon={icon} aria-hidden="true" size="sm" className={cn(isCurrent ? "text-blue-400" : "text-gray-400 group-hover:text-blue-400", "size-6 shrink-0")} />
            {title}
        </Link>
    )
}

export default MenuButton
