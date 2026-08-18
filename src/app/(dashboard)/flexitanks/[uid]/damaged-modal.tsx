"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";

export function DamagedModal({
  open,
  onClose,
  uid,
}: {
  open: boolean;
  onClose: () => void;
  uid: string;
}) {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  function handleClose() {
    setComment("");
    onClose();
  }

  async function handleConfirm() {
    if (!comment.trim()) {
      toast.error("Descreva o motivo do dano.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/flexitanks/${uid}/damaged`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        toast.error(body?.message ?? "Erro ao atualizar o flexitank.");
        return;
      }

      toast.success("Flexitank alterado para danificado.");
      handleClose();
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title='Alterar status para "danificado"?'>
      <p className="text-sm text-navy-700 dark:text-navy-100">
        Ao confirmar, o flexitank será marcado como{" "}
        <strong>danificado</strong> e os dados relacionados serão atualizados.
      </p>

      <div className="mt-4">
        <Label htmlFor="damaged-comment">Descreva o motivo do dano</Label>
        <Textarea
          id="damaged-comment"
          rows={4}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="danger" disabled={loading} onClick={handleConfirm}>
          {loading ? "Confirmando..." : "Confirmar"}
        </Button>
      </div>
    </Modal>
  );
}
