import { DetailField } from "@/components/ui/detail-field";
import type { LeadDetail } from "@/server/modules/leads/lead.mapper";

export function ContactView({ lead }: { lead: LeadDetail }) {
  const contact = lead.contact;

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
      <DetailField label="Nome" value={contact?.fullName} />
      <DetailField label="Cargo" value={contact?.jobTitle} />
      <DetailField label="E-mail" value={contact?.email} copyable />
      <DetailField label="Celular" value={contact?.phone} copyable />
      <DetailField label="Telefone fixo" value={contact?.workPhone} copyable />
      <DetailField label="Ramal" value={contact?.extension} />
      <DetailField
        label="Aniversário"
        value={
          contact?.birthday
            ? new Date(contact.birthday).toLocaleDateString("pt-BR")
            : null
        }
      />
      <DetailField label="Idioma" value={contact?.language} />
    </div>
  );
}
