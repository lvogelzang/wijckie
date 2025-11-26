import useLinkTree, { makeUrl } from "@/hooks/UseLinkTree"
import type { TitleStyle } from "@/types/TitleStyle"
import type { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { useDailyTodosWidgetsList } from "../../../api/endpoints/api"
import type { DailyTodosModule, DailyTodosWidget } from "../../../api/models/api"
import Table from "../../../components/table/Table"
import type { TableButtonDef } from "../../../components/table/TableButtonDef"

interface Props {
    titleStyle: TitleStyle
    module: DailyTodosModule
}

const DailyTodoWidgetTable = ({ titleStyle, module }: Props) => {
    const { t } = useTranslation()
    const l = useLinkTree()
    const dataQuery = useDailyTodosWidgetsList({ module: module.id })

    const columns = useMemo((): ColumnDef<DailyTodosWidget>[] => {
        return [
            {
                id: "name",
                header: t("Main.name"),
                cell: ({ row }) => (
                    <Link to={makeUrl(l.MODULES__DAILY_TODOS__ID__WIDGETS__ID, [module, row.original])} data-cy="dailyTodosWidgetLink">
                        {row.original.name}
                    </Link>
                ),
            },
        ]
    }, [t, l, module])

    const buttons = useMemo((): TableButtonDef[] => {
        return [
            {
                id: "newDailyTodosWidget",
                label: t("Main.new"),
                link: makeUrl(l.MODULES__DAILY_TODOS__ID__WIDGETS__NEW, [module]),
            },
        ]
    }, [t, l, module])

    return (
        <Table
            id="DailyTodoWidgets"
            title={t("DailyTodoWidget.plural_title")}
            titleStyle={titleStyle}
            columns={columns}
            buttons={buttons}
            subject={t("DailyTodoWidget.plural_name")}
            dataQuery={dataQuery}
        />
    )
}

export default DailyTodoWidgetTable
