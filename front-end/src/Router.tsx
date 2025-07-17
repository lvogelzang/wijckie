import { useContext, useEffect, useState, type FC } from "react"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import AnonymousRoute from "./auth/AnonymousRoute"
import { AuthContext } from "./auth/AuthContext"
import AuthenticatedRoute from "./auth/AuthenticatedRoute"
import CreateSignupPasskey from "./pages/CreateSignupPasskey"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Logout from "./pages/Logout"
import SignupByPasskey from "./pages/SignupByPasskey"
import VerifyEmailByCode from "./pages/VerifyEmailByCode"
import Root from "./Root"

const createRouter = () => {
    return createBrowserRouter([
        {
            path: "/",
            element: <Root />,
            children: [
                {
                    path: "",
                    index: true,
                    element: <Navigate to="/dashboard" />,
                },
                {
                    path: "/account/login",
                    element: (
                        <AnonymousRoute>
                            <Login />
                        </AnonymousRoute>
                    ),
                },
                {
                    path: "/account/signup/passkey",
                    element: (
                        <AnonymousRoute>
                            <SignupByPasskey />
                        </AnonymousRoute>
                    ),
                },
                {
                    path: "/account/signup/passkey/create",
                    element: (
                        <AnonymousRoute>
                            <CreateSignupPasskey />
                        </AnonymousRoute>
                    ),
                },
                {
                    path: "/account/verify-email",
                    element: (
                        <AnonymousRoute>
                            <VerifyEmailByCode />
                        </AnonymousRoute>
                    ),
                },
                {
                    path: "/account/logout",
                    element: <Logout />,
                },
                {
                    path: "/dashboard",
                    element: (
                        <AuthenticatedRoute>
                            <Dashboard />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: "*",
                    element: <Navigate to="/dashboard" />,
                },
            ],
        },
    ])
}

const Router: FC = () => {
    // If we create the router globally, the loaders of the routes already trigger
    // even before the <AuthContext/> trigger the initial loading of the auth state.
    const [router, setRouter] = useState<ReturnType<typeof createBrowserRouter>>()
    const authContext = useContext(AuthContext)

    useEffect(() => {
        if (authContext) {
            setRouter(createRouter())
        }
    }, [authContext])

    return router ? <RouterProvider router={router} /> : null
}

export default Router
