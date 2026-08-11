"use client";

import { ArrowLeftRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type TransferSearchResult = {
  uid: string;
  serialNumber: string;
  poNumber: string | null;
  companyName: string | null;
  size: string;
};

export function TransferDrawer({
  locations,
}: {
  locations: { id: string; displayName: string }[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<TransferSearchResult[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [locationId, setLocationId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !search.trim()) return;

    const timeout = setTimeout(async () => {
      const params = new URLSearchParams({ search: search.trim() });
      const response = await fetch(`/api/flexitanks/search-transfer?${params}`);
      if (!response.ok) return;
      const body = await response.json();
      setResults(body.results ?? []);
    }, 300);
    return () => clearTimeout(timeout);
  }, [open, search]);

  function handleSearchChange(value: string) {
    setSearch(value);
    if (!value.trim()) setResults([]);
  }

  function reset() {
    setSearch("");
    setResults([]);
    setSelected([]);
    setLocationId("");
  }

  function toggle(uid: string) {
    setSelected((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  }

  async function handleSubmit() {
    if (selected.length === 0 || !locationId) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/flexitanks/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uids: selected, locationId }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        toast.error(body?.message ?? "Erro ao transferir flexitanks.");
        return;
      }

      toast.success("Flexitank(s) transferido(s) com sucesso.");
      setOpen(false);
      reset();
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Button className="h-9" onClick={() => setOpen(true)}>
        <ArrowLeftRight size={16} />
        Transferir
      </Button>

      <Drawer
        open={open}
        onClose={() => {
          setOpen(false);
          reset();
        }}
        title="Transferir flexitanks"
        subtitle="Busque, selecione e escolha o destino"
        icon={<ArrowLeftRight size={20} />}
        widthClassName="max-w-2xl"
        footer={
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={selected.length === 0 || !locationId || submitting}
              onClick={handleSubmit}
            >
              {submitting ? "Transferindo..." : "Transferir"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="search-transfer">Pesquisar</Label>
              <Input
                id="search-transfer"
                placeholder="Número, PO ou localização"
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
              />
            </div>

            {selected.length > 0 && (
              <div>
                <Label htmlFor="transfer-location">Transferir para</Label>
                <Select
                  id="transfer-location"
                  value={locationId}
                  onChange={(event) => setLocationId(event.target.value)}
                >
                  <option value="">Selecione</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.displayName}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </div>

          {selected.length > 0 && (
            <p className="text-sm text-navy-500">
              <span className="font-semibold text-navy-900">
                {selected.length}
              </span>{" "}
              selecionado(s)
            </p>
          )}

          {results.length === 0 ? (
            <p className="py-8 text-center text-navy-500">
              {search.trim()
                ? "Nenhum flexitank localizado."
                : "Digite para buscar um flexitank."}
            </p>
          ) : (
            <div className="max-h-[50vh] space-y-1 overflow-y-auto">
              {results.map((result) => (
                <label
                  key={result.uid}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-navy-100 px-3 py-2 hover:bg-navy-50"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(result.uid)}
                    onChange={() => toggle(result.uid)}
                    className="h-4 w-4 rounded border-navy-100"
                  />
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="font-semibold text-navy-900">
                      {result.serialNumber}
                    </p>
                    <p className="truncate text-navy-500">
                      {result.poNumber || "—"} · {result.companyName || "—"} ·{" "}
                      {result.size}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
}
