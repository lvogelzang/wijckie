import { createColumnHelper, type ColumnDef } from "@tanstack/react-table"
import { useMemo, type FC } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { useInspirationModulesList } from "../../../api/endpoints/api"
import type { InspirationModule } from "../../../api/models/api"
import Table from "../../../components/table/Table"
import type { TableButtonDef } from "../../../components/table/TableButtonDef"

const InspirationModuleTable: FC = () => {
    const { t } = useTranslation()
    const dataQuery = useInspirationModulesList()

    const columns = useMemo((): ColumnDef<InspirationModule, unknown>[] => {
        const columnHelper = createColumnHelper<InspirationModule>()
        return [
            columnHelper.display({
                id: "name",
                header: t("Main.name"),
                cell: ({ row }) => (
                    <Link to={`/modules/inspiration/${row.original.id}`} data-cy="inspirationModuleLink">
                        {row.original.name}
                    </Link>
                ),
            }),
        ]
    }, [t])

    const buttons = useMemo((): TableButtonDef[] => {
        return [
            {
                id: "newInspirationModule",
                label: t("Main.new"),
                link: "/modules/inspiration/new",
            },
        ]
    }, [t])

    return <Table id="InspirationModules" title={t("InspirationModule.plural_title")} columns={columns} buttons={buttons} subject={t("InspirationModule.plural_name")} dataQuery={dataQuery} />
}

export default InspirationModuleTable
