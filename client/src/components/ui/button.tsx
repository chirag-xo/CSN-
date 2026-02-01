import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 no-underline",
    {
        variants: {
            variant: {
                default: `
          bg-[linear-gradient(135deg,#5a0980_0%,#7a0ab8_100%)]
          text-white
          hover:text-white
          hover:bg-[linear-gradient(135deg,#7a0ab8_0%,#9e03fe_100%)]
          hover:shadow-[0px_4px_12px_rgba(158,3,254,0.4)]
          hover:-translate-y-[2px]
        `,
                secondary:
                    "bg-gray-100 text-gray-900 hover:bg-gray-200",
                outline:
                    "border border-input bg-transparent hover:bg-accent",
                ghost:
                    "bg-transparent hover:bg-accent",
                link:
                    "text-primary underline-offset-4 hover:underline",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            },
            size: {
                default: "h-12 px-8 text-base",
                sm: "h-10 px-6 text-sm",
                lg: "h-14 px-12 text-lg",
                icon: "h-12 w-12",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)


export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
