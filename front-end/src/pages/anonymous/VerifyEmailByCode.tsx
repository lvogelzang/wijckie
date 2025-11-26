import RootErrorMessage from "@/components/error/form/root-error-message"
import { Page } from "@/components/Page"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useLinkTree, { makeUrl } from "@/hooks/UseLinkTree"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"
import { postAllauthClientV1AuthEmailVerify } from "../../api/endpoints/allauth"
import { isAllauthResponse401 } from "../../helpers/AllauthHelper"
import { useErrorHandler } from "../../helpers/useErrorHandler"

const formSchema = z.object({
    key: z.string().length(6),
})

const VerifyEmailByCode = () => {
    const { t } = useTranslation()
    const l = useLinkTree()
    const navigate = useNavigate()
    const { handleFormErrors } = useErrorHandler()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            key: "",
        },
    })

    const onSuccess = useCallback(() => {
        navigate(makeUrl(l.ACCOUNT_SIGNUP_PASSKEY_CREATE, []))
    }, [navigate, l])

    const onFailure = useCallback(
        (error: unknown) => {
            if (isAllauthResponse401(error)) {
                onSuccess()
                return
            }
            handleFormErrors(form.setError, error, ["key"])
        },
        [onSuccess, handleFormErrors, form.setError]
    )

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = useCallback(
        ({ key }) => {
            postAllauthClientV1AuthEmailVerify("browser", { key }).then(onSuccess).catch(onFailure)
        },
        [onSuccess, onFailure]
    )

    return (
        <Page variant="anonymous">
            <Card>
                <div className="m-auto flex flex-col items-center gap-6 text-center max-w-96">
                    <h1>{t("VerifyEmailPage.title")}</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="key"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("VerifyEmailPage.code")}</FormLabel>
                                        <FormControl>
                                            <Input {...field} autoFocus data-cy="verificationCodeInput" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">{t("VerifyEmailPage.submit_button")}</Button>
                            <RootErrorMessage errors={form.formState.errors} />
                        </form>
                    </Form>
                    <p>
                        <Trans i18nKey="VerifyEmailByCode.already_an_account">
                            Already have an account? Go to
                            <Link to={makeUrl(l.LOGOUT, [])}>Login</Link>.
                        </Trans>
                    </p>
                </div>
            </Card>
        </Page>
    )
}

export default VerifyEmailByCode
