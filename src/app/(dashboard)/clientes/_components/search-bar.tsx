"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") ?? "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      params.set("offset", "0");
      router.push(`/clientes?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="flex items-center gap-2 rounded-lg border border-navy-100 bg-white px-3 py-2">
      <Search size={16} className="text-navy-500" />
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Busque por nome ou país…"
        className="w-full text-sm text-navy-900 outline-none placeholder:text-navy-500/60"
      />
    </div>
  );
}
