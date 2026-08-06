"use client";

import { FileDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";

export function ExportModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleExport(formData: FormData) {
    const from = formData.get("from");
    const until = formData.get("until");
    if (!from || !until) {
      toast.error("Selecione o período!");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        from: String(from),
        until: String(until),
      });
      const response = await fetch(`/api/customers/export?${params.toString()}`);

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        toast.error(body?.message ?? "Erro ao exportar clientes.");
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `clientes-${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("Clientes exportados com sucesso!");
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <FileDown size={16} />
        Exportar
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Exportar clientes">
        <form action={handleExport} className="space-y-4">
          <div>
            <Label htmlFor="export-from">De</Label>
            <Input id="export-from" name="from" type="date" required />
          </div>
          <div>
            <Label htmlFor="export-until">Até</Label>
            <Input id="export-until" name="until" type="date" required />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Exportando..." : "Exportar"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
