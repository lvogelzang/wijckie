import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { type TypeEnum } from "../api/models/api"

interface InspirationOptionTypeOption {
    id: TypeEnum
    label: string
}

const useInspirationOptionTypeOptions = () => {
    const { t } = useTranslation()

    return useMemo(() => {
        const options: InspirationOptionTypeOption[] = [
            { id: "text", label: t("InspirationOption.type_text") },
            { id: "image", label: t("InspirationOption.type_image") },
        ]
        return options
    }, [t])
}

export default useInspirationOptionTypeOptions
