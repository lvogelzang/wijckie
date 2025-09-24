import { useCallback, useMemo, type ChangeEvent } from "react"
import { useTranslation } from "react-i18next"
import ButtonGroup from "../button/WButtonGroup"
import TablePaginationButton from "./TablePaginationButton"

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
        <div className="col-12 text-center" hidden={pageCount < 2 && pageSize === 10}>
            <ButtonGroup>
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
            </ButtonGroup>
            <select className="ms-2 select-inline" value={pageSize} onChange={onChangePageSize}>
                {[10, 25, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                        {t("Table.show_amount", { amount: pageSize })}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default TablePagination
