"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export function SearchBar({
  basePath,
  placeholder,
  ariaLabel,
}: {
  basePath: string;
  placeholder: string;
  ariaLabel: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialValue = searchParams.get("search") ?? "";
  const [value, setValue] = useState(initialValue);
  const [expanded, setExpanded] = useState(Boolean(initialValue));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      params.set("offset", "0");
      router.push(`${basePath}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function handleExpand() {
    setExpanded(true);
    inputRef.current?.focus();
  }

  function handleBlur() {
    if (!value) setExpanded(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setValue("");
      setExpanded(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div
      className={cn(
        "flex h-9 items-center overflow-hidden rounded-lg border transition-all duration-300 ease-in-out",
        expanded
          ? "w-64 border-navy-100 bg-white"
          : "w-9 border-transparent bg-transparent"
      )}
    >
      <button
        type="button"
        onClick={handleExpand}
        aria-label={ariaLabel}
        title="Buscar"
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-100 hover:text-navy-900"
      >
        <Search size={16} />
      </button>
      <input
        ref={inputRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={placeholder}
        tabIndex={expanded ? 0 : -1}
        className="w-full min-w-0 bg-transparent pr-3 text-sm text-navy-900 outline-none placeholder:text-navy-500/60"
      />
    </div>
  );
}
