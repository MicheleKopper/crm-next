"use client";

import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import {
  ACCOUNT_POTENTIALS,
  CUSTOMER_SEGMENTS,
  CUSTOMER_SIZES,
  CUSTOMER_STATUSES,
} from "@/server/modules/customers/customer.dto";

const FILTER_KEYS = ["segment", "size", "status", "accountPotential", "ownerId"];

export function FilterModal({
  owners,
}: {
  owners: { id: string; fullName: string }[];
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
    router.push(`/clientes?${params.toString()}`);
    setOpen(false);
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());
    for (const key of FILTER_KEYS) params.delete(key);
    params.set("offset", "0");
    router.push(`/clientes?${params.toString()}`);
  }

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <Filter size={16} />
        Filtrar
        {activeFilterCount > 0 && (
          <span className="ml-1 rounded-full bg-navy-900 px-1.5 py-0.5 text-xs text-white">
            {activeFilterCount}
          </span>
        )}
      </Button>
      {activeFilterCount > 0 && (
        <Button variant="ghost" onClick={clearFilters}>
          Limpar
        </Button>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Filtrar clientes">
        <form
          action={(formData) => apply(formData)}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="filter-segment">Segmento</Label>
            <Select
              id="filter-segment"
              name="segment"
              defaultValue={searchParams.get("segment") ?? ""}
            >
              <option value="">Todos</option>
              {CUSTOMER_SEGMENTS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="filter-size">Porte</Label>
            <Select
              id="filter-size"
              name="size"
              defaultValue={searchParams.get("size") ?? ""}
            >
              <option value="">Todos</option>
              {CUSTOMER_SIZES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="filter-status">Status</Label>
            <Select
              id="filter-status"
              name="status"
              defaultValue={searchParams.get("status") ?? ""}
            >
              <option value="">Todos</option>
              {CUSTOMER_STATUSES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="filter-potential">Potencial</Label>
            <Select
              id="filter-potential"
              name="accountPotential"
              defaultValue={searchParams.get("accountPotential") ?? ""}
            >
              <option value="">Todos</option>
              {ACCOUNT_POTENTIALS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="filter-owner">Responsável</Label>
            <Select
              id="filter-owner"
              name="ownerId"
              defaultValue={searchParams.get("ownerId") ?? ""}
            >
              <option value="">Todos</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.fullName}
                </option>
              ))}
            </Select>
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
