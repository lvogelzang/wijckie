import type { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { useInspirationWidgetsList } from "../../../api/endpoints/api"
import type { InspirationModule, InspirationWidget } from "../../../api/models/api"
import Table from "../../../components/table/Table"
import type { TableButtonDef } from "../../../components/table/TableButtonDef"

interface Props {
    module: InspirationModule
}

const InspirationWidgetTable = ({ module }: Props) => {
    const { t } = useTranslation()
    const dataQuery = useInspirationWidgetsList({ module: module.id })

    const columns = useMemo((): ColumnDef<InspirationWidget>[] => {
        return [
            {
                id: "name",
                header: t("Main.name"),
                cell: ({ row }) => <Link to={`/modules/inspiration/${module.id}/widgets/${row.original.id}`}>{row.original.name}</Link>,
            },
        ]
    }, [t, module])

    const buttons = useMemo((): TableButtonDef[] => {
        return [
            {
                label: t("Main.new"),
                link: `/modules/inspiration/${module.id}/widgets/new`,
            },
        ]
    }, [t, module])

    return <Table id="InspirationWidgets" title={t("InspirationWidget.plural_title")} columns={columns} buttons={buttons} subject={t("InspirationWidget.plural_name")} dataQuery={dataQuery} />
}

export default InspirationWidgetTable
