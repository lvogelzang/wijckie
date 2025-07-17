import { useCallback } from "react"
import { ObjectSchema, ValidationError } from "yup"

/* eslint-disable */

export const useYupValidationResolver = (validationSchema: ObjectSchema<any>) =>
    useCallback(
        async (data: any) => {
            try {
                const values = await validationSchema.validate(data, {
                    abortEarly: false,
                })

                return {
                    values,
                    errors: {},
                }
            } catch (errors: any) {
                return {
                    values: {},
                    errors: errors.inner.reduce(
                        (allErrors: ValidationError[], currentError: ValidationError) => ({
                            ...allErrors,
                            [currentError.path!]: {
                                type: currentError.type ?? "invalid",
                                message: currentError.message,
                            },
                        }),
                        {}
                    ),
                }
            }
        },
        [validationSchema]
    )

/* eslint-enable */
