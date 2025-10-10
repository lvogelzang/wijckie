import * as React from "react"

import { cn } from "@/lib/utils"

function FormTitle({ className, ...props }: React.ComponentProps<"h2">) {
    return (
        <h2
            className={cn(
                "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
                className
            )}
            {...props}
        />
    )
}

export { FormTitle }
