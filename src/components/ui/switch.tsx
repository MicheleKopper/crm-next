import { type InputHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

export type SwitchProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  description?: string;
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, description, className, id, ...props }, ref) => {
    return (
      <label
        htmlFor={id}
        className={cn(
          "flex cursor-pointer items-start justify-between gap-3 rounded-lg border border-navy-100 bg-navy-100/30 px-4 py-3 dark:border-navy-700 dark:bg-navy-800/40",
          className
        )}
      >
        <span>
          <span className="block text-sm font-medium text-navy-900 dark:text-navy-100">
            {label}
          </span>
          {description && (
            <span className="block text-xs text-navy-500 dark:text-navy-100/70">{description}</span>
          )}
        </span>
        <span className="relative mt-0.5 inline-flex h-5 w-9 flex-shrink-0 items-center">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            className="peer sr-only"
            {...props}
          />
          <span className="absolute inset-0 rounded-full bg-navy-500/30 transition-colors peer-checked:bg-navy-900 peer-focus-visible:ring-2 peer-focus-visible:ring-navy-500/30 dark:bg-navy-100/20 dark:peer-checked:bg-status-lead" />
          <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
        </span>
      </label>
    );
  }
);
Switch.displayName = "Switch";
