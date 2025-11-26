import { useInspirationModulesList } from "@/api/endpoints/api"
import type { InspirationModule } from "@/api/models/api"
import Table from "@/components/table/Table"
import type { TableButtonDef } from "@/components/table/TableButtonDef"
import { makeUrl } from "@/helpers/LinkTreeHelper"
import useLinkTree from "@/hooks/UseLinkTree"
import type { TitleStyle } from "@/types/TitleStyle"
import { type ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

interface Props {
    titleStyle: TitleStyle
}

const InspirationModuleTable = ({ titleStyle }: Props) => {
    const { t } = useTranslation()
    const l = useLinkTree()
    const dataQuery = useInspirationModulesList()

    const columns = useMemo((): ColumnDef<InspirationModule>[] => {
        return [
            {
                id: "name",
                header: t("Main.name"),
                cell: ({ row }) => (
                    <Link to={makeUrl(l.MODULES__INSPIRATION__ID, [row.original])} data-cy="inspirationModuleLink">
                        {row.original.name}
                    </Link>
                ),
            },
        ]
    }, [t, l])

    const buttons = useMemo((): TableButtonDef[] => {
        return [
            {
                id: "newInspirationModule",
                label: t("Main.new"),
                link: makeUrl(l.MODULES__INSPIRATION__NEW, []),
            },
        ]
    }, [t, l])

    return (
        <Table
            id="InspirationModules"
            title={t("InspirationModule.plural_title")}
            titleStyle={titleStyle}
            columns={columns}
            buttons={buttons}
            subject={t("InspirationModule.plural_name")}
            dataQuery={dataQuery}
        />
    )
}

export default InspirationModuleTable
