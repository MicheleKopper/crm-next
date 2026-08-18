"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  icon,
  headerExtra,
  footer,
  widthClassName,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerExtra?: React.ReactNode;
  footer?: React.ReactNode;
  widthClassName?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end bg-navy-950/40">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "flex h-full w-full flex-col bg-white shadow-xl dark:bg-navy-900",
          widthClassName ?? "max-w-xl"
        )}
      >
        <div className="flex items-start gap-3 border-b border-navy-100 px-6 py-5 dark:border-navy-700">
          {icon && (
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-navy-900/5 text-navy-900 dark:bg-navy-100/10 dark:text-navy-100">
              {icon}
            </div>
          )}
          <div className="flex-1 pt-0.5">
            <h2 className="text-lg font-bold text-navy-900 dark:text-navy-100">{title}</h2>
            {subtitle && <p className="text-sm text-navy-500 dark:text-navy-100/70">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-full p-2 text-navy-500 hover:bg-navy-100 dark:text-navy-100/70 dark:hover:bg-navy-800"
          >
            <X size={18} />
          </button>
        </div>

        {headerExtra}

        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <div className="border-t border-navy-100 px-6 py-4 dark:border-navy-700">{footer}</div>
        )}
      </div>
    </div>,
    document.body
  );
}
