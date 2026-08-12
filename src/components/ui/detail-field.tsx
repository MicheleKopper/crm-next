"use client";

import { cn } from "@/lib/utils";

import { CopyButton } from "./copy-button";

const EMPTY_LABEL = "Não informado";

function isEmptyValue(value: React.ReactNode) {
  return value === null || value === undefined || value === "";
}

export function DetailField({
  label,
  value,
  copyable,
}: {
  label: string;
  value: React.ReactNode;
  copyable?: boolean;
}) {
  const empty = isEmptyValue(value);
  const canCopy = copyable && !empty && typeof value === "string";

  return (
    <div className="group flex flex-wrap items-baseline gap-x-1.5 text-sm">
      <span className="text-navy-500">{label}:</span>
      <span
        className={cn(
          "font-medium",
          empty ? "italic text-navy-400" : "text-navy-900"
        )}
      >
        {empty ? EMPTY_LABEL : value}
      </span>

      {canCopy && <CopyButton value={value} label={label} />}
    </div>
  );
}

export function DetailTextBlock({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  const empty = isEmptyValue(value);

  return (
    <div className="rounded-lg border border-navy-100 bg-navy-100/20 px-3 py-2.5">
      <p className="text-xs font-medium text-navy-500">{label}</p>
      <p
        className={cn(
          "mt-0.5 whitespace-pre-wrap text-sm",
          empty ? "italic text-navy-400" : "text-navy-900"
        )}
      >
        {empty ? EMPTY_LABEL : value}
      </p>
    </div>
  );
}
