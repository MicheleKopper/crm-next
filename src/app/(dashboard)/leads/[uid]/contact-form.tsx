"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  LEAD_LANGUAGES,
  type UpdateLeadContactFormInput,
  type UpdateLeadContactInput,
  updateLeadContactSchema,
} from "@/server/modules/leads/lead.dto";
import type { LeadDetail } from "@/server/modules/leads/lead.mapper";

function toDateInputValue(value: Date | string | null | undefined) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export function ContactForm({
  lead,
  onSaved,
  onCancel,
}: {
  lead: LeadDetail;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const router = useRouter();
  const contact = lead.contact;
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateLeadContactFormInput, unknown, UpdateLeadContactInput>({
    resolver: zodResolver(updateLeadContactSchema),
    defaultValues: {
      name: contact?.name ?? "",
      lastName: contact?.lastName ?? "",
      email: contact?.email ?? "",
      phone: contact?.phone ?? "",
      workPhone: contact?.workPhone ?? "",
      extension: contact?.extension ?? "",
      jobTitle: contact?.jobTitle ?? "",
      birthday: toDateInputValue(contact?.birthday),
      language: (contact?.language as UpdateLeadContactInput["language"]) ?? "Português",
    },
  });

  async function onSubmit(values: UpdateLeadContactInput) {
    const response = await fetch(`/api/leads/${lead.uid}/contact`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      toast.error(body?.message ?? "Erro ao atualizar o contato.");
      return;
    }

    toast.success("Contato editado com sucesso.");
    router.refresh();
    onSaved();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <div>
        <Label>Nome</Label>
        <Input {...register("name")} />
      </div>

      <div>
        <Label>Sobrenome</Label>
        <Input {...register("lastName")} />
      </div>

      <div>
        <Label>Cargo</Label>
        <Input {...register("jobTitle")} />
      </div>

      <div>
        <Label>E-mail</Label>
        <Input type="email" {...register("email")} />
      </div>

      <div>
        <Label>Celular</Label>
        <Input {...register("phone")} />
      </div>

      <div>
        <Label>Telefone fixo</Label>
        <Input {...register("workPhone")} />
      </div>

      <div>
        <Label>Ramal</Label>
        <Input {...register("extension")} />
      </div>

      <div>
        <Label>Aniversário</Label>
        <Input type="date" {...register("birthday")} />
      </div>

      <div>
        <Label>Idioma</Label>
        <Select {...register("language")}>
          {LEAD_LANGUAGES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex items-center gap-2 sm:col-span-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={isSubmitting}
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
