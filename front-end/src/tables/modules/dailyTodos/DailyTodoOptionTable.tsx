import { useDailyTodoOptionsList } from "@/api/endpoints/api"
import type { DailyTodoOption, DailyTodosModule } from "@/api/models/api"
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
    module: DailyTodosModule
}

const DailyTodoOptionTable = ({ titleStyle, module }: Props) => {
    const { t } = useTranslation()
    const l = useLinkTree()
    const dataQuery = useDailyTodoOptionsList({ module: module.id })

    const columns = useMemo((): ColumnDef<DailyTodoOption>[] => {
        return [
            {
                id: "name",
                header: t("Main.name"),
                cell: ({ row }) => (
                    <Link to={makeUrl(l.MODULES__DAILY_TODOS__ID__OPTIONS__ID, [module, row.original])} data-cy="dailyTodosOptionLink">
                        {row.original.name}
                    </Link>
                ),
            },
            {
                id: "text",
                header: t("Main.text"),
                cell: ({ row }) => <div>{row.original.text}</div>,
            },
        ]
    }, [t, l, module])

    const buttons = useMemo((): TableButtonDef[] => {
        return [
            {
                id: "newDailyTodosOption",
                label: t("Main.new"),
                link: makeUrl(l.MODULES__DAILY_TODOS__ID__OPTIONS__NEW, [module]),
            },
        ]
    }, [t, l, module])

    return (
        <Table
            id="DailyTodoOptions"
            title={t("DailyTodoOption.plural_title")}
            titleStyle={titleStyle}
            columns={columns}
            buttons={buttons}
            subject={t("DailyTodoOption.plural_name")}
            dataQuery={dataQuery}
        />
    )
}

export default DailyTodoOptionTable
