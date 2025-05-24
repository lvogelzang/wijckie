import type { FieldValues, Path, UseFormSetError } from "react-hook-form"

export const setOptionalError = <Type extends FieldValues>(setError: UseFormSetError<Type>, key: `root.${string}` | "root" | Path<Type>, errors?: string[]) => {
    if (errors) {
        setError(key, { type: "manual", message: errors.join(" ") })
    }
}
