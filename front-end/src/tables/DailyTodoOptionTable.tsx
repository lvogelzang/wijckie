import type { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { useDailyTodoOptionsList } from "../api/endpoints/api"
import type { DailyTodoOption, DailyTodosModule } from "../api/models/api"
import Table from "../components/table/Table"
import type { TableButtonDef } from "../components/table/TableButtonDef"

interface Props {
    module: DailyTodosModule
}

const DailyTodoOptionTable = ({ module }: Props) => {
    const { t } = useTranslation()
    const dataQuery = useDailyTodoOptionsList({ module: module.id })

    const columns = useMemo((): ColumnDef<DailyTodoOption>[] => {
        return [
            {
                id: "name",
                header: t("Main.name"),
                cell: ({ row }) => <Link to={`/modules/daily-todos/${module.id}/options/${row.original.id}`}>{row.original.name}</Link>,
            },
            {
                id: "text",
                header: t("Main.text"),
                cell: ({ row }) => <div>{row.original.text}</div>,
            },
        ]
    }, [t, module])

    const buttons = useMemo((): TableButtonDef[] => {
        return [
            {
                label: t("Main.new"),
                link: `/modules/daily-todos/${module.id}/options/new`,
            },
        ]
    }, [t, module])

    return <Table id="DailyTodoOptions" title={t("DailyTodoOption.plural_title")} columns={columns} buttons={buttons} subject={t("DailyTodoOption.plural_name")} dataQuery={dataQuery} />
}

export default DailyTodoOptionTable
