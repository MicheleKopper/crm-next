"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export function DeleteCustomerModal({
  open,
  onClose,
  uid,
  displayName,
}: {
  open: boolean;
  onClose: () => void;
  uid: string;
  displayName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      const response = await fetch(`/api/customers/${uid}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        toast.error(body?.message ?? "Falha ao deletar as informações.");
        return;
      }

      toast.success("Cliente deletado com sucesso.");
      router.push("/clientes");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Excluir cliente">
      <p className="text-sm text-navy-700 dark:text-navy-100">
        Tem certeza que deseja excluir <strong>{displayName}</strong>? Essa
        ação não pode ser desfeita.
      </p>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="danger" disabled={loading} onClick={handleDelete}>
          {loading ? "Excluindo..." : "Excluir"}
        </Button>
      </div>
    </Modal>
  );
}
