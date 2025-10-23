import RootErrorMessage from "@/components/error/form/root-error-message"
import { FormTitle } from "@/components/form/form-title"
import SaveAndDelete from "@/components/form/SaveAndDelete"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useDailyTodosWidgetsCreate, useDailyTodosWidgetsDestroy, useDailyTodosWidgetsUpdate } from "../../../api/endpoints/api"
import type { DailyTodosModule, DailyTodosWidget } from "../../../api/models/api"
import { useErrorHandler } from "../../../helpers/useErrorHandler"

interface Props {
    mode: "Create" | "Update"
    module: DailyTodosModule
    widget?: DailyTodosWidget
}

const formSchema = z.object({
    name: z.string().min(1).max(50),
})

const DailyTodosWidgetForm = ({ mode, module, widget }: Props) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { handleFormErrors } = useErrorHandler()
    const create = useDailyTodosWidgetsCreate()
    const update = useDailyTodosWidgetsUpdate()
    const destroy = useDailyTodosWidgetsDestroy()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: mode === "Update" ? widget!.name : "",
        },
    })

    const onSuccess = useCallback(() => {
        navigate(`/modules/daily-todos/${module.id}`)
    }, [navigate, module])

    const onError = useCallback(
        (error: unknown) => {
            handleFormErrors(form.setError, error, ["name"])
        },
        [handleFormErrors, form.setError]
    )

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = useCallback(
        ({ name }) => {
            if (mode === "Create") {
                create.mutate(
                    {
                        data: {
                            module: module.id,
                            name,
                        },
                    },
                    {
                        onSuccess,
                        onError,
                    }
                )
            } else if (mode === "Update") {
                update.mutate(
                    { id: widget!.id, data: { name } },
                    {
                        onSuccess,
                        onError,
                    }
                )
            }
        },
        [mode, module, widget, create, update, onSuccess, onError]
    )

    const onDelete = useCallback(() => {
        return new Promise((onSuccess, onError) => {
            destroy.mutate({ id: widget!.id }, { onSuccess, onError })
        })
    }, [destroy, widget])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormTitle>{mode === "Create" ? t("Main.title_new") : widget!.name}</FormTitle>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("Main.name")}</FormLabel>
                            <FormControl>
                                <Input {...field} data-cy="nameInput" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <SaveAndDelete mode={mode} name={`${widget?.name}`} onDelete={onDelete} onDeleted={onSuccess} />
                <RootErrorMessage errors={form.formState.errors} />
            </form>
        </Form>
    )
}

export default DailyTodosWidgetForm
