import { type InputHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "block w-full rounded-lg border border-navy-100 bg-white px-3 py-2 text-sm text-navy-900 shadow-sm placeholder:text-navy-500/60 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20 disabled:bg-navy-100/50 disabled:text-navy-500 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-100 dark:placeholder:text-navy-100/40 dark:disabled:bg-navy-800/50 dark:disabled:text-navy-100/50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
