"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function Pagination({
  limit,
  offset,
  currentCount,
  totalCount,
}: {
  limit: number;
  offset: number;
  currentCount: number;
  totalCount: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      params.set(key, value);
    }
    router.push(`/clientes?${params.toString()}`);
  }

  const hasPrevious = offset > 0;
  const hasNext = offset + limit < totalCount;

  return (
    <div className="flex items-center justify-end gap-3">
      <select
        value={limit}
        onChange={(event) =>
          updateParams({ limit: event.target.value, offset: "0" })
        }
        className="rounded-lg border border-navy-100 bg-white px-2 py-1.5 text-sm text-navy-900"
      >
        {[10, 20, 50, 100].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <button
        type="button"
        disabled={!hasPrevious}
        onClick={() => updateParams({ offset: String(Math.max(0, offset - limit)) })}
        className="rounded-lg border border-navy-100 p-2 text-navy-700 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Página anterior"
      >
        <ChevronLeft size={16} />
      </button>

      <button
        type="button"
        disabled={!hasNext}
        onClick={() => updateParams({ offset: String(offset + limit) })}
        className="rounded-lg border border-navy-100 p-2 text-navy-700 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Próxima página"
      >
        <ChevronRight size={16} />
      </button>

      <span className="text-sm text-navy-500">
        {(offset + currentCount).toLocaleString("pt-BR")} de{" "}
        {totalCount.toLocaleString("pt-BR")}
      </span>
    </div>
  );
}
