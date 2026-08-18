"use client";

import { ChevronDown, Search } from "lucide-react";
import {
  Children,
  forwardRef,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type OptionHTMLAttributes,
  type SelectHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

type OptionEntry = { value: string; label: string; disabled: boolean };

function extractOptions(children: SelectProps["children"]): OptionEntry[] {
  const options: OptionEntry[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child) || child.type !== "option") return;
    const props = child.props as OptionHTMLAttributes<HTMLOptionElement>;
    const value = props.value !== undefined ? String(props.value) : "";
    const label = typeof props.children === "string" ? props.children : value;
    options.push({ value, label, disabled: Boolean(props.disabled) });
  });
  return options;
}

/**
 * Visualmente é um botão no mesmo padrão do Select antigo; por baixo mantém
 * um <select> nativo (oculto via sr-only, não display:none) recebendo todas
 * as props originais — isso preserva `{...register(...)}` do react-hook-form
 * e a leitura via `FormData` nativo dos modais de filtro, sem precisar mudar
 * nenhum dos ~50 call sites espalhados pelo projeto.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, value, defaultValue, onChange, onBlur, disabled, id, ...props }, forwardedRef) => {
    const hiddenRef = useRef<HTMLSelectElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const listboxId = useId();

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [highlighted, setHighlighted] = useState(0);
    const [internalValue, setInternalValue] = useState(
      String(value ?? defaultValue ?? "")
    );

    const options = useMemo(() => extractOptions(children), [children]);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? String(value) : internalValue;
    const selected = options.find((option) => option.value === currentValue);

    useEffect(() => {
      if (isControlled) setInternalValue(String(value));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const filtered = useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return options;
      return options.filter((option) => option.label.toLowerCase().includes(q));
    }, [options, query]);

    useEffect(() => {
      setHighlighted(0);
    }, [query, open]);

    useEffect(() => {
      if (!open) return;
      searchRef.current?.focus();
      function onPointerDown(event: MouseEvent) {
        if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
      }
      document.addEventListener("mousedown", onPointerDown);
      return () => document.removeEventListener("mousedown", onPointerDown);
    }, [open]);

    function commit(option: OptionEntry) {
      if (option.disabled) return;
      setInternalValue(option.value);
      setOpen(false);
      setQuery("");

      const node = hiddenRef.current;
      if (node) {
        const setter = Object.getOwnPropertyDescriptor(
          window.HTMLSelectElement.prototype,
          "value"
        )?.set;
        setter?.call(node, option.value);
        node.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }

    function handleKeyDown(event: React.KeyboardEvent) {
      if (!open) {
        if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
          event.preventDefault();
          setOpen(true);
        }
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlighted((i) => Math.min(i + 1, filtered.length - 1));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlighted((i) => Math.max(i - 1, 0));
      } else if (event.key === "Enter") {
        event.preventDefault();
        const option = filtered[highlighted];
        if (option) commit(option);
      } else if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    }

    return (
      <div ref={containerRef} className="relative">
        <select
          ref={(node) => {
            hiddenRef.current = node;
            if (typeof forwardedRef === "function") forwardedRef(node);
            else if (forwardedRef) forwardedRef.current = node;
          }}
          id={id}
          disabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
          aria-hidden="true"
          tabIndex={-1}
          className="sr-only"
          {...(isControlled ? { value } : { defaultValue })}
          {...props}
        >
          {children}
        </select>

        <button
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={handleKeyDown}
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-lg border border-navy-100 bg-white px-3 py-2 text-left text-sm text-navy-900 shadow-sm focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20 disabled:cursor-not-allowed disabled:bg-navy-100/50 disabled:text-navy-500 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-100 dark:disabled:bg-navy-800/50 dark:disabled:text-navy-100/50",
            className
          )}
        >
          <span className={cn("truncate", !selected && "text-navy-500/60 dark:text-navy-100/40")}>
            {selected ? selected.label : "Selecione"}
          </span>
          <ChevronDown size={15} className="shrink-0 text-navy-500 dark:text-navy-100/60" />
        </button>

        {open && (
          <div
            className="absolute left-0 right-0 z-30 mt-1 overflow-hidden rounded-lg border border-navy-100 bg-white shadow-lg dark:border-navy-700 dark:bg-navy-900"
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-center gap-2 border-b border-navy-100 px-2.5 py-2 dark:border-navy-700">
              <Search size={14} className="shrink-0 text-navy-500 dark:text-navy-100/50" />
              <input
                ref={searchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar..."
                aria-label="Buscar opção"
                className="w-full bg-transparent text-sm text-navy-900 outline-none placeholder:text-navy-500/60 dark:text-navy-100 dark:placeholder:text-navy-100/40"
              />
            </div>
            <ul id={listboxId} role="listbox" className="max-h-56 overflow-y-auto py-1 text-sm">
              {filtered.length === 0 ? (
                <li className="px-3 py-2 text-navy-500 dark:text-navy-100/50">
                  Nenhum resultado encontrado
                </li>
              ) : (
                filtered.map((option, index) => (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={option.value === currentValue}
                    onMouseEnter={() => setHighlighted(index)}
                    onClick={() => commit(option)}
                    className={cn(
                      "cursor-pointer truncate px-3 py-2 transition-colors",
                      index === highlighted
                        ? "bg-navy-100 dark:bg-navy-800"
                        : option.value === currentValue &&
                            "bg-navy-100/60 font-medium dark:bg-navy-800/60",
                      option.disabled && "cursor-not-allowed opacity-40"
                    )}
                  >
                    {option.label}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";
