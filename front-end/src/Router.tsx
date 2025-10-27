import { useContext, useEffect, useState, type FC } from "react"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import { AuthenticatorTypes, Flows } from "./auth/allauth"
import AnonymousRoute from "./auth/AnonymousRoute"
import { AuthContext } from "./auth/AuthContext"
import AuthenticatedRoute from "./auth/AuthenticatedRoute"
import { listAuthenticators } from "./loaders/listAuthenticators"
import AuthenticateWebAuthn from "./pages/anonymous/AuthenticateWebAuthn"
import ConfirmLoginCode from "./pages/anonymous/ConfirmLoginCode"
import CreateSignupPasskey from "./pages/anonymous/CreateSignupPasskey"
import RequestLoginCode from "./pages/anonymous/RequestLoginCode"
import SignupByPasskey from "./pages/anonymous/SignupByPasskey"
import VerifyEmailByCode from "./pages/anonymous/VerifyEmailByCode"
import AddEmailAddress from "./pages/main/AddEmailAddress"
import CreatePasskey from "./pages/main/CreatePasskey"
import Dashboard from "./pages/main/Dashboard"
import Logout from "./pages/main/Logout"
import Modules from "./pages/main/Modules"
import MyAccount from "./pages/main/MyAccount"
import UpdatePasskey from "./pages/main/UpdatePasskey"
import DailyTodoOptionPage from "./pages/modules/dailyTodos/DailyTodoOptionPage"
import DailyTodosModulePage from "./pages/modules/dailyTodos/DailyTodosModulePage"
import DailyTodosWidgetPage from "./pages/modules/dailyTodos/DailyTodosWidgetPage"
import InspirationModulePage from "./pages/modules/inspiration/InspirationModulePage"
import InspirationOptionPage from "./pages/modules/inspiration/InspirationOptionPage"
import InspirationWidgetPage from "./pages/modules/inspiration/InspirationWidgetPage"
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
                    path: "/account/authenticate/webauthn",
                    element: (
                        <AnonymousRoute flowId={Flows.MFA_AUTHENTICATE} authenticatorType={AuthenticatorTypes.WEBAUTHN}>
                            <AuthenticateWebAuthn />
                        </AnonymousRoute>
                    ),
                },
                {
                    path: "/account/login/code",
                    element: (
                        <AnonymousRoute flowId={Flows.LOGIN_BY_CODE}>
                            <RequestLoginCode />
                        </AnonymousRoute>
                    ),
                },
                {
                    path: "/account/login/code/confirm",
                    element: (
                        <AnonymousRoute flowId={Flows.LOGIN_BY_CODE}>
                            <ConfirmLoginCode />
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
                        <AnonymousRoute flowId={Flows.MFA_WEBAUTHN_SIGNUP} authenticatorType={AuthenticatorTypes.WEBAUTHN}>
                            <CreateSignupPasskey />
                        </AnonymousRoute>
                    ),
                },
                {
                    path: "/account/verify-email",
                    element: <VerifyEmailByCode />,
                },
                {
                    path: "/account/my",
                    element: (
                        <AuthenticatedRoute>
                            <MyAccount />
                        </AuthenticatedRoute>
                    ),
                    loader: listAuthenticators,
                },
                {
                    path: "/account/my/email-addresses/add",
                    element: (
                        <AuthenticatedRoute>
                            <AddEmailAddress />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: "/account/my/passkeys/add",
                    element: (
                        <AuthenticatedRoute>
                            <CreatePasskey />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: "/account/my/passkeys/:id",
                    element: (
                        <AuthenticatedRoute>
                            <UpdatePasskey />
                        </AuthenticatedRoute>
                    ),
                    loader: listAuthenticators,
                },
                {
                    path: "/account/logout",
                    element: (
                        <AuthenticatedRoute>
                            <Logout />
                        </AuthenticatedRoute>
                    ),
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
                    path: "/modules",
                    element: (
                        <AuthenticatedRoute>
                            <Modules />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: "/modules/daily-todos/new",
                    element: (
                        <AuthenticatedRoute>
                            <DailyTodosModulePage mode="Create" />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: "/modules/daily-todos/:moduleId",
                    element: (
                        <AuthenticatedRoute>
                            <DailyTodosModulePage mode="Update" />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: "/modules/daily-todos/:moduleId/options/new",
                    element: (
                        <AuthenticatedRoute>
                            <DailyTodoOptionPage mode="Create" />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: "/modules/daily-todos/:moduleId/options/:optionId",
                    element: (
                        <AuthenticatedRoute>
                            <DailyTodoOptionPage mode="Update" />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: "/modules/daily-todos/:moduleId/widgets/new",
                    element: (
                        <AuthenticatedRoute>
                            <DailyTodosWidgetPage mode="Create" />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: "/modules/daily-todos/:moduleId/widgets/:widgetId",
                    element: (
                        <AuthenticatedRoute>
                            <DailyTodosWidgetPage mode="Update" />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: "/modules/inspiration/new",
                    element: (
                        <AuthenticatedRoute>
                            <InspirationModulePage mode="Create" />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: "/modules/inspiration/:moduleId",
                    element: (
                        <AuthenticatedRoute>
                            <InspirationModulePage mode="Update" />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: "/modules/inspiration/:moduleId/options/new",
                    element: (
                        <AuthenticatedRoute>
                            <InspirationOptionPage mode="Create" />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: "/modules/inspiration/:moduleId/options/:optionId",
                    element: (
                        <AuthenticatedRoute>
                            <InspirationOptionPage mode="Update" />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: "/modules/inspiration/:moduleId/widgets/new",
                    element: (
                        <AuthenticatedRoute>
                            <InspirationWidgetPage mode="Create" />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: "/modules/inspiration/:moduleId/widgets/:widgetId",
                    element: (
                        <AuthenticatedRoute>
                            <InspirationWidgetPage mode="Update" />
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
