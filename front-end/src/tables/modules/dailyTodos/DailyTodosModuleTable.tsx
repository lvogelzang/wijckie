import useLinkTree, { makeUrl } from "@/hooks/UseLinkTree"
import type { TitleStyle } from "@/types/TitleStyle"
import { type ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { useDailyTodosModulesList } from "../../../api/endpoints/api"
import type { DailyTodosModule } from "../../../api/models/api"
import Table from "../../../components/table/Table"
import type { TableButtonDef } from "../../../components/table/TableButtonDef"

interface Props {
    titleStyle: TitleStyle
}

const DailyTodosModuleTable = ({ titleStyle }: Props) => {
    const { t } = useTranslation()
    const l = useLinkTree()
    const dataQuery = useDailyTodosModulesList()

    const columns = useMemo((): ColumnDef<DailyTodosModule>[] => {
        return [
            {
                id: "name",
                header: t("Main.name"),
                cell: ({ row }) => (
                    <Link to={makeUrl(l.MODULES__DAILY_TODOS__ID, [row.original])} data-cy="dailyTodosModuleLink">
                        {row.original.name}
                    </Link>
                ),
            },
        ]
    }, [t, l])

    const buttons = useMemo((): TableButtonDef[] => {
        return [
            {
                id: "newDailyTodosModule",
                label: t("Main.new"),
                link: makeUrl(l.MODULES__DAILY_TODOS__NEW, []),
            },
        ]
    }, [t, l])

    return (
        <Table
            id="DailyTodosModules"
            title={t("DailyTodosModule.plural_title")}
            titleStyle={titleStyle}
            columns={columns}
            buttons={buttons}
            subject={t("DailyTodosModule.plural_name")}
            dataQuery={dataQuery}
        />
    )
}

export default DailyTodosModuleTable
