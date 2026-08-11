"use client";

import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { FLEXITANK_SIZES } from "@/server/modules/flexitanks/flexitank.dto";

const FILTER_KEYS = ["size", "locationId", "poNumber", "booking"];

export function FilterModal({
  locations,
}: {
  locations: { id: string; displayName: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const activeFilterCount = FILTER_KEYS.filter((key) =>
    searchParams.get(key)
  ).length;

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
    router.push(`/flexitanks?${params.toString()}`);
    setOpen(false);
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());
    for (const key of FILTER_KEYS) params.delete(key);
    params.set("offset", "0");
    router.push(`/flexitanks?${params.toString()}`);
  }

  return (
    <>
      <div className="relative">
        <Button
          variant="secondary"
          onClick={() => setOpen(true)}
          aria-label="Filtrar flexitanks"
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
        <Button
          variant="ghost"
          onClick={clearFilters}
          className="h-9 px-2 text-xs"
        >
          Limpar
        </Button>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Filtrar flexitanks">
        <form action={(formData) => apply(formData)} className="space-y-4">
          <div>
            <Label htmlFor="filter-size">Tamanho</Label>
            <Select
              id="filter-size"
              name="size"
              defaultValue={searchParams.get("size") ?? ""}
            >
              <option value="">Todos</option>
              {FLEXITANK_SIZES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="filter-location">Localização</Label>
            <Select
              id="filter-location"
              name="locationId"
              defaultValue={searchParams.get("locationId") ?? ""}
            >
              <option value="">Todas</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.displayName}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="filter-po">Purchase order</Label>
            <Input
              id="filter-po"
              name="poNumber"
              defaultValue={searchParams.get("poNumber") ?? ""}
            />
          </div>

          <div>
            <Label htmlFor="filter-booking">Booking</Label>
            <Input
              id="filter-booking"
              name="booking"
              defaultValue={searchParams.get("booking") ?? ""}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Aplicar</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
