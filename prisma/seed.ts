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
  flexitanks_edit: true,
  flexitanks_create: true,
  flexitanks_delete: true,
  purchase_orders_create: true,
  purchase_orders_edit: true,
  purchase_orders_delete: true,
  accessories_create: true,
  accessories_delete: true,
};

const COMMERCIAL_PERMISSIONS = {
  customers_create: true,
  customers_edit: true,
  customers_delete: false,
  leads_create: true,
  leads_edit: true,
  leads_delete: false,
  flexitanks_edit: true,
  flexitanks_create: true,
  flexitanks_delete: false,
  purchase_orders_create: true,
  purchase_orders_edit: true,
  purchase_orders_delete: false,
  accessories_create: true,
  accessories_delete: false,
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

  await seedFlexitanks();
  await seedDashboardData();

  console.log("Seed concluído.");
  console.log("Login admin: admin@crm.local / admin123");
  console.log("Login comercial: comercial@crm.local / comercial123");
}

type SeedDepot = {
  portName: string;
  portCode: string;
  companyDisplayName: string;
  companyLegalName: string;
};

const DEPOTS: SeedDepot[] = [
  { portName: "PARANAGUA", portCode: "PNG", companyDisplayName: "MULTIPORTLOG", companyLegalName: "MULTIPORTLOG TERMINAIS LTDA" },
  { portName: "SANTOS", portCode: "SSZ", companyDisplayName: "SIGMA", companyLegalName: "SIGMA TRANSPORTES E LOGISTICA LTDA" },
  { portName: "SALVADOR", portCode: "SSA", companyDisplayName: "JOSÉ RUBEM", companyLegalName: "José Rubem Transportes e Equipamentos Ltda." },
  { portName: "RIO GRANDE", portCode: "RIG", companyDisplayName: "DAR (Rio Grande)", companyLegalName: "D A R Transportes e Comercio LTDA" },
  { portName: "SAO SEBASTIAO", portCode: "SSO", companyDisplayName: "D.A.R.", companyLegalName: "D A R Transportes e Comercio LTDA" },
];

type SeedFlexitank = {
  serialNumber: string;
  fhbStock: string;
  size: string;
  price: number;
  status: "Available" | "Used" | "Waiting" | "Damaged";
  depotIndex: number;
  poNumber?: string;
  tempAdmissionNumber?: string;
  container?: string;
  tare?: number;
  seal?: string;
  netWeight?: string;
};

const FLEXITANKS: SeedFlexitank[] = [
  { serialNumber: "FHB19-325CG0171", fhbStock: "M938783250150011", size: "19kl", price: 410, status: "Available", depotIndex: 1, poNumber: "BRFPO25002", tempAdmissionNumber: "13032.425193/2025-49" },
  { serialNumber: "FHB19-325CG0211", fhbStock: "M938783250150012", size: "19kl", price: 410, status: "Available", depotIndex: 1, poNumber: "BRFPO25002", tempAdmissionNumber: "13032.425193/2025-49" },
  { serialNumber: "FHB20-322PB057", fhbStock: "M938783220150004", size: "20kl", price: 2503, status: "Available", depotIndex: 0, poNumber: "BRFPO22001", tempAdmissionNumber: "13033.164829/2022-18" },
  { serialNumber: "FHB19-321RI295", fhbStock: "M938783210850007", size: "19kl", price: 346, status: "Available", depotIndex: 0, poNumber: "BRFPO21007", tempAdmissionNumber: "13033.769889/2021-41" },
  { serialNumber: "FHB19-325BX0137", fhbStock: "M938783250150013", size: "19kl", price: 410, status: "Available", depotIndex: 1, poNumber: "BRFPO25001", tempAdmissionNumber: "13032.425296/2025-17" },
  { serialNumber: "FHB21-321RI241", fhbStock: "M938783210850008", size: "21kl", price: 480, status: "Available", depotIndex: 1, poNumber: "BRFPO21007", tempAdmissionNumber: "13033.769889/2021-41" },
  { serialNumber: "FHB19-321R9090", fhbStock: "M938783210850009", size: "19kl", price: 346, status: "Available", depotIndex: 0, poNumber: "BRFPO21009", tempAdmissionNumber: "13033.014327/2022-47" },
  { serialNumber: "FHB24-322GU185", fhbStock: "M938783221050002", size: "24kl", price: 445, status: "Used", depotIndex: 0, container: "TCLU9026513", tare: 3740, seal: "0556531", netWeight: "26850" },
  { serialNumber: "FHB24-324KN249", fhbStock: "M938783250150001", size: "24kl", price: 433, status: "Used", depotIndex: 1, container: "TRHU2077269", tare: 2180, seal: "L9582528", netWeight: "22750" },
  { serialNumber: "FHB24-325GC0488", fhbStock: "M938783250550008", size: "24kl", price: 367, status: "Used", depotIndex: 1, container: "ECMU2851080", tare: 2160, seal: "K0987506", netWeight: "21520" },
  { serialNumber: "FHB22-325CG0172", fhbStock: "M938783250150014", size: "22kl", price: 420, status: "Waiting", depotIndex: 3, poNumber: "BRFPO25002", tempAdmissionNumber: "13032.425193/2025-49" },
  { serialNumber: "FHB23-321R9091", fhbStock: "M938783210850010", size: "23kl", price: 495, status: "Damaged", depotIndex: 4, poNumber: "BRFPO21009", tempAdmissionNumber: "13033.014327/2022-47" },
];

async function seedFlexitanks() {
  const existingFlexitank = await prisma.flexitank.findFirst();
  if (existingFlexitank) return;

  const depotRefs = [];
  for (const depot of DEPOTS) {
    let port = await prisma.port.findFirst({ where: { portCode: depot.portCode } });
    if (!port) {
      port = await prisma.port.create({
        data: { portName: depot.portName, portCode: depot.portCode, countryName: "BRAZIL" },
      });
    }

    let company = await prisma.company.findFirst({ where: { displayName: depot.companyDisplayName } });
    if (!company) {
      company = await prisma.company.create({
        data: {
          displayName: depot.companyDisplayName,
          legalName: depot.companyLegalName,
          taxId: `WAREHOUSE-${depot.portCode}`,
          foreignValue: false,
          country: "BRAZIL",
          companyType: ["Warehouse / Terminal"],
        },
      });
    }

    const existingDepot = await prisma.flexitankDepot.findFirst({
      where: { portId: port.id, companyId: company.id },
    });
    if (!existingDepot) {
      await prisma.flexitankDepot.create({ data: { portId: port.id, companyId: company.id } });
    }

    depotRefs.push({ port, company });
  }

  const [product, shippingLine, shipper, consignee, customer] = await Promise.all([
    prisma.product.create({ data: { productName: "Crude Glycerin" } }),
    prisma.company.create({
      data: { displayName: "MAERSK", legalName: "MAERSK", taxId: "MAERSK-SHIPPING-LINE", foreignValue: false, country: "BRAZIL", companyType: ["Shipping Line"] },
    }),
    prisma.company.create({
      data: { displayName: "AGROFORTE", legalName: "AGROFORTE INDÚSTRIA, COMÉRCIO E TRANSPORTE LTDA", taxId: "SHIPPER-AGROFORTE", foreignValue: false, country: "BRAZIL", companyType: ["Shipper"] },
    }),
    prisma.company.create({
      data: { displayName: "STX COMMODITIES", legalName: "STX COMMODITIES BV", taxId: "CONSIGNEE-STX", foreignValue: true, country: "NETHERLANDS", companyType: ["Consignee"] },
    }),
    prisma.company.create({
      data: { displayName: "Global Grains Co.", legalName: "Global Grains Company Inc.", taxId: "CUSTOMER-GLOBALGRAINS", foreignValue: true, country: "UNITED STATES", companyType: ["Customer"] },
    }),
  ]);

  const purchaseOrders = new Map<string, string>();
  for (const flexitank of FLEXITANKS) {
    if (!flexitank.poNumber || purchaseOrders.has(flexitank.poNumber)) continue;
    const po = await prisma.purchaseOrder.create({
      data: {
        poNumber: flexitank.poNumber,
        tempAdmissionNumber: flexitank.tempAdmissionNumber,
        tempAdmissionDate: new Date("2025-03-07"),
        clearenceDate: new Date("2025-06-09"),
      },
    });
    purchaseOrders.set(flexitank.poNumber, po.id);
  }

  const shipment = await prisma.shipment.create({
    data: {
      booking: "262999684",
      sslBookingNumber: "262999684",
      customerId: customer.id,
      shipperId: shipper.id,
      consigneeId: consignee.id,
      shippingLineId: shippingLine.id,
      productId: product.id,
      portLoadId: depotRefs[1].port.id,
      portDischargeId: depotRefs[0].port.id,
      vessel: "MAERSK LEON",
      voyage: "604N",
      etd: new Date("2026-01-16"),
      atd: new Date("2026-01-22"),
      eta: new Date("2026-02-26"),
      mblNumber: "MEDUFX129465",
      hblNumber: "COLAAL260007",
      status: "Booked",
    },
  });

  for (const flexitank of FLEXITANKS) {
    const depot = depotRefs[flexitank.depotIndex];
    const created = await prisma.flexitank.create({
      data: {
        serialNumber: flexitank.serialNumber,
        fhbStock: flexitank.fhbStock,
        size: flexitank.size,
        price: flexitank.price,
        status: flexitank.status,
        locationId: flexitank.status === "Available" || flexitank.status === "Waiting" || flexitank.status === "Damaged" ? depot.company.id : null,
        purchaseOrderId: flexitank.poNumber ? purchaseOrders.get(flexitank.poNumber) : null,
        shipmentId: flexitank.status === "Used" ? shipment.id : null,
        comment: flexitank.status === "Damaged" ? "Lona rasgada durante o descarregamento." : null,
      },
    });

    if (flexitank.container) {
      await prisma.container.create({
        data: {
          containerNumber: flexitank.container,
          tare: flexitank.tare,
          seal: flexitank.seal,
          netWeight: flexitank.netWeight,
          fitting: "12/01/2026",
          loading: "14/01/2026",
          flexitankId: created.id,
          shipmentId: shipment.id,
        },
      });
    }
  }

  console.log("Flexitanks seed concluído.");
}

const SHIPMENT_TYPES = [
  "Flexitank - Full Service",
  "Flexitank - Supply & Fit",
  "Flexitank - Supply Only",
  "Isotank - Full Service",
  "Isotank - Rental Only",
  "General Cargo",
];

const PAST_STATUSES = ["Shipped", "Arrived", "Arrived", "Shipped", "Cancelled"];
const CURRENT_STATUSES = ["Booked", "In Operation", "Pending", "Shipped", "Arrived"];
const FUTURE_STATUSES = ["Booked", "Pending", "Waiting Departure"];

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/** month offset relative to the current month (0 = this month, -1 = last month, 1 = next month) */
function monthStart(offset: number) {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  date.setMonth(date.getMonth() + offset);
  return date;
}

function randomDateInMonth(monthDate: Date) {
  const day = 1 + Math.floor(Math.random() * 27);
  return new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
}

async function seedDashboardData() {
  const existingQuote = await prisma.quote.findFirst();
  if (existingQuote) return;

  const customerCompanies = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id FROM companies WHERE company_type @> '["Customer"]'::jsonb
  `;

  const [shippingLine, shipper, consignee, product] = await Promise.all([
    prisma.company.findFirst({ where: { taxId: "MAERSK-SHIPPING-LINE" } }),
    prisma.company.findFirst({ where: { taxId: "SHIPPER-AGROFORTE" } }),
    prisma.company.findFirst({ where: { taxId: "CONSIGNEE-STX" } }),
    prisma.product.findFirst(),
  ]);

  // Demo companies to populate the "Leads / Potenciais / Novos" breakdown (companies created this month).
  const leadCompany = await prisma.company.create({
    data: {
      displayName: "Nova Fronteira Log",
      legalName: "Nova Fronteira Logística LTDA",
      taxId: "DASH-LEAD-001",
      foreignValue: false,
      country: "BRAZIL",
      companyType: ["Customer"],
    },
  });
  const potentialCompany = await prisma.company.create({
    data: {
      displayName: "Rota Sul Comércio",
      legalName: "Rota Sul Comércio Exterior LTDA",
      taxId: "DASH-POTENTIAL-001",
      foreignValue: false,
      country: "BRAZIL",
      companyType: ["Customer"],
    },
  });
  const newCompany = await prisma.company.create({
    data: {
      displayName: "Prisma Exportadora",
      legalName: "Prisma Exportadora LTDA",
      taxId: "DASH-NEW-001",
      foreignValue: false,
      country: "BRAZIL",
      companyType: ["Customer"],
    },
  });

  await prisma.quote.create({ data: { customerId: potentialCompany.id } });

  // Only the pre-existing customer pool feeds the random monthly generation — the 3 demo
  // companies above are kept isolated so the Leads/Potenciais/Novos buckets stay deterministic.
  const customerIds = customerCompanies.map((c) => c.id);

  for (let offset = -12; offset <= 1; offset++) {
    const monthDate = monthStart(offset);
    const statusPool =
      offset < 0 ? PAST_STATUSES : offset === 0 ? CURRENT_STATUSES : FUTURE_STATUSES;
    const shipmentCount = 5 + Math.floor(Math.random() * 10);

    for (let i = 0; i < shipmentCount; i++) {
      const etd = randomDateInMonth(monthDate);
      const status = pick(statusPool);
      const atd = offset < 0 ? etd : offset === 0 && Math.random() > 0.5 ? etd : null;

      await prisma.shipment.create({
        data: {
          booking: `DASH${offset}-${i}`,
          customerId: pick(customerIds),
          shipperId: shipper?.id,
          consigneeId: consignee?.id,
          shippingLineId: shippingLine?.id,
          productId: product?.id,
          etd,
          atd,
          status,
          shipmentType: pick(SHIPMENT_TYPES),
          quantity: 1 + Math.floor(Math.random() * 8),
        },
      });
    }
  }

  // Guarantee the "Novo" bucket has at least one shipment this month.
  await prisma.shipment.create({
    data: {
      booking: "DASH-NEWCO",
      customerId: newCompany.id,
      shipperId: shipper?.id,
      consigneeId: consignee?.id,
      shippingLineId: shippingLine?.id,
      productId: product?.id,
      etd: new Date(),
      status: "Booked",
      shipmentType: pick(SHIPMENT_TYPES),
      quantity: 3,
    },
  });

  console.log("Dashboard seed concluído.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
