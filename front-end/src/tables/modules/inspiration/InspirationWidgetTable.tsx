import { useInspirationWidgetsList } from "@/api/endpoints/api"
import type { InspirationModule, InspirationWidget } from "@/api/models/api"
import Table from "@/components/table/Table"
import type { TableButtonDef } from "@/components/table/TableButtonDef"
import { makeUrl } from "@/helpers/LinkTreeHelper"
import useLinkTree from "@/hooks/UseLinkTree"
import type { TitleStyle } from "@/types/TitleStyle"
import type { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

interface Props {
    titleStyle: TitleStyle
    module: InspirationModule
}

const InspirationWidgetTable = ({ titleStyle, module }: Props) => {
    const { t } = useTranslation()
    const l = useLinkTree()
    const dataQuery = useInspirationWidgetsList({ module: module.id })

    const columns = useMemo((): ColumnDef<InspirationWidget>[] => {
        return [
            {
                id: "name",
                header: t("Main.name"),
                cell: ({ row }) => (
                    <Link to={makeUrl(l.MODULES__INSPIRATION__ID__WIDGETS__ID, [module, row.original])} data-cy="inspirationWidgetLink">
                        {row.original.name}
                    </Link>
                ),
            },
        ]
    }, [t, l, module])

    const buttons = useMemo((): TableButtonDef[] => {
        return [
            {
                id: "newInspirationWidget",
                label: t("Main.new"),
                link: makeUrl(l.MODULES__INSPIRATION__ID__WIDGETS__NEW, [module]),
            },
        ]
    }, [t, l, module])

    return (
        <Table
            id="InspirationWidgets"
            title={t("InspirationWidget.plural_title")}
            titleStyle={titleStyle}
            columns={columns}
            buttons={buttons}
            subject={t("InspirationWidget.plural_name")}
            dataQuery={dataQuery}
        />
    )
}

export default InspirationWidgetTable
