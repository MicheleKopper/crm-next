"use client";

import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { PO_STATUSES } from "@/server/modules/purchase-orders/purchase-order.dto";

const FILTER_KEYS = [
  "status",
  "poDateFrom",
  "poDateUntil",
  "arrivalDateFrom",
  "arrivalDateUntil",
];

export function FilterModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const activeFilterCount = FILTER_KEYS.filter((key) => searchParams.get(key)).length;

  function apply(formData: FormData) {
    const params = new URLSearchParams(searchParams.toString());
    for (const key of FILTER_KEYS) {
      const value = formData.get(key);
      if (value) {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    }
    params.set("offset", "0");
    router.push(`/purchase-orders?${params.toString()}`);
    setOpen(false);
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());
    for (const key of FILTER_KEYS) params.delete(key);
    params.set("offset", "0");
    router.push(`/purchase-orders?${params.toString()}`);
  }

  return (
    <>
      <div className="relative">
        <Button
          variant="secondary"
          onClick={() => setOpen(true)}
          aria-label="Filtrar purchase orders"
          title="Filtrar"
          className="h-9 w-9 p-0"
        >
          <Filter size={16} />
        </Button>
        {activeFilterCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-navy-900 text-[10px] font-semibold text-white">
            {activeFilterCount}
          </span>
        )}
      </div>
      {activeFilterCount > 0 && (
        <Button variant="ghost" onClick={clearFilters} className="h-9 px-2 text-xs">
          Limpar
        </Button>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Filtrar purchase orders">
        <form action={(formData) => apply(formData)} className="space-y-4">
          <div>
            <Label htmlFor="filter-status">Status</Label>
            <Select
              id="filter-status"
              name="status"
              defaultValue={searchParams.get("status") ?? ""}
            >
              <option value="">Todos</option>
              {PO_STATUSES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="filter-po-date-from">Data da PO (de)</Label>
              <Input
                id="filter-po-date-from"
                name="poDateFrom"
                type="date"
                defaultValue={searchParams.get("poDateFrom") ?? ""}
              />
            </div>
            <div>
              <Label htmlFor="filter-po-date-until">Data da PO (até)</Label>
              <Input
                id="filter-po-date-until"
                name="poDateUntil"
                type="date"
                defaultValue={searchParams.get("poDateUntil") ?? ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="filter-arrival-date-from">Chegada (de)</Label>
              <Input
                id="filter-arrival-date-from"
                name="arrivalDateFrom"
                type="date"
                defaultValue={searchParams.get("arrivalDateFrom") ?? ""}
              />
            </div>
            <div>
              <Label htmlFor="filter-arrival-date-until">Chegada (até)</Label>
              <Input
                id="filter-arrival-date-until"
                name="arrivalDateUntil"
                type="date"
                defaultValue={searchParams.get("arrivalDateUntil") ?? ""}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Aplicar</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
