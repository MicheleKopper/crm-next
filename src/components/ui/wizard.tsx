import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

import { Label } from "./label";

export function Stepper({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <div className="border-b border-navy-100 bg-navy-100/20 px-6 py-4">
      <ol className="flex items-center">
        {steps.map((label, index) => {
          const isDone = index < current;
          const isActive = index === current;
          return (
            <li
              key={label}
              className={cn(
                "flex items-center",
                index < steps.length - 1 && "flex-1"
              )}
            >
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                    (isDone || isActive) && "bg-navy-900 text-white",
                    isActive && "ring-4 ring-navy-900/15",
                    !isDone && !isActive && "border border-navy-200 bg-white text-navy-400"
                  )}
                >
                  {isDone ? <Check size={14} /> : index + 1}
                </div>
                <span
                  className={cn(
                    "whitespace-nowrap text-xs font-medium",
                    isActive ? "text-navy-900" : "text-navy-400"
                  )}
                >
                  {label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-px flex-1 translate-y-[-10px]",
                    isDone ? "bg-navy-900" : "bg-navy-200"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function WizardSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-navy-900">
        <Icon size={15} className="text-navy-500" />
        {title}
      </div>
      {children}
    </div>
  );
}

export function WizardField({
  htmlFor,
  label,
  required,
  error,
  children,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="ml-0.5 text-status-perdido">*</span>}
      </Label>
      {children}
      {error && <p className="mt-1 text-xs text-status-perdido">{error}</p>}
    </div>
  );
}
