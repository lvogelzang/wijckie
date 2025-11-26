import { useAuth } from "@/auth/useAuth"
import type { PaginationState } from "@tanstack/react-table"
import { useCallback } from "react"

export const useGetPaginationCacheKey = () => {
    const { user } = useAuth()
    return useCallback((contextId: string, value: "pageIndex" | "pageSize") => `${user?.id}_${contextId}_${value}`, [user])
}

export const useGetPaginationValue = () => {
    const getPaginationCacheKey = useGetPaginationCacheKey()

    return useCallback(
        (contextId: string, defaultPageSize: number): PaginationState => {
            const indexCacheKey = getPaginationCacheKey(contextId, "pageIndex")
            const sizeCacheKey = getPaginationCacheKey(contextId, "pageSize")
            const indexCacheValue = sessionStorage.getItem(indexCacheKey)
            const sizeCacheValue = sessionStorage.getItem(sizeCacheKey)
            return {
                pageIndex: indexCacheValue !== null ? parseInt(indexCacheValue) : 0,
                pageSize: sizeCacheValue !== null ? parseInt(sizeCacheValue) : defaultPageSize,
            }
        },
        [getPaginationCacheKey]
    )
}
