import { createColumnHelper, type ColumnDef } from "@tanstack/react-table"
import { useMemo, type FC } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { useDailyTodosModulesList } from "../../../api/endpoints/api"
import type { DailyTodosModule } from "../../../api/models/api"
import Table from "../../../components/table/Table"
import type { TableButtonDef } from "../../../components/table/TableButtonDef"

const DailyTodosModuleTable: FC = () => {
    const { t } = useTranslation()
    const dataQuery = useDailyTodosModulesList()

    const columns = useMemo((): ColumnDef<DailyTodosModule, unknown>[] => {
        const columnHelper = createColumnHelper<DailyTodosModule>()
        return [
            columnHelper.display({
                id: "name",
                header: t("Main.name"),
                cell: ({ row }) => <Link to={`/modules/daily-todos/${row.original.id}`}>{row.original.name}</Link>,
            }),
        ]
    }, [t])

    const buttons = useMemo((): TableButtonDef[] => {
        return [
            {
                label: t("Main.new"),
                link: "/modules/daily-todos/new",
            },
        ]
    }, [t])

    return <Table id="DailyTodosModules" title={t("DailyTodosModule.plural_title")} columns={columns} buttons={buttons} subject={t("DailyTodosModule.plural_name")} dataQuery={dataQuery} />
}

export default DailyTodosModuleTable
