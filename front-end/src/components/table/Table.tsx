import type { UseQueryResult } from "@tanstack/react-query"
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type PaginationState } from "@tanstack/react-table"
import { useEffect, useState, type FC } from "react"
import { Table as BootstrapTable } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { useGetPaginationCacheKey, useGetPaginationValue } from "../../helpers/useCache"
import type { TableButtonDef } from "./TableButtonDef"
import TableButtons from "./TableButtons"
import TablePagination from "./TablePagination"

interface PageResponseType<Type> {
    pageCount: number
    results: Type[]
}

interface Props<Type> {
    id: string
    title: string
    columns: ColumnDef<Type, any>[]
    buttons?: TableButtonDef[]
    dataQuery: UseQueryResult<PageResponseType<Type>, unknown>
    subject: string // Used to show when no "items" are in table, e.g: "users" or "notes".
    defaultPageSize?: number
}

const Table: FC<Props<any>> = ({ id, title, columns, buttons, dataQuery, subject, defaultPageSize }) => {
    const { t } = useTranslation()
    const getPaginationValue = useGetPaginationValue()
    const getPaginationCacheKey = useGetPaginationCacheKey()
    const [pagination, setPagination] = useState<PaginationState>(getPaginationValue(id, defaultPageSize ?? 10))

    useEffect(() => {
        const cacheKey = getPaginationCacheKey(id, "pageIndex")
        sessionStorage.setItem(cacheKey, pagination.pageIndex.toString())
    }, [getPaginationCacheKey, id, pagination.pageIndex])

    useEffect(() => {
        const cacheKey = getPaginationCacheKey(id, "pageSize")
        sessionStorage.setItem(cacheKey, pagination.pageSize.toString())
    }, [getPaginationCacheKey, id, pagination.pageSize])

    const table = useReactTable({
        data: dataQuery.data?.results ?? [],
        columns,
        pageCount: dataQuery.data?.pageCount ?? -1,
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
    })

    return (
        <div>
            <div>
                <h2>{title}</h2>
                <TableButtons buttons={buttons} />
            </div>
            <div className="overflow-scroll">
                <BootstrapTable>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <th key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder ? null : <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>}
                                        </th>
                                    )
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => {
                            return (
                                <tr key={row.id}>
                                    {row.getAllCells().map((cell) => {
                                        return (
                                            <td key={cell.id} style={{ width: `${cell.column.getSize()}px` }}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                        {table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length}>{t("Table.no_items_in_table", { subject: subject })}</td>
                            </tr>
                        ) : null}
                    </tbody>
                </BootstrapTable>
            </div>
            <TablePagination pagination={pagination} pageCount={table.getPageCount()} goToPage={table.setPageIndex} setPageSize={table.setPageSize} />
        </div>
    )
}

export default Table
