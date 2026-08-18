"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copiar ${label}`}
        title="Copiar"
        className="shrink-0 text-navy-400 opacity-0 transition-opacity hover:text-navy-900 focus-visible:opacity-100 group-hover:opacity-100 dark:hover:text-navy-100"
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
      {copied && <span className="shrink-0 text-xs text-status-ativo">Copiado</span>}
    </>
  );
}
