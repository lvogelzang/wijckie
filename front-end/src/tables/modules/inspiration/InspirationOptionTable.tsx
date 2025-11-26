import useLinkTree, { makeUrl } from "@/hooks/UseLinkTree"
import type { TitleStyle } from "@/types/TitleStyle"
import type { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { useInspirationOptionsList } from "../../../api/endpoints/api"
import type { InspirationModule, InspirationOption } from "../../../api/models/api"
import Table from "../../../components/table/Table"
import type { TableButtonDef } from "../../../components/table/TableButtonDef"

interface Props {
    titleStyle: TitleStyle
    module: InspirationModule
}

const InspirationOptionTable = ({ titleStyle, module }: Props) => {
    const { t } = useTranslation()
    const l = useLinkTree()
    const dataQuery = useInspirationOptionsList({ module: module.id })

    const columns = useMemo((): ColumnDef<InspirationOption>[] => {
        return [
            {
                id: "name",
                header: t("Main.name"),
                cell: ({ row }) => (
                    <Link to={makeUrl(l.MODULES__INSPIRATION__ID__OPTIONS__ID, [module, row.original])} data-cy="inspirationOptionLink">
                        {row.original.name}
                    </Link>
                ),
            },
            {
                id: "type",
                header: t("Main.type"),
                cell: ({ row }) => <div>{row.original.type}</div>,
            },
        ]
    }, [t, l, module])

    const buttons = useMemo((): TableButtonDef[] => {
        return [
            {
                id: "newInspirationOption",
                label: t("Main.new"),
                link: makeUrl(l.MODULES__INSPIRATION__ID__OPTIONS__NEW, [module]),
            },
        ]
    }, [t, l, module])

    return (
        <Table
            id="InspirationOptions"
            title={t("InspirationOption.plural_title")}
            titleStyle={titleStyle}
            columns={columns}
            buttons={buttons}
            subject={t("InspirationOption.plural_name")}
            dataQuery={dataQuery}
        />
    )
}

export default InspirationOptionTable
