import type { ColumnDef } from "@tanstack/react-table"
import { useMemo, type FC } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { useInspirationOptionsList } from "../api/endpoints/api"
import type { InspirationModule, InspirationOption } from "../api/models/api"
import Table from "../components/table/Table"
import type { TableButtonDef } from "../components/table/TableButtonDef"

interface Props {
    module: InspirationModule
}

const InspirationOptionTable: FC<Props> = ({ module }) => {
    const { t } = useTranslation()
    const dataQuery = useInspirationOptionsList({ module: module.id })

    const columns = useMemo((): ColumnDef<InspirationOption>[] => {
        return [
            {
                id: "name",
                header: t("Main.name"),
                cell: ({ row }) => <Link to={`/modules/inspiration/${module.id}/options/${row.original.id}`}>{row.original.name}</Link>,
            },
            {
                id: "type",
                header: t("Main.type"),
                cell: ({ row }) => <div>{row.original.type}</div>,
            },
        ]
    }, [t, module])

    const buttons = useMemo((): TableButtonDef[] => {
        return [
            {
                label: t("Main.new"),
                link: `/modules/inspiration/${module.id}/options/new`,
            },
        ]
    }, [t, module])

    return <Table id="InspirationOptions" title={t("InspirationOption.plural_title")} columns={columns} buttons={buttons} subject={t("InspirationOption.plural_name")} dataQuery={dataQuery} />
}

export default InspirationOptionTable
