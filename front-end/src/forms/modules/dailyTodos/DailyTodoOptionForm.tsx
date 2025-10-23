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
import { useDailyTodoOptionsCreate, useDailyTodoOptionsDestroy, useDailyTodoOptionsUpdate } from "../../../api/endpoints/api"
import { type DailyTodoOption, type DailyTodosModule } from "../../../api/models/api"
import { useErrorHandler } from "../../../helpers/useErrorHandler"

interface Props {
    mode: "Create" | "Update"
    module: DailyTodosModule
    option?: DailyTodoOption
}

const formSchema = z.object({
    name: z.string().min(1).max(50),
    text: z.string(),
})

const DailyTodoOptionForm = ({ mode, module, option }: Props) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { handleFormErrors } = useErrorHandler()
    const create = useDailyTodoOptionsCreate()
    const update = useDailyTodoOptionsUpdate()
    const destroy = useDailyTodoOptionsDestroy()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: mode === "Update" ? option!.name : "",
            text: mode === "Update" ? option!.text : "",
        },
    })

    const onSuccess = useCallback(() => {
        navigate(`/modules/daily-todos/${module.id}`)
    }, [navigate, module])

    const onError = useCallback(
        (error: unknown) => {
            handleFormErrors(form.setError, error, ["name", "text"])
        },
        [handleFormErrors, form.setError]
    )

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = useCallback(
        ({ name, text }) => {
            if (mode === "Create") {
                create.mutate(
                    {
                        data: {
                            module: module.id,
                            name,
                            text,
                        },
                    },
                    {
                        onSuccess,
                        onError,
                    }
                )
            } else if (mode === "Update") {
                update.mutate(
                    { id: option!.id, data: { name, text } },
                    {
                        onSuccess,
                        onError,
                    }
                )
            }
        },
        [mode, module, option, create, update, onSuccess, onError]
    )

    const onDelete = useCallback(() => {
        return new Promise((onSuccess, onError) => {
            destroy.mutate({ id: option!.id }, { onSuccess, onError })
        })
    }, [destroy, option])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormTitle>{mode === "Create" ? t("Main.title_new") : option!.name}</FormTitle>
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
                <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("Main.text")}</FormLabel>
                            <FormControl>
                                <Input {...field} data-cy="textInput" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <SaveAndDelete mode={mode} name={`${option?.name}`} onDelete={onDelete} onDeleted={onSuccess} />
                <RootErrorMessage errors={form.formState.errors} />
            </form>
        </Form>
    )
}

export default DailyTodoOptionForm
