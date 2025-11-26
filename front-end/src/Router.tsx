import { AuthenticatorTypes, Flows } from "@/auth/allauth"
import AnonymousRoute from "@/auth/AnonymousRoute"
import { AuthContext } from "@/auth/AuthContext"
import AuthenticatedRoute from "@/auth/AuthenticatedRoute"
import { makePath } from "@/helpers/LinkTreeHelper"
import useLinkTree from "@/hooks/UseLinkTree"
import { listAuthenticators } from "@/loaders/listAuthenticators"
import AuthenticateWebAuthn from "@/pages/anonymous/AuthenticateWebAuthn"
import ConfirmLoginCode from "@/pages/anonymous/ConfirmLoginCode"
import CreateSignupPasskey from "@/pages/anonymous/CreateSignupPasskey"
import RequestLoginCode from "@/pages/anonymous/RequestLoginCode"
import SignupByPasskey from "@/pages/anonymous/SignupByPasskey"
import VerifyEmailByCode from "@/pages/anonymous/VerifyEmailByCode"
import AddEmailAddress from "@/pages/main/AddEmailAddress"
import CreatePasskey from "@/pages/main/CreatePasskey"
import Dashboard from "@/pages/main/Dashboard"
import Logout from "@/pages/main/Logout"
import Modules from "@/pages/main/Modules"
import MyAccount from "@/pages/main/MyAccount"
import UpdatePasskey from "@/pages/main/UpdatePasskey"
import DailyTodoOptionPage from "@/pages/modules/dailyTodos/DailyTodoOptionPage"
import DailyTodosModulePage from "@/pages/modules/dailyTodos/DailyTodosModulePage"
import DailyTodosWidgetPage from "@/pages/modules/dailyTodos/DailyTodosWidgetPage"
import InspirationModulePage from "@/pages/modules/inspiration/InspirationModulePage"
import InspirationOptionPage from "@/pages/modules/inspiration/InspirationOptionPage"
import InspirationWidgetPage from "@/pages/modules/inspiration/InspirationWidgetPage"
import Root from "@/Root"
import { useContext, useEffect, useState } from "react"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"

const createRouter = (l: ReturnType<typeof useLinkTree>) => {
    return createBrowserRouter([
        {
            path: "/",
            element: <Root />,
            children: [
                {
                    path: "",
                    index: true,
                    element: <Navigate to={makePath(l.DASHBOARD)} />,
                },
                {
                    path: makePath(l.ACCOUNT_LOGIN_WEBAUTHN),
                    element: (
                        <AnonymousRoute flowId={Flows.MFA_AUTHENTICATE} authenticatorType={AuthenticatorTypes.WEBAUTHN}>
                            <AuthenticateWebAuthn />
                        </AnonymousRoute>
                    ),
                },
                {
                    path: makePath(l.ACCOUNT_LOGIN_CODE),
                    element: (
                        <AnonymousRoute flowId={Flows.LOGIN_BY_CODE}>
                            <RequestLoginCode />
                        </AnonymousRoute>
                    ),
                },
                {
                    path: makePath(l.ACCOUNT_LOGIN_CODE_CONFIRM),
                    element: (
                        <AnonymousRoute flowId={Flows.LOGIN_BY_CODE}>
                            <ConfirmLoginCode />
                        </AnonymousRoute>
                    ),
                },
                {
                    path: makePath(l.ACCOUNT_SIGNUP_PASSKEY),
                    element: (
                        <AnonymousRoute>
                            <SignupByPasskey />
                        </AnonymousRoute>
                    ),
                },
                {
                    path: makePath(l.ACCOUNT_SIGNUP_PASSKEY_CREATE),
                    element: (
                        <AnonymousRoute flowId={Flows.MFA_WEBAUTHN_SIGNUP} authenticatorType={AuthenticatorTypes.WEBAUTHN}>
                            <CreateSignupPasskey />
                        </AnonymousRoute>
                    ),
                },
                {
                    path: makePath(l.ACCOUNT_VERIFY_EMAIL),
                    element: <VerifyEmailByCode />,
                },
                {
                    path: makePath(l.MY_ACCOUNT),
                    element: (
                        <AuthenticatedRoute>
                            <MyAccount />
                        </AuthenticatedRoute>
                    ),
                    loader: listAuthenticators,
                },
                {
                    path: makePath(l.MY_ACCOUNT__EMAIL_ADDRESSES__NEW),
                    element: (
                        <AuthenticatedRoute>
                            <AddEmailAddress />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: makePath(l.MY_ACCOUNT__PASSKEYS__NEW),
                    element: (
                        <AuthenticatedRoute>
                            <CreatePasskey />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: makePath(l.MY_ACCOUNT__PASSKEYS__ID),
                    element: (
                        <AuthenticatedRoute>
                            <UpdatePasskey />
                        </AuthenticatedRoute>
                    ),
                    loader: listAuthenticators,
                },
                {
                    path: makePath(l.LOGOUT),
                    element: (
                        <AuthenticatedRoute>
                            <Logout />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: makePath(l.DASHBOARD),
                    element: (
                        <AuthenticatedRoute>
                            <Dashboard />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: makePath(l.MODULES),
                    element: (
                        <AuthenticatedRoute>
                            <Modules />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: makePath(l.MODULES__DAILY_TODOS__NEW),
                    element: (
                        <AuthenticatedRoute>
                            <DailyTodosModulePage mode="Create" />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: makePath(l.MODULES__DAILY_TODOS__ID),
                    element: (
                        <AuthenticatedRoute>
                            <DailyTodosModulePage mode="Update" />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: makePath(l.MODULES__DAILY_TODOS__ID__OPTIONS__NEW),
                    element: (
                        <AuthenticatedRoute>
                            <DailyTodoOptionPage mode="Create" />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: makePath(l.MODULES__DAILY_TODOS__ID__OPTIONS__ID),
                    element: (
                        <AuthenticatedRoute>
                            <DailyTodoOptionPage mode="Update" />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: makePath(l.MODULES__DAILY_TODOS__ID__WIDGETS__NEW),
                    element: (
                        <AuthenticatedRoute>
                            <DailyTodosWidgetPage mode="Create" />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: makePath(l.MODULES__DAILY_TODOS__ID__WIDGETS__ID),
                    element: (
                        <AuthenticatedRoute>
                            <DailyTodosWidgetPage mode="Update" />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: makePath(l.MODULES__INSPIRATION__NEW),
                    element: (
                        <AuthenticatedRoute>
                            <InspirationModulePage mode="Create" />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: makePath(l.MODULES__INSPIRATION__ID),
                    element: (
                        <AuthenticatedRoute>
                            <InspirationModulePage mode="Update" />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: makePath(l.MODULES__INSPIRATION__ID__OPTIONS__NEW),
                    element: (
                        <AuthenticatedRoute>
                            <InspirationOptionPage mode="Create" />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: makePath(l.MODULES__INSPIRATION__ID__OPTIONS__ID),
                    element: (
                        <AuthenticatedRoute>
                            <InspirationOptionPage mode="Update" />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: makePath(l.MODULES__INSPIRATION__ID__WIDGETS__NEW),
                    element: (
                        <AuthenticatedRoute>
                            <InspirationWidgetPage mode="Create" />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: makePath(l.MODULES__INSPIRATION__ID__WIDGETS__ID),
                    element: (
                        <AuthenticatedRoute>
                            <InspirationWidgetPage mode="Update" />
                        </AuthenticatedRoute>
                    ),
                },
                {
                    path: "*",
                    element: <Navigate to={makePath(l.DASHBOARD)} />,
                },
            ],
        },
    ])
}

const Router = () => {
    // If we create the router globally, the loaders of the routes already trigger
    // even before the <AuthContext/> trigger the initial loading of the auth state.
    const [router, setRouter] = useState<ReturnType<typeof createBrowserRouter>>()
    const authContext = useContext(AuthContext)
    const l = useLinkTree()

    useEffect(() => {
        if (authContext) {
            setRouter(createRouter(l))
        }
    }, [authContext])

    return router ? <RouterProvider router={router} /> : null
}

export default Router
