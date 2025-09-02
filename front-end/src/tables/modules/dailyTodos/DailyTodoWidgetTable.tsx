import type { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { useDailyTodosWidgetsList } from "../../../api/endpoints/api"
import type { DailyTodosModule, DailyTodosWidget } from "../../../api/models/api"
import Table from "../../../components/table/Table"
import type { TableButtonDef } from "../../../components/table/TableButtonDef"

interface Props {
    module: DailyTodosModule
}

const DailyTodoWidgetTable = ({ module }: Props) => {
    const { t } = useTranslation()
    const dataQuery = useDailyTodosWidgetsList({ module: module.id })

    const columns = useMemo((): ColumnDef<DailyTodosWidget>[] => {
        return [
            {
                id: "name",
                header: t("Main.name"),
                cell: ({ row }) => <Link to={`/modules/daily-todos/${module.id}/widgets/${row.original.id}`}>{row.original.name}</Link>,
            },
        ]
    }, [t, module])

    const buttons = useMemo((): TableButtonDef[] => {
        return [
            {
                label: t("Main.new"),
                link: `/modules/daily-todos/${module.id}/widgets/new`,
            },
        ]
    }, [t, module])

    return <Table id="DailyTodoWidgets" title={t("DailyTodoWidget.plural_title")} columns={columns} buttons={buttons} subject={t("DailyTodoWidget.plural_name")} dataQuery={dataQuery} />
}

export default DailyTodoWidgetTable
