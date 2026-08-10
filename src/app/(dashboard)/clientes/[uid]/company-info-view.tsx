import { DetailField } from "@/components/ui/detail-field";
import type { CustomerDetail } from "@/server/modules/customers/customer.mapper";

export function CompanyInfoView({ customer }: { customer: CustomerDetail }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
      <DetailField
        label="Empresa Estrangeira"
        value={customer.isForeignCompany ? "Sim" : "Não"}
      />
      <DetailField label="Razão Social" value={customer.legalName} />
      <DetailField label="País" value={customer.country} />
      <DetailField
        label={customer.isForeignCompany ? "Tax ID" : "CNPJ"}
        value={customer.taxId}
        copyable
      />
      <DetailField label="Nome" value={customer.displayName} />
      <DetailField label="Website" value={customer.website} />
      <DetailField label="Telefone" value={customer.phone} copyable />
      <DetailField
        label={customer.isForeignCompany ? "Código Postal" : "CEP"}
        value={customer.postalCode}
      />
      <DetailField label="Responsável" value={customer.ownerFullName} />
      <DetailField
        label={customer.isForeignCompany ? "State / Province" : "Estado"}
        value={customer.state}
      />
      <DetailField label="Cidade" value={customer.city} />
      <DetailField label="Número" value={customer.number} />
      <DetailField label="Endereço" value={customer.address} copyable />
      <DetailField label="Complemento" value={customer.complement} />
    </div>
  );
}
