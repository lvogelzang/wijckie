import { notifyManager, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { csrfRetrieve } from "./api/endpoints/api"
import AuthContextProvider from "./auth/AuthContextProvider"
import "./i18n"
import Router from "./Router"
import "./sass/style.css"

const queryClient = new QueryClient()
// Disable notification batching in react-query, to support cy.clock() in Cypress tests.
if (import.meta.env.VITE_APP_ENV === "Dev") {
    notifyManager.setScheduler((cb) => cb())
}

csrfRetrieve()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthContextProvider>
                <Router />
            </AuthContextProvider>
        </QueryClientProvider>
    )
}

export default App
