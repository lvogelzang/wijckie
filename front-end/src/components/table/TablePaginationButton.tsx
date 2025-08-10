import { useCallback, type FC } from "react"
import { Button } from "react-bootstrap"

interface Props {
    pageIndex: number
    goToPage: (page: number) => void
    isCurrent?: boolean
    isFirst?: boolean
    isLast?: boolean
    show: boolean
}

const TablePaginationButton: FC<Props> = ({ pageIndex, goToPage, isCurrent, isFirst, isLast, show }) => {
    const onClick = useCallback(() => {
        goToPage(pageIndex)
    }, [pageIndex, goToPage])

    if (!show) {
        return null
    }

    return (
        <Button type="button" variant={isCurrent ? "segment-selected" : "segment"} onClick={onClick}>
            {isFirst ? "<<" : null}
            {!(isFirst || isLast) ? pageIndex + 1 : null}
            {isLast ? ">>" : null}
        </Button>
    )
}

export default TablePaginationButton
