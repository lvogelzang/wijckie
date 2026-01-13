import type { MenuId } from "@/types/MenuId"
import type { IconProp } from "@fortawesome/fontawesome-svg-core"

export default interface MenuItem {
    id: MenuId
    title: string
    path: string
    icon: IconProp
}
