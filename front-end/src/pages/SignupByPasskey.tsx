import RootErrorMessage from "@/components/error/form/root-error-message"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, type FC } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"
import { postAllauthClientV1AuthWebauthnSignup } from "../api/endpoints/allauth"
import { isAllauthResponse401 } from "../helpers/AllauthHelper"
import { useErrorHandler } from "../helpers/useErrorHandler"

const formSchema = z.object({
    email: z.email(),
})

const SignupByPasskey: FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { handleFormErrors } = useErrorHandler()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    const onSuccess = useCallback(() => {
        navigate("/account/verify-email")
    }, [navigate])

    const onFailure = useCallback(
        (error: unknown) => {
            if (isAllauthResponse401(error)) {
                onSuccess()
                return
            }
            handleFormErrors(form.setError, error, ["email"])
        },
        [onSuccess, form.setError, handleFormErrors]
    )

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = useCallback(
        ({ email }) => {
            postAllauthClientV1AuthWebauthnSignup("browser", { email }).then(onSuccess).catch(onFailure)
        },
        [onSuccess, onFailure]
    )

    return (
        <div>
            <h1>{t("SignUpPage.title")}</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("SignUpPage.email_address")}</FormLabel>
                                <FormControl>
                                    <Input {...field} autoFocus data-cy="emailInput" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">{t("SignUpPage.submit_button")}</Button>
                    <RootErrorMessage errors={form.formState.errors} />
                </form>
            </Form>
            <p>
                <Trans i18nKey="SignUpPage.already_an_account">
                    Already have an account? Go to
                    <Link to="/account/authenticate/webauthn" data-cy="toLoginLink">
                        Login
                    </Link>
                    .
                </Trans>
            </p>
        </div>
    )
}

export default SignupByPasskey
