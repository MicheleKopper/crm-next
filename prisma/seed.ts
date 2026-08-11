import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const ADMIN_PERMISSIONS = {
  customers_create: true,
  customers_edit: true,
  customers_delete: true,
  leads_create: true,
  leads_edit: true,
  leads_delete: true,
};

const COMMERCIAL_PERMISSIONS = {
  customers_create: true,
  customers_edit: true,
  customers_delete: false,
  leads_create: true,
  leads_edit: true,
  leads_delete: false,
};

type SeedCustomer = {
  displayName: string;
  legalName: string;
  taxId: string;
  country: string;
  city: string;
  state: string;
  segment?: string;
  size?: string;
  status?: string;
  accountPotential?: string;
  cargoType?: string;
};

const CUSTOMERS: SeedCustomer[] = [
  { displayName: "ADAMANT", legalName: "ADAMANT GROUP LTD", taxId: "475331678", country: "BRAZIL", city: "Santos", state: "SP" },
  { displayName: "ADM International", legalName: "ADM International Sàrl", taxId: "CHE-113.903.886", country: "SWITZERLAND", city: "Geneva", state: "GE", segment: "Trading", size: "Corporativo", status: "Ativo", accountPotential: "Alto", cargoType: "General Cargo" },
  { displayName: "AGROFORTE", legalName: "AGROFORTE INDÚSTRIA, COMÉRCIO E TRANSPORTE LTDA", taxId: "05.115.544/0001-12", country: "BRAZIL", city: "Rio Verde", state: "GO", segment: "Exportador", size: "Grande", status: "Prospecto", accountPotential: "Médio", cargoType: "Flexitank" },
  { displayName: "ALMAD", legalName: "ALMAD AGROINDUSTRIA LTDA", taxId: "66.850.173/0002-98", country: "BRAZIL", city: "Itumbiara", state: "GO" },
  { displayName: "Almad - Itumbiara", legalName: "Almad Agroindustria LTDA", taxId: "66.850.173/0003-79", country: "BRAZIL", city: "Itumbiara", state: "GO" },
  { displayName: "ALMAD SÃO BERNARDO DO CAMPO", legalName: "ALMAD AGROINDUSTRIA LTDA", taxId: "66.850.173/0004-50", country: "BRAZIL", city: "São Bernardo do Campo", state: "SP", segment: "Importador", size: "Médio", status: "Lead", accountPotential: "Baixo", cargoType: "Isotank" },
  { displayName: "Brasil Sul Trading", legalName: "Brasil Sul Trading Comércio Exterior LTDA", taxId: "12.345.678/0001-90", country: "BRAZIL", city: "Porto Alegre", state: "RS", segment: "Trading", size: "Pequeno", status: "Ativo", accountPotential: "Médio", cargoType: "General Cargo" },
  { displayName: "Costa Verde Exportadora", legalName: "Costa Verde Exportadora de Frutas LTDA", taxId: "23.456.789/0001-01", country: "BRAZIL", city: "Fortaleza", state: "CE", segment: "Exportador", size: "Micro", status: "Perdido", accountPotential: "Baixo", cargoType: "Flexitank" },
  { displayName: "Del Mar Imports", legalName: "Del Mar Imports S.A.", taxId: "RUC-20456789123", country: "PERU", city: "Lima", state: "Lima", segment: "Importador", size: "Grande", status: "Ativo", accountPotential: "Estratégico", cargoType: "Isotank" },
  { displayName: "Estrela do Norte", legalName: "Estrela do Norte Comércio Internacional LTDA", taxId: "34.567.890/0001-11", country: "BRAZIL", city: "Manaus", state: "AM" },
  { displayName: "Fenix Logística", legalName: "Fenix Logística e Distribuição LTDA", taxId: "45.678.901/0001-22", country: "BRAZIL", city: "Curitiba", state: "PR", segment: "Trading", size: "Médio", status: "Inativo", accountPotential: "Baixo", cargoType: "General Cargo" },
  { displayName: "Global Grains Co.", legalName: "Global Grains Company Inc.", taxId: "EIN-98-7654321", country: "UNITED STATES", city: "Houston", state: "TX", segment: "Importador", size: "Corporativo", status: "Ativo", accountPotential: "Estratégico", cargoType: "General Cargo" },
  { displayName: "Horizonte Agrícola", legalName: "Horizonte Agrícola Exportação LTDA", taxId: "56.789.012/0001-33", country: "BRAZIL", city: "Sorriso", state: "MT", segment: "Exportador", size: "Grande", status: "Prospecto", accountPotential: "Alto", cargoType: "Flexitank" },
  { displayName: "Ipê Trading", legalName: "Ipê Trading Comércio Exterior LTDA", taxId: "67.890.123/0001-44", country: "BRAZIL", city: "Campinas", state: "SP" },
  { displayName: "Jade Ocean Partners", legalName: "Jade Ocean Partners Pte. Ltd.", taxId: "UEN-201812345K", country: "SINGAPORE", city: "Singapore", state: "Singapore", segment: "Trading", size: "Corporativo", status: "Lead", accountPotential: "Alto", cargoType: "Isotank" },
];

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "");
}

type SeedLead = {
  companyName: string;
  legalName: string;
  taxId: string;
  contactName: string;
  contactLastName: string;
  jobTitle: string;
  status: string;
  urgency: string;
  modal: string;
  score: number;
  source: string;
};

const LEADS: SeedLead[] = [
  { companyName: "Nortel Química", legalName: "Nortel Química Industrial LTDA", taxId: "78.901.234/0001-55", contactName: "Rafael", contactLastName: "Souza", jobTitle: "Gerente de Compras", status: "Novo", urgency: "Alto", modal: "Marítimo", score: 65, source: "Site" },
  { companyName: "Vale Azul Alimentos", legalName: "Vale Azul Alimentos Exportação LTDA", taxId: "89.012.345/0001-66", contactName: "Camila", contactLastName: "Ferreira", jobTitle: "Diretora Comercial", status: "Contato", urgency: "Médio", modal: "Marítimo", score: 48, source: "Indicação" },
  { companyName: "Pampa Rodas", legalName: "Pampa Rodas Transportes LTDA", taxId: "90.123.456/0001-77", contactName: "Eduardo", contactLastName: "Martins", jobTitle: "Comprador", status: "Negociação", urgency: "Crítico", modal: "Rodoviário", score: 82, source: "Evento" },
  { companyName: "Cristal Vidros", legalName: "Cristal Vidros do Brasil LTDA", taxId: "01.234.567/0001-88", contactName: "Fernanda", contactLastName: "Lima", jobTitle: "Analista de Importação", status: "Perdido", urgency: "Baixo", modal: "Aéreo", score: 22, source: "Online" },
];

async function main() {
  const [adminPasswordHash, commercialPasswordHash] = await Promise.all([
    bcrypt.hash("admin123", 10),
    bcrypt.hash("comercial123", 10),
  ]);

  const admin = await prisma.user.upsert({
    where: { email: "admin@crm.local" },
    create: {
      fullName: "Michele Kopper",
      email: "admin@crm.local",
      passwordHash: adminPasswordHash,
      permissions: ADMIN_PERMISSIONS,
    },
    update: { fullName: "Michele Kopper", permissions: ADMIN_PERMISSIONS },
  });

  const commercial = await prisma.user.upsert({
    where: { email: "comercial@crm.local" },
    create: {
      fullName: "Bruno Comercial",
      email: "comercial@crm.local",
      passwordHash: commercialPasswordHash,
      permissions: COMMERCIAL_PERMISSIONS,
    },
    update: { permissions: COMMERCIAL_PERMISSIONS },
  });

  const owners = [admin.id, commercial.id];

  for (const [index, customer] of CUSTOMERS.entries()) {
    const existing = await prisma.company.findUnique({
      where: { taxId: customer.taxId },
    });
    if (existing) continue;

    const ownerId = owners[index % owners.length];
    const hasProfile = Boolean(customer.status);

    await prisma.company.create({
      data: {
        displayName: customer.displayName,
        legalName: customer.legalName,
        taxId: customer.taxId,
        foreignValue: customer.country !== "BRAZIL",
        phone: `+55 (11) 9${(1000 + index).toString().padStart(4, "0")}-${(2000 + index).toString().padStart(4, "0")}`,
        website: undefined,
        address1: "Av. Principal",
        number: String(100 + index),
        city: customer.city,
        state: customer.state,
        country: customer.country,
        postalCode: customer.country === "BRAZIL" ? "01000-000" : undefined,
        companyType: ["Customer"],
        ownerId,
        customerProfile: hasProfile
          ? {
              create: {
                segment: customer.segment,
                size: customer.size,
                status: customer.status,
                source: "Indicação",
                sourceSpecify: "Rede de contatos",
                accountPotential: customer.accountPotential,
                estimatedVolume: 10 + index,
                volumeUnit: "Container",
                currency: customer.country === "BRAZIL" ? "BRL" : "USD",
                cargoType: customer.cargoType,
              },
            }
          : undefined,
      },
    });
  }

  for (const [index, lead] of LEADS.entries()) {
    const existingCompany = await prisma.company.findUnique({
      where: { taxId: lead.taxId },
    });
    if (existingCompany) continue;

    const operatorId = owners[index % owners.length];

    const company = await prisma.company.create({
      data: {
        displayName: lead.companyName,
        legalName: lead.legalName,
        taxId: lead.taxId,
        foreignValue: false,
        country: "BRAZIL",
        companyType: ["Lead"],
      },
    });

    const contact = await prisma.contact.create({
      data: {
        companyId: company.id,
        firstName: lead.contactName,
        lastName: lead.contactLastName,
        fullName: `${lead.contactName} ${lead.contactLastName}`,
        email: `${slugify(lead.contactName)}.${slugify(lead.contactLastName)}@${slugify(lead.companyName)}.com.br`,
        phoneNumber: `+55 (11) 9${(3000 + index).toString().padStart(4, "0")}-${(4000 + index).toString().padStart(4, "0")}`,
        jobTitle: lead.jobTitle,
        language: "Português",
      },
    });

    await prisma.lead.create({
      data: {
        customerId: company.id,
        contactId: contact.id,
        operatorId,
        status: lead.status,
        source: lead.source,
        urgency: lead.urgency,
        score: lead.score,
        currency: "BRL",
        modal: lead.modal,
        estimatedVolume: 5 + index,
        volumeUnit: "Container",
      },
    });
  }

  console.log("Seed concluído.");
  console.log("Login admin: admin@crm.local / admin123");
  console.log("Login comercial: comercial@crm.local / comercial123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
