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
import { postAllauthClientV1AuthCodeRequest } from "../../api/endpoints/allauth"
import { isAllauthResponse401 } from "../../helpers/AllauthHelper"
import { useErrorHandler } from "../../helpers/useErrorHandler"

const formSchema = z.object({
    email: z.email(),
})

const RequestLoginCode = () => {
    const { t } = useTranslation()
    const l = useLinkTree()
    const navigate = useNavigate()
    const { handleFormErrors } = useErrorHandler()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    const onSuccess = useCallback(() => {
        navigate(makeUrl(l.ACCOUNT_LOGIN_CODE_CONFIRM, []))
    }, [navigate, l])

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
            postAllauthClientV1AuthCodeRequest("browser", { email }).then(onSuccess).catch(onFailure)
        },
        [onSuccess, onFailure]
    )

    return (
        <Page variant="anonymous">
            <Card>
                <div className="m-auto flex flex-col items-center gap-6 text-center max-w-96">
                    <h1 className="text-xl font-bold">{t("RequestLoginCodePage.title")}</h1>
                    <p>{t("RequestLoginCodePage.body")}</p>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("RequestLoginCodePage.email_address")}</FormLabel>
                                        <FormControl>
                                            <Input {...field} autoComplete="email" autoFocus data-cy="emailInput" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" data-cy="submitButton">
                                {t("RequestLoginCodePage.submit_button")}
                            </Button>
                            <RootErrorMessage errors={form.formState.errors} />
                            <p>
                                <Trans i18nKey="RequestLoginCodePage.back_to_login">
                                    Already a passkey? Go back to
                                    <Link to={makeUrl(l.LOGOUT, [])}>Login</Link>.
                                </Trans>
                            </p>
                        </form>
                    </Form>
                </div>
            </Card>
        </Page>
    )
}

export default RequestLoginCode
