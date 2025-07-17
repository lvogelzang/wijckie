export const isAllauthResponse401 = (error: unknown) => {
    if (error && typeof error === "object" && "response" in error) {
        const response = error.response
        if (response && typeof response === "object" && "status" in response) {
            const status = response.status
            if (status && typeof status === "number" && status === 401) {
                return true
            }
        }
    }
    return false
}
