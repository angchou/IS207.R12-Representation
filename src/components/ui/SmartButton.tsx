"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Button dùng CVA + cn() (clsx + tailwind-merge).
 * Giao diện tối giản trên nền đen, khối vuông (border-radius = 0), không hiệu ứng màu mè.
 */
export const smartButtonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 border font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-300 disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary: "border-neutral-200 bg-neutral-100 text-neutral-950 hover:bg-neutral-300",
        emerald: "border-emerald-500 bg-emerald-900/60 text-emerald-100 hover:bg-emerald-800/80",
        danger: "border-red-500 bg-red-900/60 text-red-100 hover:bg-red-800/80",
        outline: "border-neutral-700 bg-neutral-900 text-neutral-200 hover:border-neutral-500 hover:bg-neutral-800",
        ghost: "border-transparent bg-transparent text-neutral-300 hover:bg-neutral-800",
      },
      size: {
        sm: "h-7 px-2.5 text-xs",
        md: "h-9 px-3.5 text-sm",
        lg: "h-11 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface SmartButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof smartButtonVariants> {}

export const SmartButton = React.forwardRef<HTMLButtonElement, SmartButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(smartButtonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

SmartButton.displayName = "SmartButton";
