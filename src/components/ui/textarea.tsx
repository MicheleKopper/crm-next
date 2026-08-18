import { type TextareaHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "block w-full rounded-lg border border-navy-100 bg-white px-3 py-2 text-sm text-navy-900 shadow-sm placeholder:text-navy-500/60 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-100 dark:placeholder:text-navy-100/40",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
