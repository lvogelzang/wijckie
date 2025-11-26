import TablePaginationButton from "@/components/table/TablePaginationButton"
import { Pagination, PaginationContent } from "@/components/ui/pagination"
import { useCallback, useMemo, type ChangeEvent } from "react"
import { useTranslation } from "react-i18next"

interface Props {
    pagination: {
        pageIndex: number
        pageSize: number
    }
    pageCount: number
    goToPage: (pageIndex: number) => void
    setPageSize: (pageSize: number) => void
}

const TablePagination = ({ pagination, pageCount, goToPage, setPageSize }: Props) => {
    const { t } = useTranslation()
    const pageIndex = useMemo(() => pagination.pageIndex, [pagination])
    const pageSize = useMemo(() => pagination.pageSize, [pagination])

    const onChangePageSize = useCallback(
        (event: ChangeEvent) => {
            const target = event.target as HTMLSelectElement
            setPageSize(parseInt(target.value))
        },
        [setPageSize]
    )

    return (
        <Pagination hidden={pageCount < 2 && pageSize === 10}>
            <PaginationContent>
                <TablePaginationButton pageIndex={0} goToPage={goToPage} show={pageIndex > 4} isFirst={true} />
                <TablePaginationButton pageIndex={0} goToPage={goToPage} show={pageIndex > 4} isFirst={true} />
                <TablePaginationButton pageIndex={pageIndex - 4} goToPage={goToPage} show={pageIndex === 4} />
                <TablePaginationButton pageIndex={pageIndex - 3} goToPage={goToPage} show={pageIndex > 2} />
                <TablePaginationButton pageIndex={pageIndex - 2} goToPage={goToPage} show={pageIndex > 1} />
                <TablePaginationButton pageIndex={pageIndex - 1} goToPage={goToPage} show={pageIndex > 0} />
                <TablePaginationButton pageIndex={pageIndex} goToPage={goToPage} show={true} isCurrent={true} />
                <TablePaginationButton pageIndex={pageIndex + 1} goToPage={goToPage} show={pageIndex + 1 < pageCount} />
                <TablePaginationButton pageIndex={pageIndex + 2} goToPage={goToPage} show={pageIndex + 2 < pageCount} />
                <TablePaginationButton pageIndex={pageIndex + 3} goToPage={goToPage} show={pageIndex + 3 < pageCount} />
                <TablePaginationButton pageIndex={pageIndex + 4} goToPage={goToPage} show={pageIndex + 4 === pageCount - 1} />
                <TablePaginationButton pageIndex={pageCount - 1} goToPage={goToPage} show={pageIndex + 4 < pageCount - 1} isLast={true} />
            </PaginationContent>
            <select className="ms-2 select-inline" value={pageSize} onChange={onChangePageSize}>
                {[10, 25, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                        {t("Table.show_amount", { amount: pageSize })}
                    </option>
                ))}
            </select>
        </Pagination>
    )
}

export default TablePagination
