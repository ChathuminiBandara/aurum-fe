"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "bits-ui"

import { cn } from "@/lib/utils"

const Select = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Root
    className={cn(
      "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
    ref={ref}
  />
))
Select.displayName = SelectPrimitive.Root.displayName

export { Select }

