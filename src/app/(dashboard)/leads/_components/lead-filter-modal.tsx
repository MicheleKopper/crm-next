"use client";

import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import {
  LEAD_MODALS,
  LEAD_STATUSES,
  LEAD_URGENCIES,
} from "@/server/modules/leads/lead.dto";

const FILTER_KEYS = ["status", "operatorId", "modal", "urgency"];

export function LeadFilterModal({
  operators,
}: {
  operators: { id: string; fullName: string }[];
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
    router.push(`/leads?${params.toString()}`);
    setOpen(false);
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());
    for (const key of FILTER_KEYS) params.delete(key);
    params.set("offset", "0");
    router.push(`/leads?${params.toString()}`);
  }

  return (
    <>
      <div className="relative">
        <Button
          variant="secondary"
          onClick={() => setOpen(true)}
          aria-label="Filtrar leads"
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

      <Modal open={open} onClose={() => setOpen(false)} title="Filtrar leads">
        <form action={(formData) => apply(formData)} className="space-y-4">
          <div>
            <Label htmlFor="filter-status">Status</Label>
            <Select
              id="filter-status"
              name="status"
              defaultValue={searchParams.get("status") ?? ""}
            >
              <option value="">Todos</option>
              {LEAD_STATUSES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="filter-operator">Responsável</Label>
            <Select
              id="filter-operator"
              name="operatorId"
              defaultValue={searchParams.get("operatorId") ?? ""}
            >
              <option value="">Todos</option>
              {operators.map((operator) => (
                <option key={operator.id} value={operator.id}>
                  {operator.fullName}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="filter-modal">Modal</Label>
            <Select
              id="filter-modal"
              name="modal"
              defaultValue={searchParams.get("modal") ?? ""}
            >
              <option value="">Todos</option>
              {LEAD_MODALS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="filter-urgency">Urgência</Label>
            <Select
              id="filter-urgency"
              name="urgency"
              defaultValue={searchParams.get("urgency") ?? ""}
            >
              <option value="">Todas</option>
              {LEAD_URGENCIES.map((option) => (
                <option key={option} value={option}>
                  {option}
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
