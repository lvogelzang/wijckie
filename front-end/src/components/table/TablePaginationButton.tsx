import { Button } from "@/components/ui/button"
import { PaginationItem } from "@/components/ui/pagination"
import { useCallback } from "react"

interface Props {
    pageIndex: number
    goToPage: (page: number) => void
    isCurrent?: boolean
    isFirst?: boolean
    isLast?: boolean
    show: boolean
}

const TablePaginationButton = ({ pageIndex, goToPage, isCurrent, isFirst, isLast, show }: Props) => {
    const onClick = useCallback(() => {
        goToPage(pageIndex)
    }, [pageIndex, goToPage])

    if (!show) {
        return null
    }

    return (
        <PaginationItem>
            <Button type="button" onClick={onClick} className={isCurrent ? "active" : undefined}>
                {isFirst ? "<<" : null}
                {!(isFirst || isLast) ? pageIndex + 1 : null}
                {isLast ? ">>" : null}
            </Button>
        </PaginationItem>
    )
}

export default TablePaginationButton
