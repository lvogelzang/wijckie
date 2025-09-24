import { useCallback } from "react"
import WButton from "../button/WButton"

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
        <WButton type="button" variant={isCurrent ? "segment-selected" : "segment"} onClick={onClick}>
            {isFirst ? "<<" : null}
            {!(isFirst || isLast) ? pageIndex + 1 : null}
            {isLast ? ">>" : null}
        </WButton>
    )
}

export default TablePaginationButton
