import { useContext, useEffect, useState, type FC } from "react"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import { AuthenticatorTypes, Flows } from "./auth/allauth"
import AnonymousRoute from "./auth/AnonymousRoute"
import { AuthContext } from "./auth/AuthContext"
import AuthenticatedRoute from "./auth/AuthenticatedRoute"
import { listAuthenticators } from "./loaders/listAuthenticators"
import AddEmailAddress from "./pages/AddEmailAddress"
import AuthenticateWebAuthn from "./pages/AuthenticateWebAuthn"
import ConfirmLoginCode from "./pages/ConfirmLoginCode"
import CreatePasskey from "./pages/CreatePasskey"
import CreateSignupPasskey from "./pages/CreateSignupPasskey"
import Dashboard from "./pages/Dashboard"
import Logout from "./pages/Logout"
import Modules from "./pages/Modules"
import InspirationModulePage from "./pages/modules/inspiration/InspirationModulePage"
import MyAccount from "./pages/MyAccount"
import ReauthenticateWebAuthn from "./pages/ReauthenticateWebAuthn"
import RequestLoginCode from "./pages/RequestLoginCode"
import SignupByPasskey from "./pages/SignupByPasskey"
import UpdatePasskey from "./pages/UpdatePasskey"
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
                    path: "/account/authenticate/webauthn",
                    element: (
                        <AnonymousRoute flowId={Flows.MFA_AUTHENTICATE} authenticatorType={AuthenticatorTypes.WEBAUTHN}>
                            <AuthenticateWebAuthn />
                        </AnonymousRoute>
                    ),
                },
                {
                    path: "/account/reauthenticate/webauthn",
                    element: (
                        <AnonymousRoute flowId={Flows.MFA_REAUTHENTICATE} authenticatorType={AuthenticatorTypes.WEBAUTHN}>
                            <ReauthenticateWebAuthn />
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
                    path: "/modules",
                    element: (
                        <AuthenticatedRoute>
                            <Modules />
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
                    path: "/modules/inspiration/:id",
                    element: (
                        <AuthenticatedRoute>
                            <InspirationModulePage mode="Update" />
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
