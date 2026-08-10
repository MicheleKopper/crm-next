"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

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
  const [copied, setCopied] = useState(false);
  const empty = isEmptyValue(value);
  const canCopy = copyable && !empty && typeof value === "string";

  async function handleCopy() {
    if (typeof value !== "string") return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

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

      {canCopy && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copiar ${label}`}
          title="Copiar"
          className="text-navy-400 opacity-0 transition-opacity hover:text-navy-900 focus-visible:opacity-100 group-hover:opacity-100"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </button>
      )}
      {canCopy && copied && (
        <span className="text-xs text-status-ativo">Copiado</span>
      )}
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
