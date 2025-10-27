import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import type React from "react"

const pageVariants = cva(
    "bg-repeat before:content-[''] before:block before:w-full before:h-full before:absolute before:top-0 before:left-0 before:bg-[url('/noise.png')] before:opacity-[0.04] before:z-[1] before:pointer-events-none",
    {
        variants: {
            variant: {
                default: "bg-white",
                anonymous: "relative w-full pt-[80px] mb-[-60px] pb-[60px] bg-[url('/gradient-1.svg')] flex flex-col items-center justify-center",
                dashboard: "relative w-full pt-[80px] mb-[-60px] pb-[60px] bg-[url('/gradient-2.svg')]",
                configuration: "relative w-full pt-[80px] mb-[-60px] pb-[60px] bg-[url('/gradient-2.svg')]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

function Page({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof pageVariants>) {
    return <div className={cn(pageVariants({ variant, className }))} {...props} />
}

export { Page }
