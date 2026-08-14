import Link from "next/link";

import * as dashboardService from "@/server/modules/dashboard/dashboard.service";

import { AnnualShipmentsChart } from "./_components/annual-shipments-chart";
import { CargoProfileChart } from "./_components/cargo-profile-chart";
import { CustomerAcquisitionList } from "./_components/customer-acquisition-list";
import { FlexitankAvailabilityGrid } from "./_components/flexitank-availability-grid";
import { KpiStrip } from "./_components/kpi-strip";
import { PeriodCards } from "./_components/period-cards";
import { StatusShipmentsPanel } from "./_components/status-shipments-panel";

function ZoneLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-navy-400">
      {children}
    </p>
  );
}

function referenceMonthLabel() {
  const label = new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const [month, , year] = label.split(" ");
  return `${month.charAt(0).toUpperCase()}${month.slice(1)}/${year}`;
}

export default async function DashboardPage() {
  const [
    customerNew,
    customerTotal,
    shipmentsSummary,
    containerSummary,
    annualShipments,
    shipmentType,
    statusShipments,
    flexitank,
  ] = await Promise.all([
    dashboardService.getCustomerNew(),
    dashboardService.getCustomerTotal(),
    dashboardService.getShipmentsSummary(),
    dashboardService.getContainerSummary(),
    dashboardService.getAnnualShipments(),
    dashboardService.getShipmentTypeBreakdown(),
    dashboardService.getStatusShipments(),
    dashboardService.getFlexitankAvailability(),
  ]);

  const activeSizes = flexitank.sizes.filter(
    (size) => flexitank.available[size] > 0 || flexitank.expected[size] > 0
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Dashboard</h1>
          <p className="text-sm text-navy-500">
            <Link href="/dashboard" className="hover:underline">
              Home
            </Link>
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-white px-3.5 py-2 text-sm font-semibold text-navy-900">
          <span className="h-1.5 w-1.5 rounded-full bg-status-lead" />
          Referência: {referenceMonthLabel()}
        </span>
      </div>

      <div>
        <ZoneLabel>Agora — mês atual</ZoneLabel>
        <KpiStrip
          bookings={shipmentsSummary.currentMonth}
          bookingsDelta={shipmentsSummary.percCurrent}
          containers={containerSummary.currentMonth}
          containersDelta={containerSummary.percCurrent}
          activeCustomers={customerTotal.currentMonth}
          newCustomers={customerNew.new}
        />
      </div>

      <div>
        <ZoneLabel>Comercial e embarques — visão do período</ZoneLabel>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-bold text-navy-900">
              Aquisição de clientes — mês
            </p>
            <CustomerAcquisitionList
              leads={customerNew.leads}
              potential={customerNew.potential}
              new={customerNew.new}
            />

            <hr className="my-5 border-navy-100" />

            <p className="mb-3 text-sm font-bold text-navy-900">
              Base de clientes ativos
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold text-navy-900">
                  {customerTotal.prevMonth}
                </p>
                <p className="text-xs font-medium text-navy-500">Mês anterior</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-navy-900">
                  {customerTotal.currentMonth}
                </p>
                <p className="text-xs font-medium text-navy-500">Mês atual</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-navy-900">
                  {customerTotal.nextMonth}
                </p>
                <p className="text-xs font-medium text-navy-500">Próx. mês</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-bold text-navy-900">Embarques por período</p>
            <PeriodCards shipmentsSummary={shipmentsSummary} containerSummary={containerSummary} />
          </div>
        </div>
      </div>

      <div>
        <ZoneLabel>Tendências — últimos 12 meses</ZoneLabel>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-bold text-navy-900">
              Evolução de embarques
            </p>
            <AnnualShipmentsChart data={annualShipments} />
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-bold text-navy-900">Perfil de cargas</p>
            <CargoProfileChart data={shipmentType} />
          </div>
        </div>
      </div>

      <div>
        <ZoneLabel>Operacional</ZoneLabel>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <StatusShipmentsPanel rows={statusShipments} />
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-bold text-navy-900">
              Flexitanks disponíveis
            </p>
            <FlexitankAvailabilityGrid
              sizes={activeSizes}
              available={flexitank.available}
              expected={flexitank.expected}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
